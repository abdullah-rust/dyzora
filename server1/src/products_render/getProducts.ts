import { Request, Response } from "express";
import pool from "../clients/pg";

// 💡 Helper function to safely parse and prepare SQL values (optional but recommended)
const sanitize = (value: string) => value.replace(/'/g, "''");

export async function getProducts(req: Request, res: Response) {
  try {
    // --- 1. Query Parameters Extraction and Defaults ---
    const {
      page = "1",
      limit = "10",
      sort = "date_desc",
      category,
      brand,
      min_price,
      max_price,
      search,
    } = req.query as { [key: string]: string | undefined };

    // --- 2. Base Query and Conditions ---
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let whereConditions: string[] = ["is_active = TRUE"]; // Sirf active products dikhana

    // --- 3. Filtering Logic ---
    // --- 3. Filtering Logic (FIXED) ---
    if (category) {
      // 1. Agar tumne pehle database mein saari categories ko lowercase kiya hai,
      // toh hum yahan bhi lowercase use karenge.
      const safeCategory = sanitize(category).toLowerCase();

      // 2. Exact match ke bajaye ILIKE (Case-Insensitive LIKE) use karo.
      // Agar tum '/shop/home-and-kitchen' bhej rahe ho, aur database mein 'home & kitchen' hai,
      // toh tumhein partial matching ki zaroorat hai, aur ILIKE case-insensitive bhi hai.

      // 🚀 Recommended Fix for Case-Insensitive and Partial Matching:
      whereConditions.push(`category ILIKE '%${safeCategory}%'`);

      /*
        // Agar tumne database mein 'Home & Kitchen' ko 'home & kitchen' kar diya hai,
        // toh yeh bhi chalega aur sirf case-insensitive rahega:
        // whereConditions.push(`LOWER(category) = '${safeCategory}'`);
      */
    }

    if (brand) {
      whereConditions.push(`brand = '${sanitize(brand)}'`);
    }

    if (min_price && !isNaN(parseFloat(min_price))) {
      whereConditions.push(`price >= ${parseFloat(min_price)}`);
    }

    if (max_price && !isNaN(parseFloat(max_price))) {
      whereConditions.push(`price <= ${parseFloat(max_price)}`);
    }

    // --- 4. Search Logic ---
    if (search) {
      // 1. Search term ko spaces se alag alag words mein toro
      const searchTerms = search.split(/\s+/).filter((t) => t.length > 0);

      if (searchTerms.length > 0) {
        // Har word ke liye ILIKE condition banao
        const termConditions = searchTerms.map((term) => {
          const safeTerm = sanitize(term);
          // Har word name ya description mein hona chahiye
          return `(name ILIKE '%${safeTerm}%' OR description ILIKE '%${safeTerm}%')`;
        });

        // Sabhi word conditions ko AND se join karo (yani, product mein woh SARE words hone chahiye)
        whereConditions.push(`(${termConditions.join(" AND ")})`);
      }
    }
    // --- 5. Sorting Logic ---
    let orderBy: string;
    switch (sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "name ASC";
        break;
      case "date_asc":
        orderBy = "created_at ASC";
        break;
      case "date_desc": // Default sort
      default:
        orderBy = "created_at DESC";
        break;
    }

    // Final WHERE clause
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // --- 6. Total Count Query (For Pagination Metadata) ---
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) FROM products ${whereClause}`
    );
    const totalProducts = parseInt(totalCountResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // --- 7. Main Data Query ---
    const productsQuery = `
      SELECT 
        id, 
        name, 
        description, 
        category, 
        brand, 
        price, 
        images[1] AS primary_image, 
        variants 
      FROM products
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2
    `;

    const productsResult = await pool.query(productsQuery, [limitNum, offset]);

    // --- 8. Response ---
    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      metadata: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
      data: productsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching public products:", err);
    res.status(500).send({
      success: false,
      message: "Server error during product retrieval.",
    });
  }
}

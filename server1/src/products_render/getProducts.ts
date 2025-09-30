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
    if (category) {
      whereConditions.push(`category = '${sanitize(category)}'`);
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
      // ILIKE (case-insensitive) search on Name and Description
      const safeSearch = sanitize(search);
      whereConditions.push(
        `(name ILIKE '%${safeSearch}%' OR description ILIKE '%${safeSearch}%')`
      );
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

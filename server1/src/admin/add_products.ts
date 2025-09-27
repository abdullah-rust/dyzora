import { Request, Response } from "express";
// Tumhare MinIO aur PostgreSQL clients ke zaroori imports
import { minioClient } from "../clients/minio";
import pool from "../clients/pg";
import dotenv from "dotenv";

dotenv.config();

// Interfaces for type safety (Agar tum TypeScript use kar rahe ho)
interface ProductBody {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  price: string; // Front-end se string aayega
  stock_quantity: string; // Front-end se string aayega
  tags: string; // Front-end se JSON string aayega
  variants: string; // Front-end se JSON string aayega
}

export const addProduct = async (
  req: Request,
  res: Response
): Promise<any | any> => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      brand,
      sku,
      price,
      stock_quantity,
      tags,
      variants,
    } = req.body as ProductBody; // Type casting for better clarity

    const imageUrls: string[] = [];

    // --- 1. File Upload (MinIO) ---

    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];

      for (const file of files) {
        const objectName = `${Date.now()}-${file.originalname.replace(
          / /g,
          "_"
        )}`;

        // --- FIX YAHAN HAI ---
        await minioClient.putObject(
          "products",
          objectName,
          file.buffer,
          file.size, // <-- file.size (number) size argument ki jagah use ho raha hai
          {
            // <-- Metadata object
            "Content-Type": file.mimetype, // <-- file.mimetype yahan jaayega
          }
        );
        // -----------------------

        const url = `http://${process.env["MINIO_ENDPOINT"]}:${process.env["MINIO_PORT"]}/products/${objectName}`;
        imageUrls.push(url);
      }
    }

    // --- 2. Data Parsing ---
    // Tags aur Variants ko JSON string se actual object/array mein convert karna
    const parsedTags = JSON.parse(tags);
    const parsedVariants = JSON.parse(variants);

    // Safety check: price aur stock_quantity ko Number mein convert karna
    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock_quantity);

    // --- 3. PostgreSQL Database Insert ---
    const result = await pool.query(
      `INSERT INTO products(name, description, category, subcategory, brand, sku, price, stock_quantity, tags, images, variants)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        name,
        description,
        category,
        subcategory,
        brand,
        sku,
        numericPrice, // Numberic value
        numericStock, // Numberic value
        parsedTags, // Array of strings (TEXT[])
        imageUrls, // Array of strings (TEXT[])
        parsedVariants, // JSONB object
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error adding product:", error);
    // Behtar error message jab JSON parsing mein masla ho
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in tags or variants field.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error during product insertion.",
    });
  }
};

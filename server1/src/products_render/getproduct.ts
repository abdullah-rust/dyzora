import { Request, Response } from "express";
import pool from "../clients/pg";

export default async function getProduct(
  req: Request,
  res: Response
): Promise<any | any> {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Insert product id" });
    }

    const fetch = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    const product = fetch.rows[0];

    // ✅ FIX: Check if product was found

    if (!product) {
      // Agar ID theek hai lekin product maujood nahi, to 404 Not Found return karo
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // ✅ If found, return the data
    return res.status(200).json({
      success: true,
      data: product,
      message: "Product loaded successfully.",
    });
  } catch (err) {
    console.error("Error fetching public product:", err);
    res.status(500).send({
      success: false,
      message: "Server error during product retrieval.",
    });
  }
}

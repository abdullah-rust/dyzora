import { Request, Response } from "express";
import pool from "../clients/pg";

export default async function getComments(
  req: Request,
  res: Response
): Promise<any | any> {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: "Insert product id" });
    }

    // ... (getComments function mein)

    const fetch = await pool.query(
      `
      SELECT 
          pc.id, 
          pc.rating, 
          pc.comment, 
          pc.created_at,
          u.name AS user_name     -- User ka naam ab 'name' column se aayega
      FROM product_comments pc
      JOIN users u ON pc.user_id = u.id 
      WHERE pc.product_id = $1 
      AND pc.is_visible = TRUE          
      ORDER BY pc.created_at DESC       
      `,
      [productId]
    );

    // ...

    return res.status(200).json({
      success: true,
      data: fetch.rows,
      message: "comments loaded successfully.",
    });
  } catch (err) {
    console.error("Error fetching public product:", err);
    res.status(500).send({
      success: false,
      message: "Server error during  comment loading.",
    });
  }
}

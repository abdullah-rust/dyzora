import { Request, Response } from "express";
import pool from "../clients/pg";
export async function order_history(req: Request, res: Response) {
  try {
    let id = (req as any).id;

    let data = await pool.query("SELECT * FROM orders WHERE user_id=$1", [id]);

    if (data.rowCount == 0) {
      return res.status(200).json("No order History found");
    }

    return res
      .status(200)
      .json({ data: data.rows, message: "Order History Found" });
  } catch (e) {
    console.log("get profile Error", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

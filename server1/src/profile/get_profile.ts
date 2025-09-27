import { Request, Response } from "express";
import pool from "../clients/pg";
export async function Get_Profile(req: Request, res: Response) {
  try {
    let id = (req as any).id;

    let data = await pool.query(
      "SELECT name,email,created_at FROM users WHERE id=$1",
      [id]
    );

    if (data.rowCount == 0) {
      console.log("db fetch error");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ data: data.rows[0], message: "handle data" });
  } catch (e) {
    console.log("get profile Error", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import { Request, Response } from "express";
import pool from "../clients/pg";
export async function Delete_Address(req: Request, res: Response) {
  try {
    let id = req.params["id"];
    let user_id = (req as any).id;

    let insert = await pool.query(
      "DELETE FROM addresses WHERE user_id=$1 AND id =$2",
      [user_id, id]
    );

    if (insert.rowCount == 0) {
      console.log("db fetch error");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "delete address " });
  } catch (e) {
    console.log("get profile Error", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

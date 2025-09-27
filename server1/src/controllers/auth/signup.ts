import { Request, Response } from "express";
import pool from "../../clients/pg";
import { hashPassword } from "../../utils/paswordHash";
import { createRefreshToken, createAccessToken } from "../../utils/jwt";

interface Signup {
  name: string;
  email: string;
  password: string;
}

export async function Signup(
  req: Request,
  res: Response
): Promise<Response | any> {
  try {
    // import data from body
    const data: Signup = req.body;
    // check user alrady exist
    const checkuser = await pool.query(
      "SELECT email FROM users WHERE email=$1",
      [data.email]
    );

    if (checkuser.rowCount != 0) {
      return res.status(400).json({ message: "User Alrady Exist " });
    }

    let password_hash = await hashPassword(data.password);

    if (!password_hash) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const pushdb = await pool.query(
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id",
      [data.name, data.email, password_hash]
    );

    if (pushdb.rowCount == 0) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const id = pushdb.rows[0].id;
    const accessToken = await createAccessToken(id);
    const refreshToken = await createRefreshToken(id);

    if (!accessToken || !refreshToken) {
      return res.send(500).json({ message: "Internal Server Error" });
    }

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.redirect("http://localhost/profile");
  } catch (e) {
    console.log("from signup Error", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

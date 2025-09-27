import { Request, Response } from "express";
import pool from "../../clients/pg";
import { verifyPassword } from "../../utils/paswordHash";
import { createRefreshToken, createAccessToken } from "../../utils/jwt";

interface Login {
  email: string;
  password: string;
}

export async function Login(
  req: Request,
  res: Response
): Promise<Response | any> {
  try {
    const data: Login = req.body;
    // check user exist
    const checkUser = await pool.query(
      "SELECT id,name,password_hash FROM users WHERE email=$1",
      [data.email]
    );
    if (checkUser.rowCount == 0) {
      return res.status(400).json({ message: "User not found" });
    }

    if (checkUser.rows[0].password_hash == "") {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const checkPassword = await verifyPassword(
      checkUser.rows[0].password_hash,
      data.password
    );

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const id = checkUser.rows[0].id;
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

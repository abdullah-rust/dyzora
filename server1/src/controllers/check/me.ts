import { Request, Response } from "express";
import { verifyRefreshToken } from "../../utils/jwt";

export default async function Me(
  req: Request,
  res: Response
): Promise<any | any> {
  try {
    const accessToken = req.cookies["access_token"];
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken || !accessToken) {
      return res.status(400).json({ message: "Unothrized" });
    }

    const verify = await verifyRefreshToken(refreshToken);

    if (!verify) {
      return res.status(400).json({ message: "Unothrized" });
    }

    res.status(200).json({ message: "authrized" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

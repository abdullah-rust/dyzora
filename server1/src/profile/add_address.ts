import { Request, Response, NextFunction } from "express";
import pool from "../clients/pg";
import { z } from "zod";

interface Address {
  label: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export async function Add_adsress(req: Request, res: Response) {
  try {
    let id = (req as any).id;
    let data = (req as any).validatedBody as Address;

    let add = await pool.query(
      "INSERT INTO addresses(user_id,label,fullName,phoneNumber,street,city,state,postalCode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        id,
        data.label,
        data.fullName,
        data.phoneNumber,
        data.street,
        data.city,
        data.state,
        data.postalCode,
      ]
    );
    if (add.rowCount == 0) {
      console.log("address insertion error");

      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "address added" });
  } catch (e) {
    console.log("get profile Error", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const add_address_schema = z.object({
  label: z.string().trim().min(1, "Label is required").max(50),
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20)
    .regex(/^\+?[0-9\s\-]+$/, "Invalid phone number"),
  street: z.string().trim().min(1, "Street is required").max(255),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(20).optional(),
});

// Express middleware factory
export const validate =
  (schema: any) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any | any> => {
    try {
      const validatedBody = schema.parse(req.body);
      // attach validated data to request object
      (req as any).validatedBody = validatedBody;
      next();
    } catch (e: any) {
      if (e) {
        return res.status(400).json({
          success: false,
          errors: e,
        });
      }
      return res
        .status(500)
        .json({ success: false, message: "Validation failed" });
    }
  };

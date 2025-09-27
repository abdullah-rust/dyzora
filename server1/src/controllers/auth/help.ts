import { Request, Response } from "express";
import z from "zod";

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(8, { message: "The name must be at least 8 characters long." })
    .max(50, { message: "Name must not exceed 50 characters in length." }),

  email: z.email({ message: "Your not perfect to match email" }).trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "The password must be at least 8 characters long." })
    .max(50, { message: "password must not exceed 50 characters in length." }),
});

export const LoginSchema = z.object({
  email: z
    .email({ message: "Invalid email address format." })
    .trim()
    .max(100, { message: "Email length does not exceed 100 characters." }),
  password: z
    .string()
    .trim()
    .min(8, { message: "The password must be at least 8 characters long." })
    .max(50, { message: "password must not exceed 50 characters in length." }),
});

export function validateSignup(schema: typeof SignupSchema) {
  return (req: Request, res: Response, next: Function): any => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e: any) {
      return res.status(400).json({
        message: e.errors.map((err: any) => err.message),
        error: "Your data is incomplete.",
      });
    }
  };
}
export function validateLogin(schema: typeof LoginSchema) {
  return (req: Request, res: Response, next: Function): any => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e: any) {
      return res.status(400).json({
        message: e.errors.map((err: any) => err.message),
        error: "Your data is incomplete.",
      });
    }
  };
}

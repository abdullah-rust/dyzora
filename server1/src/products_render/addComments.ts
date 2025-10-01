import { Request, Response } from "express";
import pool from "../clients/pg";
import z from "zod";

// Zod Schema (Jaisa tumne provide kiya)
const schema = z.object({
  // 'required_error' ki jagah, sirf basic type error message 'message' mein diya
  productId: z
    .number({
      // Agar value number nahi hui, to yeh message aayega.
      message: "Product ID must be a valid integer.",
    })
    .int("Product ID must be an integer"),

  comment: z
    .string()
    .trim()
    .min(1, {
      message: "Comment must contain at least one character.",
    })
    .max(1000, {
      message: "Comment cannot exceed 1000 characters.",
    }),

  rating: z
    .number({
      message: "Rating is required and must be a number.",
    })
    .min(1, {
      message: "Rating must be minimum 1 star.",
    })
    .max(5, {
      message: "Rating cannot exceed 5 stars.",
    }),
});

// Zod Type Inference (Validation ke baad data ki type)
type CommentData = z.infer<typeof schema>;

export default async function addComments(
  req: Request,
  res: Response
): Promise<any | any> {
  // Return type ko Promise<void> set kiya, taake Express se match ho
  try {
    // 1. User ID nikalna (req.id tumhare middleware se aa raha hai)
    // 💡 FIX: req.id ke bajaye req.user.id ya jahan se bhi aata hai use karo.
    const userId = (req as any).id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    const data = (req as any).body;

    // 2. Zod Validation
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      // Validation fail hone par 400 Bad Request return karna
      const errorMessages = validationResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessages,
        errors: validationResult.error.format(),
      });
    }

    // Validated data ko destructure kiya
    const { productId, comment, rating } = validationResult.data as CommentData;

    // 3. Database Insertion (Parameterized Query for Security)
    const query = `
      INSERT INTO product_comments (product_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at;
    `;

    const result = await pool.query(query, [
      productId,
      userId,
      rating,
      comment,
    ]);

    // 4. Success Response
    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      commentId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    // Agar DB mein foreign key (product_id ya user_id) ka masla ho, to Express usay yahan catch karega
    res.status(500).send({
      success: false,
      message: "Server error occurred while adding comment.",
    });
  }
}

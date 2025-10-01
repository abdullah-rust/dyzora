"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/app/global/api";
import styles from "./ProductComments.module.css"; // Assume you create a CSS module

export interface Comment {
  id: number;
  rating: number;
  comment: string;
  user_name: string; // Backend se JOIN karke aayega
  profile_image?: string; // Optional
  created_at: string;
} // Use the new interface

// Star rating component (Just a placeholder)
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

interface ProductCommentsProps {
  productId: number; // Product ID is required to fetch/add comments
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. Fetching Logic (Backend: getComments) ---
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      // 💡 API URL: getComments
      const res = await api.get("/get-comments", {
        params: { productId },
      });

      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // --- 2. Submission Logic (Backend: addComments) ---
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    setIsSubmitting(true);

    // Basic Validation
    if (newComment.trim().length < 1 || newRating < 1 || newRating > 5) {
      setSubmissionError(
        "Please write a comment and select a valid rating (1-5)."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // 💡 API URL: addComments
      const res = await api.post("/add-comment", {
        productId: productId,
        comment: newComment.trim(),
        rating: newRating,
        // user ID is handled by your backend middleware
      });

      if (res.data.success) {
        // Success par comments list ko dobara fetch karo taake naya comment bhi dikhe
        setNewComment("");
        setNewRating(5);
        await fetchComments(); // Refetch the list
      } else {
        setSubmissionError(res.data.message || "Failed to submit comment.");
      }
    } catch (error: any) {
      console.error("Comment submission error:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReviews = comments.length;
  const averageRating =
    totalReviews > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / totalReviews
      : 0;

  return (
    <div className={styles.commentsSection}>
      <h2>Customer Reviews ({totalReviews})</h2>

      {totalReviews > 0 && (
        <div className={styles.averageRating}>
          <StarRating rating={Math.round(averageRating)} />
          <p>Average Rating: {averageRating.toFixed(1)} out of 5</p>
        </div>
      )}

      {/* Comment Form */}
      <div className={styles.addCommentForm}>
        <h3>Share Your Thoughts</h3>
        <form onSubmit={handleSubmitComment}>
          <div className={styles.ratingInput}>
            <label>Your Rating:</label>
            <select
              value={newRating}
              onChange={(e) => setNewRating(parseInt(e.target.value))}
              disabled={isSubmitting}
            >
              <option value={5}>5 Stars (Excellent)</option>
              <option value={4}>4 Stars (Very Good)</option>
              <option value={3}>3 Stars (Good)</option>
              <option value={2}>2 Stars (Fair)</option>
              <option value={1}>1 Star (Poor)</option>
            </select>
          </div>

          <textarea
            placeholder="Write your review here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />

          {submissionError && <p className={styles.error}>{submissionError}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p>Be the first to leave a review!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span className={styles.userName}>
                  {comment.user_name || "Anonymous"}
                </span>
                <span className={styles.date}>
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={comment.rating} />
              <p className={styles.commentText}>{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductComments;

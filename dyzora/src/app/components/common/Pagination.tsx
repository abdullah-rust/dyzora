"use client";

import styles from "./Pagination.module.css";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Jab user kisi page par click karega
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null; // Agar sirf aik page ho to kuch show na karo
  }

  // Sirf 5 buttons (current page, uske 2 pehle, aur 2 baad mein) show karne ke liye logic
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // Agar end ki taraf hain to shuruat ko adjust karo
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.paginationContainer}>
      {/* 1. Previous Button */}
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo; Previous
      </button>

      {/* 2. Page Numbers */}
      {startPage > 1 && <span className={styles.ellipsis}>...</span>}

      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.active : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && <span className={styles.ellipsis}>...</span>}

      {/* 3. Next Button */}
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;

"use client";

import ProductGrid from "@/app/components/ProductGrid/ProductGrid";
import Pagination from "@/app/components/common/Pagination";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/app/global/api";
import Header from "@/app/others/Header";

interface Product {
  id: number;
  name: string;
  price: number;
  primary_image: string;
}

export default function CategoriesByType({
  params,
}: {
  params: { name: string };
}) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]); // Product type use kiya
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load_products = useCallback(async () => {
    setLoading(true);
    try {
      const categoryName = params.name; // ✅ yahan await nahi lagana
      const response = await api.get("/get-products", {
        params: {
          limit: 12,
          sort: "date_desc",
          page: currentPage,
          category: categoryName,
        },
      });
      setProducts(response.data.data);
      setTotalPages(response.data.metadata.totalPages);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, params]);

  useEffect(() => {
    load_products();
  }, [currentPage, load_products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Yahan "smooth" hata kar "auto" kar diya, kyunki tumne wohi manga hai
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  return (
    <main>
      <Header />

      {/* --- Loading State Handling Yahan Hogi --- */}
      {loading ? (
        <div style={{ padding: "50px", textAlign: "center" }}>
          Loading Products...
        </div>
      ) : (
        <ProductGrid data={products} />
      )}
      {/* ------------------------------------------ */}

      {/* Pagination sirf tab dikhegi jab loading khatam ho jaye */}
      {!loading && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}

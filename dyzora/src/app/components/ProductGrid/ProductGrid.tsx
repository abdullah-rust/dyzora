"use client";

import { useState, useEffect, useCallback } from "react"; // useCallback import kiya
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";
import { api } from "@/app/global/api";
import Pagination from "../common/Pagination";

interface Product {
  id: number;
  name: string;
  price: number;
  primary_image: string;
}

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // load_products ko useCallback se wrap karo taake yeh useEffect ki dependency mein safely use ho sake
  const load_products = useCallback(async () => {
    setLoading(true);
    try {
      // ⚠️ API URL correct karo: "/api/v1/products"
      const response = await api.get("/get-products", {
        params: {
          limit: 12,
          sort: "random",
          page: currentPage, // <-- Ab yeh sahi tarah se pass ho raha hai
        },
      });

      setProducts(response.data.data);
      // ✅ Total Pages set karna zaroori hai
      setTotalPages(response.data.metadata.totalPages);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setTotalPages(1); // Error par total pages 1 set karo
    } finally {
      setLoading(false); // ✅ Loading state ko band karna
    }
  }, [currentPage]); // <-- currentPage ko dependency mein rakha

  // ✅ useEffect ko currentPage aur load_products par depend karaya
  useEffect(() => {
    // Ab yeh hook tab bhi chalega jab currentPage change hoga
    load_products();
  }, [currentPage, load_products]);

  // handlePageChange function theek hai, isko currentPage update karne do
  const handlePageChange = (page: number) => {
    // Current page change hote hi useEffect dobara load_products call karega
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "auto", // Smooth scrolling ke liye (Optional, lekin behtar dikhta hai)
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading Products...</div>;
  }

  return (
    <section className={styles.gridContainer}>
      <h2 className={styles.sectionTitle}>Featured Products</h2>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            primary_image={product.primary_image}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
};

export default ProductGrid;

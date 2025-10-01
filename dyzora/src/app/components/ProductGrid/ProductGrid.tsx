// src/components/ProductGrid/ProductGrid.tsx (Corrected Component)

"use client";

// Koi local state ki zaroorat nahi
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  primary_image: string;
}

// ⚠️ data prop ko use karo, local state set mat karo
const ProductGrid = ({ data }: { data: Product[] | any[] }) => {
  // Ab data prop ko directly use karenge
  const products: Product[] = data;

  if (!products || products.length === 0) {
    return (
      <section className={styles.gridContainer}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div style={{ textAlign: "center", padding: "50px" }}>
          No products found matching the criteria.
        </div>
      </section>
    );
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
            // Image prop ko theek kiya
            primary_image={product.primary_image}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

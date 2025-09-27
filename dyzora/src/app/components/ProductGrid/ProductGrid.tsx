"use client";

import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cybernetic Hoodie",
    price: 79.99,
    image: "/products/product1.jpg",
  },
  {
    id: 2,
    name: "Nexus Sneakers",
    price: 120.5,
    image: "/products/product2.jpg",
  },
  {
    id: 3,
    name: "Galactic Backpack",
    price: 95.0,
    image: "/products/product3.jpg",
  },
  {
    id: 4,
    name: "LED Smartwatch",
    price: 299.99,
    image: "/products/product4.jpg",
  },
  {
    id: 5,
    name: "Fusion Jacket",
    price: 150.0,
    image: "/products/product5.jpg",
  },
  {
    id: 6,
    name: "Quantum Gloves",
    price: 45.75,
    image: "/products/product6.jpg",
  },
];

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy API call to simulate fetching data from backend
    const fetchProducts = () => {
      setLoading(true);
      setTimeout(() => {
        setProducts(DUMMY_PRODUCTS);
        setLoading(false);
      }, 0); // 1-second delay for simulation
    };

    fetchProducts();
  }, []);

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
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

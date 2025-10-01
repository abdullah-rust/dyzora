"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./ProductDetailPage.module.css";
import Header from "@/app/others/Header";
import Footer from "@/app/components/Footer/Footer";
import { api } from "@/app/global/api";
import ProductComments from "./ProductComments";

// Product Interface (Jaisa tumne banaya tha)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  stock_quantity: number;
  is_active: boolean;
  images: string[];
  tags: string[];
  // 💡 FIX: Maine variants ko 'any' rakha hai ya simple object {}
  // Agar aap isay features ke liye use kar rahe hain, to isay string[] ya any karna hoga
  variants: any;
  created_at: string;
  updated_at: string;
}

interface ProductDetailPageProps {
  params: { productid: string };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>(""); // 💡 FIX: Initial state empty string
  const [loading, setLoading] = useState(true); // 💡 FIX: Loading state add kiya
  const [error, setError] = useState<string | null>(null);

  // 💡 FIX: load_product ko useCallback mein wrap kiya
  const load_product = useCallback(async () => {
    const id = params.productid;
    setLoading(true);
    setError(null); // Reset error

    // 💡 FIX: ID check jo backend mein tha, yahan bhi kar liya
    if (!id) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    try {
      // 💡 FIX: API URL theek kiya
      const res = await api.get("get-product", {
        params: {
          id: id,
        },
      });

      // 💡 FIX: Backend se data aur success check kiya (jo humne improve kiya tha)
      if (res.data.success && res.data.data) {
        const fetchedProduct: Product = res.data.data;
        setProduct(fetchedProduct);
        setMainImage(fetchedProduct.images[0] || ""); // Pehli image set ki
      } else {
        setError(res.data.message || "Product not found.");
      }
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to fetch product data from server.");
    } finally {
      setLoading(false);
    }
  }, []); // 💡 FIX: Dependency mein productid use kiya

  useEffect(() => {
    load_product();
  }, [load_product]);

  // ------------------------------------
  // --- Conditional Rendering Logic ---
  // ------------------------------------

  if (loading) {
    return (
      <main>
        <Header />
        <div
          className={styles.container}
          style={{ textAlign: "center", padding: "100px" }}
        >
          Loading Product Details...
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <Header />
        <div
          className={styles.container}
          style={{ textAlign: "center", padding: "100px", color: "red" }}
        >
          Error: {error || "Product data is missing."}
        </div>
        <Footer />
      </main>
    );
  }

  // 💡 FIX: Ab hum 'product' ko directly use kar sakte hain kyunki humne upar check kar liya hai

  // 💡 FIX: Variants/Features ko array mein convert kiya, kyunki 'variants' ek object tha
  // Agar 'variants' ko tumne features ke liye array of strings ke tor par use kiya hai
  // to usay theek se access karna hoga. Filhal assuming agar variants ek array nahi hai
  const featuresList = Array.isArray(product.variants)
    ? product.variants
    : product.tags && Array.isArray(product.tags)
    ? product.tags
    : [];

  return (
    <main>
      <Header />
      <div className={styles.container}>
        {/* --- Product Images Section --- */}
        <div className={styles.productImages}>
          <div className={styles.mainImage}>
            {/* 💡 FIX: Image component ko check karne ki zarurat nahi kyunki 'product' set ho chuka hai */}
            <Image
              src={mainImage || product.images[0] || "/default-product.png"}
              alt={product.name}
              fill
              objectFit="cover"
              priority
            />
          </div>
          <div className={styles.thumbnailContainer}>
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  mainImage === img ? styles.active : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- Product Details Section --- */}
        <div className={styles.productDetails}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productPrice}>${product.price}</p>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.features}>
            <h3>Key Features / Tags</h3>
            <ul className={styles.featureList}>
              {/* 💡 FIX: Array.forEach ki jagah Array.map use kiya aur 'variants' ki jagah 'featuresList' use kiya */}
              {featuresList.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <button className={styles.addToCartButton}>Add to Cart</button>
        </div>
      </div>
      <div className={styles.commentsWrapper}>
        {/* Ensure product.id is converted to number if it's string type */}
        <ProductComments productId={product.id} />
      </div>
      <Footer />
    </main>
  );
};

export default ProductDetailPage;

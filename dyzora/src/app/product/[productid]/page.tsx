"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductDetailPage.module.css";
import Header from "@/app/others/Header";
import Footer from "@/app/components/Footer/Footer";
// Dummy data for a single product
const dummyProduct = {
  id: "dyz-futur-01",
  name: "Cybernetic Hoodie",
  price: 79.99,
  description:
    "Crafted from advanced nano-fiber fabric, this hoodie is designed for the urban explorer. It features glowing seams, an integrated micro-display on the cuff, and a comfortable fit that's perfect for all-day wear.",
  images: [
    "/products/product1.jpg",
    "/products/product1.jpg",
    "/products/product1.jpg",
    "/products/product1.jpg",
  ],
  features: [
    "Nano-fiber material",
    "LED illuminated seams",
    "Adjustable hood with drawstrings",
    "Integrated cuff display",
  ],
};

const ProductDetailPage = () => {
  const [mainImage, setMainImage] = useState(dummyProduct.images[0]);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.productImages}>
          <div className={styles.mainImage}>
            <Image
              src={mainImage}
              alt={dummyProduct.name}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <div className={styles.thumbnailContainer}>
            {dummyProduct.images.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  mainImage === img ? styles.active : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${dummyProduct.name} thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productDetails}>
          <h1 className={styles.productName}>{dummyProduct.name}</h1>
          <p className={styles.productPrice}>
            ${dummyProduct.price.toFixed(2)}
          </p>

          <p className={styles.description}>{dummyProduct.description}</p>

          <div className={styles.features}>
            <h3>Key Features</h3>
            <ul className={styles.featureList}>
              {dummyProduct.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <button className={styles.addToCartButton}>Add to Cart</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;

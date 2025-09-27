"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./MiniBanner.module.css";

// Yahan apni images ke URLs add karen
const shopBanners = [
  "/banners/shop_banner1.jpg", // Shop page ke liye pehli image
  "/banners/shop_banner2.jpg", // Shop page ke liye doosri image
  "/banners/shop_banner3.jpg", // Shop page ke liye teesri image
  "/banners/shop_banner4.jpg", // Shop page ke liye teesri image
  "/banners/shop_banner5.jpg", // Shop page ke liye teesri image
];

const MiniBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shopBanners.length);
    }, 4000); // Har 4 seconds mein image badlegi

    return () => clearInterval(timer);
  }, []);

  // Manual dot click handler
  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className={styles.miniBannerContainer}>
      {shopBanners.map((src, index) => (
        <div
          key={src}
          className={`${styles.imageWrapper} ${
            index === currentImageIndex ? styles.active : ""
          }`}
        >
          <Image
            src={src}
            alt={`Shop Promotion Banner ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
        </div>
      ))}
      <div className={styles.content}>
        <h2 className={styles.heading}>Fresh Styles, Fresh Deals!</h2>
        <p className={styles.subheading}>
          Explore our exclusive collection for a limited time.
        </p>
        <a href="/all-products" className={styles.shopNowButton}>
          Explore Deals!
        </a>
      </div>

      {/* Dots for manual navigation */}
      <div className={styles.dotsContainer}>
        {shopBanners.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === currentImageIndex ? styles.activeDot : ""
            }`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default MiniBanner;

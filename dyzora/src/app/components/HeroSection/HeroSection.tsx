"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./HeroSection.module.css";

// Yahan apni images ke URLs add karen
const images = [
  "/images/banner1.jpg", // Tumhari pehli image
  "/images/banner2.jpg", // Tumhari doosri image
  "/images/banner3.jpg", // Tumhari teesri image
  "/images/banner4.jpg", // Tumhari teesri image
  "/images/banner5.jpg", // Tumhari teesri image
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Har 5 seconds mein image badalne ke liye
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Component unmount hone par timer clear karen
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroContainer}>
      {images.map((src, index) => (
        <div
          key={src}
          className={`${styles.imageWrapper} ${
            index === currentImageIndex ? styles.active : ""
          }`}
        >
          <Image
            src={src}
            alt={`Promotional Banner ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0} // Pehli image ko priority den
          />
        </div>
      ))}
      <div className={styles.content}>
        <h1 className={styles.heading}>Discover The Future Of Style</h1>
        <p className={styles.subheading}>
          Shop our latest collections and exclusive deals.
        </p>
        <a href="/shop" className={styles.heroButton}>
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;

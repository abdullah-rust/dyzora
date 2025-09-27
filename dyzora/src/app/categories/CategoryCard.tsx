"use client";

import Image from "next/image";
import styles from "./CategoryCard.module.css";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  image: string;
}

const CategoryCard = ({ name, image }: CategoryCardProps) => {
  return (
    <Link
      href={`/shop?category=${name.toLowerCase()}`}
      className={styles.cardLink}
    >
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className={styles.image}
          />
        </div>
        <div className={styles.overlay}>
          <h3 className={styles.categoryTitle}>{name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

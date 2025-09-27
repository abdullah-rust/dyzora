"use client";

import Image from "next/image";
import styles from "./ProductCard.module.css";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ id, name, price, image }: ProductCardProps) => {
  const router = useRouter();

  return (
    <div className={styles.card} onClick={() => router.push(`/product/${id}`)}>
      <div className={styles.imageContainer}>
        <Image src={image} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productPrice}>${price.toFixed(2)}</p>
        <button className={styles.addToCartButton}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;

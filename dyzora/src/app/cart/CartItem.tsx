"use client";

import Image from "next/image";
import styles from "./CartItem.module.css";

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem = ({ id, name, price, image, quantity }: CartItemProps) => {
  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          objectFit="cover"
        />
      </div>
      <div className={styles.itemDetails}>
        <h4 className={styles.itemName}>{name}</h4>
        <p className={styles.itemPrice}>${price.toFixed(2)}</p>
      </div>
      <div className={styles.quantityControl}>
        <button className={styles.quantityButton}>-</button>
        <span className={styles.quantityValue}>{quantity}</span>
        <button className={styles.quantityButton}>+</button>
      </div>
      <div className={styles.itemTotal}>
        <p>${(price * quantity).toFixed(2)}</p>
      </div>
      <button className={styles.removeButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x-circle"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;

"use client";

import styles from "./NotificationCard.module.css";
import Image from "next/image";

interface NotificationCardProps {
  title: string;
  message: string;
  timestamp: string;
  type: "order" | "promo" | "account";
  read: boolean;
}

const NotificationCard = ({
  title,
  message,
  timestamp,
  type,
  read,
}: NotificationCardProps) => {
  const iconSrc = `/icons/${type}.png`; // Dummy icon path

  return (
    <div className={`${styles.card} ${read ? styles.read : ""}`}>
      <div className={styles.iconContainer}>
        <Image src={iconSrc} alt={type} width={24} height={24} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>
    </div>
  );
};

export default NotificationCard;

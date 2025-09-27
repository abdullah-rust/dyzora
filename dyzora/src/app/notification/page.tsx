"use client";

import styles from "./NotificationsPage.module.css";
import NotificationCard from "./NotificationCard";
import Header from "../others/Header";
import Footer from "../components/Footer/Footer";

// Dummy data for notifications
const dummyNotifications = [
  {
    id: 1,
    title: "Your order has been shipped!",
    message: "Order #ORD-12345 is on its way. Estimated delivery in 2 days.",
    timestamp: "2 hours ago",
    type: "order",
    read: false,
  },
  {
    id: 2,
    title: "⚡ Flash Sale! 20% OFF",
    message:
      "Don't miss out on our limited-time flash sale on all jackets. Shop now!",
    timestamp: "1 day ago",
    type: "promo",
    read: false,
  },
  {
    id: 3,
    title: "Password updated successfully",
    message:
      "Your password for Dyzora account was changed. If this wasn't you, please contact support.",
    timestamp: "2 days ago",
    type: "account",
    read: true,
  },
  {
    id: 4,
    title: "Welcome to Dyzora!",
    message:
      "Thank you for creating an account with us. We hope you enjoy your shopping experience.",
    timestamp: "3 days ago",
    type: "account",
    read: true,
  },
];

const NotificationsPage = () => {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Notifications</h1>
        <p className={styles.subtitle}>
          Stay up-to-date with your account activity and latest offers.
        </p>

        <div className={styles.notificationsList}>
          {dummyNotifications.map((notif) => (
            <NotificationCard key={notif.id} {...notif} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationsPage;

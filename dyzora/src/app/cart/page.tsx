"use client";

import styles from "./CartPage.module.css";
import CartItem from "./CartItem";
import Header from "../others/Header";
import Footer from "../components/Footer/Footer";

// Dummy data to display in the cart
const dummyCartItems = [
  {
    id: 1,
    name: "Cybernetic Hoodie",
    price: 79.99,
    image: "/products/product1.jpg",
    quantity: 1,
  },
  {
    id: 2,
    name: "Nexus Sneakers",
    price: 120.5,
    image: "/products/product2.jpg",
    quantity: 2,
  },
  {
    id: 3,
    name: "Galactic Backpack",
    price: 95.0,
    image: "/products/product3.jpg",
    quantity: 1,
  },
];

const CartPage = () => {
  const subtotal = dummyCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 10.0;
  const total = subtotal + shipping;

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Your Shopping Cart</h1>

        <div className={styles.cartContent}>
          <div className={styles.cartItemsList}>
            {dummyCartItems.length === 0 ? (
              <p className={styles.emptyCart}>Your cart is empty.</p>
            ) : (
              dummyCartItems.map((item) => <CartItem key={item.id} {...item} />)
            )}
          </div>

          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Cart Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.totalText}>Total:</span>
              <span className={styles.totalText}>${total.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;

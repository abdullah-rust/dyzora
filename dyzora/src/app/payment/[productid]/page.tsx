"use client";

import { useState } from "react";
import styles from "./PaymentPage.module.css";
import { useRouter } from "next/navigation";
import Header from "@/app/others/Header";
import Footer from "@/app/components/Footer/Footer";

// Dummy data for order summary
const dummyOrder = {
  items: [
    { name: "Cybernetic Hoodie", price: 79.99, quantity: 1 },
    { name: "Nexus Sneakers", price: 120.5, quantity: 1 },
  ],
  subtotal: 200.49,
  shipping: 10.0,
  total: 210.49,
};

export default function PaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment Successful! Your order has been placed.");
      router.push("/profile"); // Redirect to profile or a thank-you page
    }, 2000);
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Secure Checkout</h1>

          <div className={styles.contentWrapper}>
            {/* Order Summary Section */}
            <div className={styles.orderSummary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <ul className={styles.itemList}>
                {dummyOrder.items.map((item, index) => (
                  <li key={index} className={styles.item}>
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.summaryDetails}>
                <div className={styles.detailRow}>
                  <span>Subtotal:</span>
                  <span>${dummyOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Shipping:</span>
                  <span>${dummyOrder.shipping.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total:</span>
                  <span>${dummyOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form Section */}
            <div className={styles.paymentForm}>
              <h2 className={styles.summaryTitle}>Payment Details</h2>
              <form onSubmit={handlePayment}>
                <div className={styles.inputGroup}>
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    required
                    placeholder="1234 5678 9101 1121"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    required
                    placeholder="Ali Raza"
                  />
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      required
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" required placeholder="123" />
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles.payButton}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay $${dummyOrder.total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

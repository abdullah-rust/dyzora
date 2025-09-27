// src/app/not-found.tsx

import Link from "next/link";
import styles from "./not-found.module.css";
import Header from "./others/Header";
import Footer from "./components/Footer/Footer";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404 - Page Not Found</h1>
          <p className={styles.message}>
            Afsos, jis page ko aap dhoondh rahe hain woh yahan maujood nahi hai.
          </p>
          <Link href="/" className={styles.homeLink}>
            Go back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

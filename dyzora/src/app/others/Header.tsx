"use client";

import Image from "next/image";
import styles from "./Header.module.css";
import logo from "../../../public/logo.png";
import { check_login } from "../global/check_login";
import { useEffect, useState } from "react";
import ProfileIcon from "../../../public/icons/account.png";
import { useRouter } from "next/navigation";

export default function Header() {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true); // sirf auth ke liye
  const router = useRouter();
  const [search, setSearch] = useState("");

  const check = async () => {
    const res = await check_login();
    if (res) {
      setLogin(true);
      localStorage.setItem("login", "ok");
    }
    setLoading(false);
  };

  useEffect(() => {
    let check_localstg = localStorage.getItem("login");
    if (!check_localstg) {
      check();
    } else {
      setLogin(true);
      setLoading(false);
    }
  }, []);

  function handleSearch(e: any) {
    e.preventDefault();

    const searchTerm = search;
    if (searchTerm && searchTerm.trim() !== "") {
      router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="Dyzora Logo"
            width={150}
            height={50}
            priority
          />
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>
            Home
          </a>
          <a href="/shop" className={styles.navLink}>
            Shop
          </a>
          <a href="/categories" className={styles.navLink}>
            Categories
          </a>
        </nav>
      </div>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for products..."
              className={styles.searchInput}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className={styles.searchButton} type="submit">
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
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className={styles.rightSection}>
        {/* Cart Icon */}
        <a href="/cart" className={styles.cartIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-shopping-cart"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span className={styles.cartCount}>0</span>
        </a>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          {loading ? (
            // 👇 yahan chhota sa placeholder dal diya
            <span className={styles.loading}>...</span>
          ) : !login ? (
            <div>
              <a href="/auth/login" className={styles.loginButton}>
                Login
              </a>
              <a href="/auth/signup" className={styles.signupButton}>
                Signup
              </a>
            </div>
          ) : (
            <Image
              src={ProfileIcon}
              alt="profile Logo"
              width={40}
              priority
              onClick={() => router.push("/profile")}
            />
          )}
        </div>
      </div>
    </header>
  );
}

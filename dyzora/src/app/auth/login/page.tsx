"use client";

import { useState, useEffect } from "react";
import styles from "./LoginForm.module.css";
import { useRouter } from "next/navigation";
import { check_login } from "@/app/global/check_login";
import GoogleAuthButton from "../google_btn";
import { api } from "@/app/global/api";
import AlertMessage from "@/app/components/AlertMessage/AlertMessage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [login, setLogin] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Yeh line add ki hai

  const check = async () => {
    const res = await check_login();
    if (res) {
      router.replace("/");
    } else {
      setLogin(true);
    }
  };
  useEffect(() => {
    check();
  }, []);

  if (!login) {
    return "";
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Login attempt shuru hote hi loading state ON

    try {
      await api.post("/auth/login", {
        email,
        password,
      });
      router.replace("/profile");
    } catch (e: any) {
      console.log(e);
      setAlert({
        message: e.response?.data.message || e.error?.message,
        type: "error",
      });
    } finally {
      setIsLoading(false); // Request khatam hone par loading state OFF
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  return (
    <div>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Login to Dyzora</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading} // Button ko disable kiya hai
            >
              {isLoading ? "Logging in..." : "Login"}{" "}
              {/* Button ka text change kiya hai */}
            </button>
          </form>
          <GoogleAuthButton />
          <div className={styles.links}>
            <a href="/auth/signup" className={styles.link}>
              Don't have an account? Sign Up
            </a>
            <a href="/auth/forgot-password" className={styles.link}>
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import styles from "./SignupForm.module.css";
import { useRouter } from "next/navigation";
import { check_login } from "@/app/global/check_login";
import GoogleAuthButton from "../google_btn";
import { api } from "@/app/global/api";
import AlertMessage from "@/app/components/AlertMessage/AlertMessage";

export default function SignupForm() {
  const [name, setName] = useState("");
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
    setIsLoading(true); // Signup attempt shuru hote hi loading state ON

    try {
      await api.post("/auth/signup", {
        name,
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
          <h2 className={styles.title}>Create Your Dyzora Account</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              className={styles.signupButton}
              disabled={isLoading} // Button ko disable kiya hai
            >
              {isLoading ? "Signing up..." : "Sign Up"}{" "}
              {/* Button ka text change kiya hai */}
            </button>
          </form>
          {/* Google button yahan add hoga */}
          <GoogleAuthButton />
          <div className={styles.links}>
            <a href="/auth/login" className={styles.link}>
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

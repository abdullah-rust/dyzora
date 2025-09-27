"use client";

import { useState } from "react"; // Yeh line add ki hai
import styles from "./GoogleAuthButton.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GoogleAuthButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Yeh line add ki hai

  const handleGoogleSignIn = () => {
    setIsLoading(true); // Button click hote hi loading state ON
    router.push("/api/user/auth/google");
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className={styles.googleButton}
      disabled={isLoading} // Button ko disable kiya hai
    >
      <Image src="/icons/google.png" alt="Google logo" width={20} height={20} />
      <span>
        {isLoading ? "Redirecting..." : "Continue with Google"}{" "}
        {/* Text change kiya hai */}
      </span>
    </button>
  );
}

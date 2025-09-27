"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import logo from "../../../../public/logo.png";
import instagramIcon from "../../../../public/icons/instagram.png"; // Tumhare file path ke mutabiq
import facebookIcon from "../../../../public/icons/facebook.png"; // Tumhare file path ke mutabiq
import twitterIcon from "../../../../public/icons/twitter.png"; // Tumhare file path ke mutabiq

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Company Info & Logo */}
        <div className={styles.aboutSection}>
          <div className={styles.logoContainer}>
            <Image src={logo} alt="Dyzora Logo" width={150} height={50} />
          </div>
          <p className={styles.tagline}>Where style meets the future.</p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialLink}>
              <Image
                src={instagramIcon}
                alt="Instagram"
                width={24}
                height={24}
              />
            </a>
            <a href="#" className={styles.socialLink}>
              <Image src={facebookIcon} alt="Facebook" width={24} height={24} />
            </a>
            <a href="#" className={styles.socialLink}>
              <Image src={twitterIcon} alt="Twitter" width={24} height={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.linksSection}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <a href="/shop" className={styles.link}>
            Shop All
          </a>
          <a href="/about" className={styles.link}>
            About Us
          </a>
          <a href="/contact" className={styles.link}>
            Contact
          </a>
          <a href="/faq" className={styles.link}>
            FAQ
          </a>
        </div>

        {/* Legal Links */}
        <div className={styles.linksSection}>
          <h4 className={styles.sectionTitle}>Information</h4>
          <a href="/privacy" className={styles.link}>
            Privacy Policy
          </a>
          <a href="/terms" className={styles.link}>
            Terms of Service
          </a>
          <a href="/returns" className={styles.link}>
            Returns & Refunds
          </a>
          <a href="/shipping" className={styles.link}>
            Shipping Info
          </a>
        </div>

        {/* Newsletter & Contact */}
        <div className={styles.newsletterSection}>
          <h4 className={styles.sectionTitle}>Stay Updated</h4>
          <p className={styles.subtext}>
            Get the latest trends and special offers.
          </p>
          <div className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterButton}>Subscribe</button>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Dyzora. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import styles from "./ProfilePage.module.css";
import Header from "../others/Header";
import Footer from "../components/Footer/Footer";
import { check_login } from "../global/check_login";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../global/api";
import AddAddressForm from "./AddAddressForm"; // Zaroori import: AddAddressForm ab alag file se aa raha hai

// Define a TypeScript interface for user profile
interface UserProfile {
  name: string;
  email: string;
  created_at: string;
}

// Interface for Address
interface UserAddress {
  id: number;
  label: string;
  addressLine1: string; // Street / House Number
  addressLine2?: string;
  city: string;
  state: string;
  postal_code: string;
  fullName: string;
  phoneNumber: string;
}

// Dummy data for addresses
const savedAddresses: UserAddress[] = [];

// Existing dummy data for order history
const orderHistory = [
  {
    id: "ORD-12345",
    date: "20th Sep, 2025",
    total: 199.99,
    status: "Delivered",
  },
  { id: "ORD-12344", date: "15th Sep, 2025", total: 55.5, status: "Shipped" },
  {
    id: "ORD-12343",
    date: "10th Sep, 2025",
    total: 125.0,
    status: "Delivered",
  },
];

const ProfilePage = () => {
  const router = useRouter();
  const [login, setLogin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>(savedAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false); // Address form ki visibility state

  // Login check function
  const check = async () => {
    const res = await check_login();
    if (res) setLogin(true);
    else router.replace("/");
  };

  // Profile data fetch function
  const get_profile = async () => {
    try {
      const res = await api.get("/profile");
      setUserProfile(res.data.data);
      // Real addresses fetch karne ki logic yahan ayegi
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const get_addreses = async () => {
    try {
      const res = await api.get("/get-address");

      const addressesArray = res.data.data; // <--- important

      // if (!Array.isArray(addressesArray)) {
      //   console.error("Expected array, got:", addressesArray);
      //   return;
      // }

      const mappedAddresses: UserAddress[] = addressesArray.map(
        (addr: any) => ({
          id: addr.id,
          label: addr.label,
          addressLine1: addr.street,
          addressLine2: addr.addressLine2 || "",
          city: addr.city,
          state: addr.state,
          postal_code: addr.postal_code,
          fullName: addr.fullname,
          phoneNumber: addr.phonenumber,
        })
      );

      setAddresses(mappedAddresses);
    } catch (e) {
      console.log("Address fetch error:", e);
    }
  };
  // Lifecycle hook
  useEffect(() => {
    check();
    get_profile();
    get_addreses();
  }, []);

  if (!login || !userProfile) return null;

  const formattedDate = new Date(userProfile.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Address Form Submission Handler
  const handleSaveAddress = async (newAddressData: any) => {
    try {
      await api.post("/add-address", newAddressData);
    } catch (e) {
      console.log(e);
    }

    setAddresses([
      ...addresses,
      {
        ...newAddressData,
        id: Date.now(),
        addressLine1: newAddressData.street,
      } as unknown as UserAddress,
    ]);

    setIsAddingAddress(false);
  };

  async function delete_address(id: number) {
    try {
      await api.delete(`/delete-address/${id}`);
      setAddresses(addresses.filter((addr: any) => addr.id !== id));
    } catch (e) {
      console.log("Delete address error:", e);
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>My Profile</h1>

        {/* 1. Personal Information Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.infoGrid}>
            <p className={styles.infoItem}>
              <span className={styles.infoLabel}>Name:</span> {userProfile.name}
            </p>
            <p className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>{" "}
              {userProfile.email}
            </p>
            <p className={styles.infoItem}>
              <span className={styles.infoLabel}>Member Since:</span>{" "}
              {formattedDate}
            </p>
          </div>
        </section>

        {/* 2. Address Management Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Saved Addresses</h2>
            <button
              className={styles.addButton}
              onClick={() => setIsAddingAddress(true)}
            >
              + Add New Address
            </button>
          </div>

          {/* AddAddressForm ab alag component hai */}
          {isAddingAddress && (
            <AddAddressForm
              onSave={handleSaveAddress}
              onCancel={() => setIsAddingAddress(false)}
            />
          )}

          <div className={styles.addressList}>
            {addresses.length === 0 && (
              <p className={styles.noAddress}>
                No addresses saved yet. Add one to speed up checkout!
              </p>
            )}
            {addresses
              ? addresses.map((addr) => (
                  <div key={addr.id} className={styles.addressCard}>
                    <span className={styles.addressLabel}>{addr.label}</span>
                    <p>
                      <span className={styles.addressName}>
                        {addr.fullName}
                      </span>{" "}
                      ({addr.phoneNumber})
                    </p>
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                    <div className={styles.addressActions}>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => delete_address(addr.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </section>

        {/* 3. Order History Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Order History</h2>
          <div className={styles.orderList}>
            {orderHistory.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderDetails}>
                  <p className={styles.orderId}>Order ID: {order.id}</p>
                  <p className={styles.orderDate}>Date: {order.date}</p>
                </div>
                <div className={styles.orderSummary}>
                  <p className={styles.orderTotal}>
                    Total: ${order.total.toFixed(2)}
                  </p>
                  <span
                    className={`${styles.orderStatus} ${
                      styles[order.status.toLowerCase()]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;

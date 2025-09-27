"use client";

import React, { useState } from "react";
import styles from "./ProfilePage.module.css"; // Styling wohi use hogi

// Address ki fields ke liye interface
interface NewAddressData {
  label: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

// Props interface
interface AddAddressFormProps {
  onSave: (data: NewAddressData) => void; // Jab form submit ho to data parent ko bhejny ke liye
  onCancel: () => void; // Cancel button ke liye
}

export default function AddAddressForm({
  onSave,
  onCancel,
}: AddAddressFormProps) {
  // States for the Address Form
  const [label, setLabel] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddressData = {
      label,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      postalCode,
    };

    // Data ko parent component ko bhej kar save karein
    onSave(newAddressData);
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.addressForm}>
      <h3 className={styles.formTitle}>Add New Address</h3>

      {/* Label and Full Name */}
      <div className={styles.formRow}>
        <input
          type="text"
          placeholder="Label (Home, Work, etc.)"
          required
          className={styles.formInput}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name (Delivery Person)"
          required
          className={styles.formInput}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {/* Phone Number and Street */}
      <div className={styles.formRow}>
        <input
          type="tel"
          placeholder="Phone Number (Contact)"
          required
          className={styles.formInput}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Street / House Number"
          required
          className={styles.formInput}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>

      {/* City and State/Province */}
      <div className={styles.formRow}>
        <input
          type="text"
          placeholder="City"
          required
          className={styles.formInput}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="State / Province (Optional)"
          className={styles.formInput}
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>

      {/* Postal Code */}
      <input
        type="text"
        placeholder="Postal Code (Zip Code)"
        className={styles.formInput}
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
      />

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className={styles.saveButton}>
          Save Address
        </button>
      </div>
    </form>
  );
}

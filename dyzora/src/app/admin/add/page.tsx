"use client";

import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import { api } from "@/app/global/api";
import AlertMessage from "@/app/components/AlertMessage/AlertMessage";

// Initial state for all product fields (Only text/numeric data)
const initialProductState = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  brand: "",
  sku: "",
  price: 0.0,
  stock_quantity: 0,
  tags: [""], // Simple array for tags
  variants: JSON.stringify({}), // JSONB ke liye stringify
};

export default function AddProductForm() {
  const [product, setProduct] = useState(initialProductState);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // New state for actual File objects
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // For showing previews
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // General handler for simple text/numeric inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  // Handler for dynamic array fields (tags only now)
  const handleTagChange = (index: number, value: string) => {
    const newArray = [...product.tags];
    newArray[index] = value;
    setProduct((prev) => ({ ...prev, tags: newArray }));
  };

  // Function to add a new empty input field for tags
  const addTagItem = () => {
    if (product.tags[product.tags.length - 1] !== "") {
      setProduct((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
    }
  };

  // Handler for variants JSONB field
  const handleVariantChange = (value: string) => {
    try {
      JSON.parse(value);
      setProduct((prev) => ({ ...prev, variants: value }));
    } catch (e) {
      setProduct((prev) => ({ ...prev, variants: value }));
    }
  };

  const handleAlertClose = () => setAlert(null);

  // --- NEW: File Upload Handler ---
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Update File state
      setImageFiles((prev) => [...prev, file]);

      // Update Preview state
      setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);

      // Reset the file input so the user can select the same file again if needed
      e.target.value = "";
    }
  };

  // --- NEW: Remove Image Handler ---
  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- UPDATED: Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Filter out empty strings from tags arrays
    const sanitizedTags = product.tags.filter((tag) => tag.trim() !== "");

    // Check if variants JSON is valid before sending
    try {
      JSON.parse(product.variants);
    } catch (error) {
      setIsLoading(false);
      setAlert({
        message: "Variants field must be a valid JSON object.",
        type: "error",
      });
      return;
    }

    // --- Create FormData Object for File Upload ---
    const formData = new FormData();

    // 1. Append text fields
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("subcategory", product.subcategory);
    formData.append("brand", product.brand);
    formData.append("sku", product.sku);
    formData.append("price", product.price.toString());
    formData.append("stock_quantity", product.stock_quantity.toString());

    // 2. Append Arrays (Backend will receive this as a string, must be parsed)
    // We will send JSON string for tags and variants
    formData.append("tags", JSON.stringify(sanitizedTags));
    formData.append("variants", product.variants);

    // 3. Append Files
    imageFiles.forEach((file) => {
      formData.append("images", file); // 'images' must match backend's upload.array("images")
    });

    try {
      await api.post("/admin/add-product", formData);
      setAlert({ message: "Product added successfully!", type: "success" });

      // Reset form states
      setProduct(initialProductState);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error: any) {
      console.error("Product Add Error:", error);
      setAlert({
        message: error.response?.data.message || "Failed to add product.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}

      <h1 className={styles.title}>Add New Product</h1>

      {/* IMPORTANT: FormData ke liye form mein 'encType' ki zaroorat nahi hoti, AxioS khud manage kar leta hai */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* --- 1. Basic Information --- */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Info (Required)</h2>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="category">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stock_quantity">Stock Quantity *</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={product.stock_quantity}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={5}
            ></textarea>
          </div>
        </div>

        {/* --- 2. Organization & Inventory --- */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Organization & Inventory</h2>
          <div className={styles.grid3}>
            <div className={styles.inputGroup}>
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={product.brand}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="subcategory">Subcategory</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={product.subcategory}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="sku">SKU (Unique Identifier)</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={product.sku}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* --- 3. Media & SEO --- */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Images & Tags</h2>
          <div className={styles.grid2}>
            {/* --- Image Upload Section --- */}
            <div className={styles.inputGroup}>
              <label>Product Images (Upload)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className={styles.fileInput}
              />
              <div className={styles.imagePreviews}>
                {imagePreviews.map((imgUrl, index) => (
                  <div key={index} className={styles.imagePreviewWrapper}>
                    <img
                      src={imgUrl}
                      alt={`Product image ${index + 1}`}
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      className={styles.removeImgBtn}
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <small className={styles.jsonNote}>
                *Max 10 images. Files will be uploaded to MinIO.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label>Tags (TEXT[])</label>
              {product.tags.map((tag, index) => (
                <div key={index} className={styles.arrayInput}>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder={`Tag ${index + 1}`}
                  />
                  {index === product.tags.length - 1 && (
                    <button
                      type="button"
                      onClick={addTagItem}
                      className={styles.addBtn}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 4. Variants (JSONB) --- */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants (JSONB)</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="variants">Variants Data (JSON Format)</label>
            <textarea
              id="variants"
              name="variants"
              value={product.variants}
              onChange={(e) => handleVariantChange(e.target.value)}
              rows={8}
              placeholder='Example: {"color":["Red","Blue"], "size":["M","L"]}'
            ></textarea>
            <small className={styles.jsonNote}>
              *Must be valid JSON object string.
            </small>
          </div>
        </div>

        {/* --- Submit Button --- */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

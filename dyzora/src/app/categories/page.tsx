"use client";

import styles from "./CategoriesPage.module.css";
import CategoryCard from "./CategoryCard";
import Header from "../others/Header";
import Footer from "../components/Footer/Footer";
// Dummy data for categories
const categories = [
  { name: "Men's Fashion", image: "/catagories/men_fashion.jpg" },
  { name: "Women's Fashion", image: "/catagories/women_fashion.jpg" },
  { name: "Electronics", image: "/catagories/electronics.jpg" },
  { name: "Accessories", image: "/catagories/accessories.jpg" },
  { name: "Home Goods", image: "/catagories/home_goods.jpg" },
  { name: "Sneakers", image: "/catagories/sneakers.jpg" },
];

const CategoriesPage = () => {
  return (
    <div>
      <Header />
      <section className={styles.container}>
        <h1 className={styles.title}>Explore Our Categories</h1>
        <p className={styles.subtitle}>
          Find exactly what you're looking for, effortlessly.
        </p>

        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CategoriesPage;

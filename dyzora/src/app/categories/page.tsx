"use client";

import styles from "./CategoriesPage.module.css";
import CategoryCard from "./CategoryCard";
import Header from "../others/Header";
import Footer from "../components/Footer/Footer";
// Dummy data for categories
const categories = [
  {
    name: "Men's Fashion",
    image: "/catagories/men_fashion.jpg",
    searchname: "men",
  },
  {
    name: "Women's Fashion",
    image: "/catagories/women_fashion.jpg",
    searchname: "women",
  },
  {
    name: "Electronics",
    image: "/catagories/electronics.jpg",
    searchname: "electronics",
  },
  {
    name: "Accessories",
    image: "/catagories/accessories.jpg",
    searchname: "accessories",
  },
  {
    name: "Home & Kitchen",
    image: "/catagories/home_goods.jpg",
    searchname: "home",
  },
  {
    name: "Sneakers",
    image: "/catagories/sneakers.jpg",
    searchname: "sneakers",
  },
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
              searchname={category.searchname}
            />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CategoriesPage;

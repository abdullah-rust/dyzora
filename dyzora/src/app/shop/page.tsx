import MiniBanner from "../components/MiniBanner/MiniBanner";
import Header from "../others/Header";
import Footer from "../components/Footer/Footer";
import ProductGrid from "../components/ProductGrid/ProductGrid";
export default function Shop() {
  return (
    <main>
      <Header />
      <MiniBanner />
      <ProductGrid />
      <Footer />
    </main>
  );
}

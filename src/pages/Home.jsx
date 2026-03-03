// File: src/pages/Home.jsx

import Hero from "../components/Hero/Hero";
import FilterBar from "../components/FilterBar/FilterBar";
import ProductGrid from "../components/ProductGrid/ProductGrid";

const Home = () => {
  return (
    <main>
      <Hero />
      <FilterBar />
      <ProductGrid />
    </main>
  );
};

export default Home;

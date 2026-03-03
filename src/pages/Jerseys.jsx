// File: src/pages/Jerseys.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBrandFilter } from "../store/slices/productsSlice";
import FilterBar from "../components/FilterBar/FilterBar";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import classes from "./Jerseys.module.scss";

const Jerseys = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBrandFilter("All"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch]);

  return (
    <main>
      <div className={classes["pageHero"]}>
        <div className={classes["pageHeroInner"]}>
          <div className={classes["breadcrumb"]}>
            <a href="#home">Home</a>
            <span>/</span>
            <span>Jerseys</span>
          </div>
          <h1 className={classes["pageTitle"]}>All Jerseys</h1>
          <p className={classes["pageSubtitle"]}>
            Browse our complete range of football jerseys — from club kits to national teams.
          </p>
        </div>
      </div>

      <FilterBar />
      <ProductGrid />
    </main>
  );
};

export default Jerseys;

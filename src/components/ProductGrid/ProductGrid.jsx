import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetFilters, fetchProducts } from "../../store/slices/productsSlice";
import ProductCard from "../ProductCard/ProductCard";
import classes from "./ProductGrid.module.scss";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const {
    filteredProducts,
    selectedBrand,
    selectedSize,
    searchQuery,
    sortBy,
    page,
    limit,
    total,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, selectedBrand, selectedSize, searchQuery, sortBy, page, limit]);

  const hasFilters = selectedBrand !== "All" || selectedSize !== "All" || searchQuery.trim() !== "";

  return (
    <section className={classes["section"]} id="jerseys">
      <div className={classes["sectionHeader"]}>
        <div>
          <h2 className={classes["sectionTitle"]}>
            Our <span>Collection</span>
          </h2>
          <p className={classes["sectionSubtitle"]}>
            {total} result{total !== 1 ? "s" : ""}
            {hasFilters && " matching your filters"}
          </p>
        </div>
      </div>

      <div className={classes["grid"]}>
        {loading && (
          <div className={classes["emptyState"]}>
            <h3 className={classes["emptyTitle"]}>Loading products...</h3>
          </div>
        )}

        {!loading && error && (
          <div className={classes["emptyState"]}>
            <h3 className={classes["emptyTitle"]}>Could not load jerseys</h3>
            <p className={classes["emptyText"]}>{error}</p>
            <button className={classes["emptyBtn"]} onClick={() => dispatch(fetchProducts())}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={`${product.id}`} className={classes["cardWrapper"]}>
              <ProductCard product={product} />
            </div>
          ))
        ) : null}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className={classes["emptyState"]}>
            <div className={classes["emptyIcon"]}>No</div>
            <h3 className={classes["emptyTitle"]}>No jerseys found</h3>
            <p className={classes["emptyText"]}>
              We could not find any jerseys matching your current filters. Try adjusting your search or clearing all filters.
            </p>
            <button className={classes["emptyBtn"]} onClick={() => dispatch(resetFilters())}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;

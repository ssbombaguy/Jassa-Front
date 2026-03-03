import { useSelector, useDispatch } from "react-redux";
import {
  setBrandFilter,
  setSizeFilter,
  setSortBy,
  resetFilters,
} from "../../store/slices/productsSlice";
import { sortOptions } from "../../constants/productFilters";
import classes from "./FilterBar.module.scss";

const FilterBar = () => {
  const dispatch = useDispatch();
  const {
    selectedBrand,
    selectedSize,
    sortBy,
    total,
    availableBrands,
    availableSizes,
  } = useSelector((state) => state.products);

  const handleBrandClick = (brand) => {
    dispatch(setBrandFilter(brand));
  };

  const handleSizeClick = (size) => {
    dispatch(setSizeFilter(selectedSize === size ? "All" : size));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const hasActiveFilters =
    selectedBrand !== "All" || selectedSize !== "All" || sortBy !== "default";

  return (
    <div className={classes["wrapper"]}>
      <div className={classes["filterBar"]}>
        <div className={classes["group"]}>
          <span className={classes["groupLabel"]}>Brand</span>
          <div className={classes["pillGroup"]}>
            {availableBrands.map((brand) => (
              <button
                key={brand}
                className={`${classes["pill"]} ${selectedBrand === brand ? classes["active"] : ""}`}
                onClick={() => handleBrandClick(brand)}
                aria-pressed={selectedBrand === brand}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className={classes["divider"]} />

        <div className={classes["group"]}>
          <span className={classes["groupLabel"]}>Size</span>
          <div className={classes["pillGroup"]}>
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`${classes["pill"]} ${selectedSize === size ? classes["active"] : ""}`}
                onClick={() => handleSizeClick(size)}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className={classes["divider"]} />

        <div className={classes["sortWrapper"]}>
          {hasActiveFilters && (
            <button className={classes["resetButton"]} onClick={handleReset}>
              Clear Filters
            </button>
          )}

          <span className={classes["results"]}>
            <strong>{total}</strong> products
          </span>

          <select
            className={classes["sortSelect"]}
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort products"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

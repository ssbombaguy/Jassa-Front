// File: src/components/ProductCard/ProductCard.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import classes from "./ProductCard.module.scss";

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className={classes["star"]}>★</span>);
    } else if (i === fullStars && hasHalf) {
      stars.push(<span key={i} className={classes["star"]}>½</span>);
    } else {
      stars.push(<span key={i} className={`${classes["star"]} ${classes["starEmpty"]}`}>★</span>);
    }
  }
  return stars;
};

const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || product.sizes[0]);
  const [wished, setWished] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedSize) return;

    dispatch(addToCart({ product, selectedSize }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWished((prev) => !prev);
  };

  return (
    <article className={classes["card"]}>
      {/* Badge */}
      {product.badge && (
        <span className={`${classes["badge"]} ${classes[product.badge.toLowerCase()]}`}>
          {product.badge}
        </span>
      )}

      {/* Image Section */}
      <div className={classes["imageWrapper"]}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="400"
          height="480"
        />

        {/* Wishlist */}
        <button
          className={`${classes["wishlistBtn"]} ${wished ? classes["wished"] : ""}`}
          onClick={handleWishlist}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={wished} />
        </button>

        {/* Quick size peek on hover */}
        <div className={classes["quickActions"]}>
          <div className={classes["sizeRow"]}>
            {product.sizes.slice(0, 5).map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className={classes["body"]}>
        <span className={classes["brand"]}>{product.brand}</span>
        <h3 className={classes["name"]}>{product.name}</h3>

        {/* Rating */}
        <div className={classes["ratingRow"]}>
          <div className={classes["stars"]}>{renderStars(product.rating)}</div>
          <span className={classes["reviewCount"]}>({product.reviews})</span>
        </div>

        {/* Price */}
        <div className={classes["priceRow"]}>
          <span className={classes["price"]}>£{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={classes["originalPrice"]}>
              £{product.originalPrice.toFixed(2)}
            </span>
          )}
          {discount && (
            <span className={classes["discount"]}>-{discount}%</span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className={classes["cardFooter"]}>
        {/* Size Selector */}
        <div className={classes["sizeSelector"]}>
          <span className={classes["sizeSelectorLabel"]}>Size</span>
          <div className={classes["sizeOptions"]}>
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`${classes["sizeBtn"]} ${selectedSize === size ? classes["selected"] : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                aria-label={`Select size ${size}`}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          className={`${classes["addToCartBtn"]} ${justAdded ? classes["added"] : ""}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
          aria-label={`Add ${product.name} size ${selectedSize} to cart`}
        >
          {justAdded ? (
            <>
              <CheckIcon />
              Added!
            </>
          ) : (
            <>
              <CartIcon />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Flash feedback overlay */}
      {justAdded && (
        <div className={classes["addedFeedback"]} aria-hidden="true">
          ✓ Added to Cart
        </div>
      )}
    </article>
  );
};

export default ProductCard;

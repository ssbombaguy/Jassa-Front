import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import classes from './ProductCard.module.scss';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const id = product?.product_id ?? product?.id;
  const name = product?.name || 'Unknown Product';
  const brand = product?.brand_name || product?.brand || '';
  const price = Number(product?.price ?? 0);
  const image = product?.image_url ||
    `https://placehold.co/400x480/1a472a/FFFFFF?text=${encodeURIComponent(name.slice(0, 8))}`;

  const discountedPrice = product?.is_discounted && product?.discount_pct
    ? +(price * (1 - product.discount_pct / 100)).toFixed(2)
    : null;

  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : ['S', 'M', 'L', 'XL'];

  const [selectedSize, setSelectedSize] = useState(sizes[1] ?? sizes[0]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article
      className={classes.card}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* discount badge */}
      {product?.is_discounted && product?.discount_pct && (
        <span className={classes.discountBadge}>-{product.discount_pct}%</span>
      )}

      {/* wishlist */}
      <button
        className={`${classes.wishlist} ${wishlisted ? classes.active : ''}`}
        onClick={() => setWishlisted(!wishlisted)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* image */}
      <Link to={`/products/${id}`} className={classes.imageLink}>
        <div className={classes.image}>
          <img src={image} alt={name} loading="lazy" />
        </div>
      </Link>

      {/* body */}
      <div className={classes.body}>
        {brand && <p className={classes.brand}>{brand}</p>}
        <h3 className={classes.name}>{name}</h3>

        <div className={classes.priceRow}>
          {discountedPrice ? (
            <>
              <span className={classes.priceOld}>${price.toFixed(2)}</span>
              <span className={classes.price}>${discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className={classes.price}>${price.toFixed(2)}</span>
          )}
        </div>

        {/* size selector */}
        <div className={classes.sizes}>
          {sizes.map((s) => {
            const sizeLabel = typeof s === 'object' ? s.size : s;
            const inStock = typeof s === 'object' ? s.in_stock !== false : true;
            return (
              <button
                key={sizeLabel}
                className={`${classes.sizeBtn} ${selectedSize === sizeLabel ? classes.active : ''} ${!inStock ? classes.outOfStock : ''}`}
                onClick={() => inStock && setSelectedSize(sizeLabel)}
                disabled={!inStock}
              >
                {sizeLabel}
              </button>
            );
          })}
        </div>

        {/* add to cart */}
        <button
          className={`${classes.addBtn} ${justAdded ? classes.added : ''}`}
          onClick={handleAddToCart}
        >
          {justAdded ? (
            <><Check size={15} /> Added!</>
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
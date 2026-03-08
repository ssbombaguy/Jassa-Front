import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import classes from './ProductCard.module.scss';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const id    = product?.product_id ?? product?.id;
  const name  = product?.name || 'Unknown Product';
  const brand = product?.brand_name || product?.brand || '';
  const price = Number(product?.price ?? 0);

  // Use images array first, fallback to image_url, fallback to placeholder
  const firstImage = Array.isArray(product?.images) && product.images.length > 0
    ? product.images[0].image_url
    : product?.image_url;
  const image = firstImage ||
    `https://placehold.co/400x400/111/fff?text=${encodeURIComponent(name.slice(0, 10))}`;

  const wishlisted = isWishlisted(id);

  const discountedPrice = product?.is_discounted && product?.discount_pct
    ? +(price * (1 - product.discount_pct / 100)).toFixed(2)
    : null;

  const rawSizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const sizes = rawSizes.length
    ? rawSizes
    : ['S', 'M', 'L', 'XL'].map((s) => ({ size: s, in_stock: true }));

  const firstAvailable = sizes.find((s) =>
    typeof s === 'object' ? s.in_stock !== false : true
  );
  const [selectedSize, setSelectedSize] = useState(
    typeof firstAvailable === 'object' ? firstAvailable?.size : firstAvailable
  );

  const getSize  = (s) => (typeof s === 'object' ? s.size  : s);
  const getStock = (s) => (typeof s === 'object' ? s.in_stock !== false : true);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className={classes.card} style={{ '--delay': `${index * 0.05}s` }}>

      {product?.is_discounted && product?.discount_pct && (
        <span className={classes.discountBadge}>-{product.discount_pct}%</span>
      )}

      <button
        className={`${classes.wishlist} ${wishlisted ? classes.active : ''}`}
        onClick={() => toggleWishlist(product)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/products/${id}`} className={classes.imageLink}>
        <div className={classes.image}>
          <img src={image} alt={name} loading="lazy" />
        </div>
        <div className={classes.overlay}>
          {sizes.slice(0, 6).map((s) => {
            const label   = getSize(s);
            const inStock = getStock(s);
            return (
              <button
                key={label}
                className={`${classes.overlaySizeBtn} ${selectedSize === label ? classes.active : ''} ${!inStock ? classes.outOfStock : ''}`}
                onClick={(e) => { e.preventDefault(); if (inStock) setSelectedSize(label); }}
                disabled={!inStock}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Link>

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

        <div className={classes.sizes}>
          {sizes.map((s) => {
            const label   = getSize(s);
            const inStock = getStock(s);
            return (
              <button
                key={label}
                className={`${classes.sizeBtn} ${selectedSize === label ? classes.active : ''} ${!inStock ? classes.outOfStock : ''}`}
                onClick={() => inStock && setSelectedSize(label)}
                disabled={!inStock}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          className={`${classes.addBtn} ${justAdded ? classes.added : ''}`}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {justAdded
            ? <><Check size={13} /> Added!</>
            : <><ShoppingCart size={13} /> Add to Cart</>
          }
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
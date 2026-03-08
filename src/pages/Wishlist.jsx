import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import classes from './Wishlist.module.scss';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!wishlistItems.length) {
    return (
      <main className={classes.page}>
        <div className={classes.empty}>
          <Heart size={48} className={classes.emptyIcon} />
          <h2>Your wishlist is empty</h2>
          <p>Save items you love and come back to them anytime.</p>
          <Link to="/jerseys" className={classes.browseBtn}>Browse Jerseys</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <h1>Wishlist</h1>
          <span className={classes.count}>{wishlistItems.length} items</span>
        </div>
        <button className={classes.clearBtn} onClick={clearWishlist}>
          Clear all
        </button>
      </div>

      <div className={classes.grid}>
        {wishlistItems.map((item) => {
          const id     = item?.product_id ?? item?.jersey_id ?? item?.id;
          const name   = item?.name || item?.club_name || 'Unknown';
          const brand  = item?.brand_name || item?.league_name || '';
          const price  = Number(item?.price ?? item?.price_usd ?? 0);
          const image  = item?.image_url;
          const isJersey = !!item?.jersey_id || !!item?.jersey_type;
          const link   = isJersey ? `/jerseys/${id}` : `/products/${id}`;

          const discountedPrice = item?.is_discounted && item?.discount_pct
            ? +(price * (1 - item.discount_pct / 100)).toFixed(2)
            : null;

          return (
            <article key={id} className={classes.card}>
              <Link to={link} className={classes.imageWrap}>
                {image
                  ? <img src={image} alt={name} loading="lazy" />
                  : <div className={classes.imagePlaceholder}>{name.slice(0, 2).toUpperCase()}</div>
                }
              </Link>

              <div className={classes.info}>
                {brand && <p className={classes.brand}>{brand}</p>}
                <Link to={link} className={classes.name}>{name}</Link>
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
              </div>

              <div className={classes.actions}>
                <button
                  className={classes.cartBtn}
                  onClick={() => addToCart(item, 'M')}
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button
                  className={classes.removeBtn}
                  onClick={() => removeFromWishlist(id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default WishlistPage;
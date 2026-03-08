import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import classes from './JerseyCard.module.scss';

const typeStyles = {
  home:       { bg: 'var(--badge-home)',       color: 'var(--badge-home-text)' },
  away:       { bg: 'var(--badge-away)',       color: 'var(--badge-away-text)' },
  third:      { bg: 'var(--badge-third)',      color: 'var(--badge-third-text)' },
  goalkeeper: { bg: 'var(--badge-goalkeeper)', color: 'var(--badge-goalkeeper-text)' },
};

const JerseyCard = ({ jersey, index = 0 }) => {
  const { addToCart }          = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const id           = jersey.jersey_id ?? jersey.id;
  const wishlisted   = isWishlisted(id);
  const type         = (jersey.jersey_type || 'home').toLowerCase();
  const typeStyle    = typeStyles[type] || typeStyles.home;
  const price        = Number(jersey.price ?? jersey.price_usd ?? 0);
  const primaryColor = jersey.primary_color || '#1a472a';

  // Use first image from images array, fallback to image_url, fallback to placeholder
  const firstImage   = Array.isArray(jersey.images) && jersey.images.length > 0
    ? jersey.images[0].image_url
    : jersey.image_url;
  const image = firstImage ||
    `https://placehold.co/400x480/${primaryColor.replace('#', '')}/FFFFFF?text=${encodeURIComponent((jersey.club_name || jersey.name || 'Jersey').slice(0, 6))}`;

  return (
    <article className={classes.card} style={{ animationDelay: `${index * 0.1}s` }}>

      {jersey.is_discounted && jersey.discount_pct && (
        <span className={classes.discountBadge}>-{jersey.discount_pct}%</span>
      )}

      <button
        className={`${classes.wishlist} ${wishlisted ? classes.active : ''}`}
        onClick={() => toggleWishlist(jersey)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/jerseys/${id}`} className={classes.imageLink}>
        <div className={classes.image} style={{ backgroundColor: primaryColor }}>
          <img src={image} alt={jersey.name || jersey.club_name} />
        </div>
      </Link>

      <div className={classes.content}>
        <p className={classes.club}>{jersey.club_name}</p>
        <p className={classes.jerseyName}>{jersey.name}</p>
        <div className={classes.badges}>
          <span className={classes.typeBadge} style={{ background: typeStyle.bg, color: typeStyle.color }}>
            {(jersey.jersey_type || 'HOME').toUpperCase()}
          </span>
          {jersey.technology && <span className={classes.techBadge}>{jersey.technology}</span>}
        </div>
        {jersey.season && <p className={classes.season}>{jersey.season}</p>}
        <p className={classes.price}>${Number.isFinite(price) ? price.toFixed(2) : '0.00'}</p>
        <button className={classes.addBtn} onClick={() => addToCart(jersey, 'M')}>
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default JerseyCard;
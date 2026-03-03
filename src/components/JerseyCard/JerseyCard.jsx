import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import classes from './JerseyCard.module.scss';

const typeStyles = {
  home: { bg: 'var(--badge-home)', color: 'var(--badge-home-text)' },
  away: { bg: 'var(--badge-away)', color: 'var(--badge-away-text)' },
  third: { bg: 'var(--badge-third)', color: 'var(--badge-third-text)' },
  goalkeeper: { bg: 'var(--badge-goalkeeper)', color: 'var(--badge-goalkeeper-text)' },
};

const JerseyCard = ({ jersey, index = 0 }) => {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const id = jersey.id ?? jersey.jersey_id;
  const type = (jersey.type || 'home').toLowerCase();
  const typeStyle = typeStyles[type] || typeStyles.home;
  const price = jersey.price ?? jersey.price_usd ?? 0;
  const primaryColor = jersey.primary_color || '#1a472a';
  const image = jersey.image || `https://placehold.co/400x480/${primaryColor.replace('#', '')}/FFFFFF?text=${encodeURIComponent((jersey.club_name || jersey.name || 'Jersey').slice(0, 6))}`;

  return (
    <article
      className={classes.card}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link to={`/jerseys/${id}`} className={classes.imageLink}>
        <div
          className={classes.image}
          style={{ backgroundColor: primaryColor }}
        >
          <img src={image} alt={jersey.name || jersey.club_name} />
        </div>
      </Link>
      <button
        className={`${classes.wishlist} ${wishlisted ? classes.active : ''}`}
        onClick={() => setWishlisted(!wishlisted)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon />
      </button>
      <div className={classes.content}>
        <p className={classes.club}>{jersey.club_name || jersey.name}</p>
        <div className={classes.badges}>
          <span
            className={classes.typeBadge}
            style={{ background: typeStyle.bg, color: typeStyle.color }}
          >
            {(jersey.type || 'HOME').toUpperCase()}
          </span>
          {jersey.technology && (
            <span className={classes.techBadge}>{jersey.technology}</span>
          )}
        </div>
        {jersey.season && <p className={classes.season}>{jersey.season}</p>}
        <p className={classes.price}>${price.toFixed(2)}</p>
        <button
          className={classes.addBtn}
          onClick={() => addToCart(jersey, 'M')}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default JerseyCard;

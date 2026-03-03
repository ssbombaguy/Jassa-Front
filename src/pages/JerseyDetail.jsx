import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getJersey } from '../services/api';
import { mockJerseys } from '../data/mockJerseys';
import classes from './JerseyDetail.module.scss';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const typeStyles = {
  home: { bg: 'var(--badge-home)', color: 'var(--badge-home-text)' },
  away: { bg: 'var(--badge-away)', color: 'var(--badge-away-text)' },
  third: { bg: 'var(--badge-third)', color: 'var(--badge-third-text)' },
  goalkeeper: { bg: 'var(--badge-goalkeeper)', color: 'var(--badge-goalkeeper-text)' },
};

const JerseyDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [jersey, setJersey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getJersey(id)
      .then((res) => {
        if (cancelled) return;
        const j = res?.data ?? res?.jersey ?? res;
        setJersey(j);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network')) {
          const mock = mockJerseys.find((j) => String(j.id) === String(id) || String(j.jersey_id) === String(id));
          setJersey(mock || mockJerseys[0]);
        } else {
          setError(err?.message || 'Failed to load jersey');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className={classes.loading}>Loading…</div>;
  if (error) return <div className={classes.error}>{error}</div>;
  if (!jersey) return <div className={classes.error}>Jersey not found</div>;

  const type = (jersey.type || 'home').toLowerCase();
  const typeStyle = typeStyles[type] || typeStyles.home;
  const price = jersey.price ?? jersey.price_usd ?? 0;
  const primaryColor = jersey.primary_color || '#1a472a';
  const image = jersey.image || `https://placehold.co/600x720/${primaryColor.replace('#', '')}/FFFFFF?text=Jersey`;

  return (
    <main className={classes.page}>
      <Link to="/jerseys" className={classes.back}>← Back to Jerseys</Link>
      <div className={classes.grid}>
        <div
          className={classes.imageBlock}
          style={{ backgroundColor: primaryColor }}
        >
          <img src={image} alt={jersey.name || jersey.club_name} />
        </div>
        <div className={classes.info}>
          <p className={classes.club}>{jersey.club_name || jersey.name}</p>
          <p className={classes.league}>{jersey.league_name}</p>
          <div className={classes.badges}>
            <span className={classes.typeBadge} style={{ background: typeStyle.bg, color: typeStyle.color }}>
              {(jersey.type || 'HOME').toUpperCase()}
            </span>
            {jersey.season && <span className={classes.season}>{jersey.season}</span>}
            {jersey.technology && <span className={classes.tech}>{jersey.technology}</span>}
          </div>
          <p className={classes.price}>${price.toFixed(2)}</p>
          <div className={classes.sizeGroup}>
            <label>Size</label>
            <div className={classes.sizeBtns}>
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`${classes.sizeBtn} ${size === s ? classes.active : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className={classes.qtyGroup}>
            <label>Quantity</label>
            <div className={classes.qtyBtns}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <button
            className={classes.addBtn}
            onClick={() => {
              for (let i = 0; i < qty; i++) addToCart(jersey, size);
            }}
          >
            Add to Cart
          </button>
          <button className={classes.wishlistBtn}>Add to Wishlist</button>
          <details className={classes.accordion}>
            <summary>Description</summary>
            <p>Official club jersey. Premium fabric, moisture-wicking technology.</p>
          </details>
          <details className={classes.accordion}>
            <summary>Technology</summary>
            <p>{jersey.technology || 'AEROREADY'} — Engineered for performance and comfort.</p>
          </details>
          <details className={classes.accordion}>
            <summary>Care</summary>
            <p>Machine wash cold. Do not bleach. Tumble dry low. Iron on low if needed.</p>
          </details>
        </div>
      </div>
    </main>
  );
};

export default JerseyDetail;

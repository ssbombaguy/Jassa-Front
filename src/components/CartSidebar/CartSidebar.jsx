import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import classes from './CartSidebar.module.scss';

const CartSidebar = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const location = useLocation();

  // close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      <div className={classes.backdrop} onClick={onClose} aria-hidden="true" />
      <aside className={classes.sidebar} role="dialog" aria-label="Shopping cart">

        <div className={classes.header}>
          <h3>CART <span className={classes.headerCount}>({cartCount})</span></h3>
          <button className={classes.closeBtn} onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className={classes.content}>
          {cartItems.length === 0 ? (
            <div className={classes.empty}>
              <ShoppingBag size={40} className={classes.emptyIcon} />
              <p>Your cart is empty</p>
              <Link to="/jerseys" className={classes.startBtn} onClick={onClose}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className={classes.list}>
                {cartItems.map((item) => {
                  const id    = item.jersey?.product_id ?? item.jersey?.jersey_id ?? item.jersey?.id;
                  const price = Number(item.jersey?.price ?? item.jersey?.price_usd ?? 0);
                  const name  = item.jersey?.name ?? item.jersey?.club_name ?? 'Item';
                  const image = item.jersey?.image_url;
                  const discounted = item.jersey?.is_discounted && item.jersey?.discount_pct
                    ? +(price * (1 - item.jersey.discount_pct / 100)).toFixed(2)
                    : null;
                  const unitPrice = discounted ?? price;

                  return (
                    <li key={`${id}-${item.size}`} className={classes.item}>
                      {image && (
                        <div className={classes.itemImage}>
                          <img src={image} alt={name} />
                        </div>
                      )}
                      <div className={classes.itemInfo}>
                        <span className={classes.itemName}>{name}</span>
                        <span className={classes.itemMeta}>Size: {item.size}</span>
                        <div className={classes.qty}>
                          <button onClick={() => updateQuantity(id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <div className={classes.itemRight}>
                        <span className={classes.itemPrice}>
                          ${(unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          className={classes.removeBtn}
                          onClick={() => removeFromCart(id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className={classes.footer}>
                <div className={classes.subtotal}>
                  <span>Subtotal</span>
                  <span className={classes.subtotalPrice}>${cartTotal.toFixed(2)}</span>
                </div>
                <button className={classes.checkoutBtn}>Checkout</button>
                <button className={classes.clearBtn} onClick={clearCart}>
                  Clear cart
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import classes from './CartSidebar.module.scss';

const CartSidebar = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

  if (!open) return null;

  return (
    <>
      <div className={classes.backdrop} onClick={onClose} aria-hidden="true" />
      <aside className={classes.sidebar}>
        <div className={classes.header}>
          <h3>Cart ({cartCount})</h3>
          <button className={classes.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={classes.content}>
          {cartItems.length === 0 ? (
            <div className={classes.empty}>
              <p>Your cart is empty</p>
              <Link to="/jerseys" className={classes.startBtn} onClick={onClose}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className={classes.list}>
                {cartItems.map((item) => {
                  const id = item.jersey.id ?? item.jersey.jersey_id;
                  const price = item.jersey.price ?? item.jersey.price_usd ?? 0;
                  const name = item.jersey.name ?? item.jersey.club_name ?? 'Jersey';
                  return (
                    <li key={`${id}-${item.size}`} className={classes.item}>
                      <div className={classes.itemInfo}>
                        <span className={classes.itemName}>{name}</span>
                        <span className={classes.itemMeta}>
                          Size {item.size} × {item.quantity}
                        </span>
                      </div>
                      <div className={classes.itemActions}>
                        <div className={classes.qty}>
                          <button
                            onClick={() => updateQuantity(id, item.quantity - 1)}
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(id, item.quantity + 1)}
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                        <span className={classes.itemPrice}>
                          ${(price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          className={classes.removeBtn}
                          onClick={() => removeFromCart(id)}
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className={classes.footer}>
                <div className={classes.subtotal}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
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

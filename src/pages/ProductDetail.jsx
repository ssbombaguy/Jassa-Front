import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import apiClient from '../api/client';
import classes from './JerseyDetail.module.scss'; // reuse same styles

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart }                    = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [size, setSize]       = useState(null);
  const [qty, setQty]         = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient.get(`/products/${id}`)
      .then((res) => {
        if (cancelled) return;
        const p = res?.data ?? res;
        setProduct(p);
        // set first available size
        const first = p?.sizes?.find((s) => s.stock_qty > 0);
        if (first) setSize(first.size);
        setActiveImg(0);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.error || err?.message || 'Failed to load product');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className={classes.loading}>Loading…</div>;
  if (error)   return <div className={classes.error}>{error}</div>;
  if (!product) return <div className={classes.error}>Product not found</div>;

  const productId   = product.product_id ?? product.id;
  const wishlisted  = isWishlisted(productId);
  const price       = Number(product.price ?? 0);
  const discountedPrice = product.is_discounted && product.discount_pct
    ? +(price * (1 - product.discount_pct / 100)).toFixed(2)
    : null;

  // Build images array
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image_url
      ? [{ image_url: product.image_url, label: 'front' }]
      : [{ image_url: `https://placehold.co/600x720/111/fff?text=${encodeURIComponent(product.name?.slice(0,8) || 'Product')}`, label: 'front' }];

  const currentImage = images[activeImg] ?? images[0];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  // back link based on category
  const backPath = product.category_slug === 'boot' ? '/boots'
    : product.category_slug === 'equipment' ? '/equipment'
    : product.category_slug === 'training'  ? '/training'
    : '/';
  const backLabel = `← Back to ${product.category_name || 'Products'}`;

  return (
    <main className={classes.page}>
      <Link to={backPath} className={classes.back}>{backLabel}</Link>

      <div className={classes.grid}>

        {/* ── IMAGE GALLERY ── */}
        <div className={classes.galleryBlock}>
          {images.length > 1 && (
            <div className={classes.thumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${classes.thumb} ${activeImg === i ? classes.thumbActive : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img.image_url} alt={img.label || `View ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className={classes.imageBlock} style={{ background: product.brand_color || 'var(--color-border)' }}>
            <img
              key={currentImage.image_url}
              src={currentImage.image_url}
              alt={product.name}
              className={classes.mainImage}
            />
            {images.length > 1 && (
              <>
                <button
                  className={`${classes.galleryArrow} ${classes.galleryArrowLeft}`}
                  onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className={`${classes.galleryArrow} ${classes.galleryArrowRight}`}
                  onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {currentImage.label && (
              <span className={classes.imgLabel}>{currentImage.label}</span>
            )}
          </div>
        </div>

        {/* ── INFO ── */}
        <div className={classes.info}>
          <p className={classes.club}>{product.name}</p>
          <p className={classes.league}>{product.brand_name}</p>

          <div className={classes.badges}>
            {product.subcategory_name && (
              <span className={classes.season}>{product.subcategory_name}</span>
            )}
            {product.boot_details?.stud_type && (
              <span className={classes.tech}>{product.boot_details.stud_type}</span>
            )}
            {product.boot_details?.upper_material && (
              <span className={classes.season}>{product.boot_details.upper_material}</span>
            )}
          </div>

          <div className={classes.priceRow}>
            {discountedPrice ? (
              <>
                <p className={classes.priceOld}>${price.toFixed(2)}</p>
                <p className={classes.price}>${discountedPrice.toFixed(2)}</p>
              </>
            ) : (
              <p className={classes.price}>${price.toFixed(2)}</p>
            )}
          </div>

          {sizes.length > 0 && (
            <div className={classes.sizeGroup}>
              <label>Size</label>
              <div className={classes.sizeBtns}>
                {sizes.map(({ size: s, stock_qty }) => {
                  const inStock = stock_qty > 0;
                  return (
                    <button
                      key={s}
                      className={`${classes.sizeBtn} ${size === s ? classes.active : ''} ${!inStock ? classes.outOfStock : ''}`}
                      onClick={() => inStock && setSize(s)}
                      disabled={!inStock}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className={classes.qtyGroup}>
            <label>Quantity</label>
            <div className={classes.qtyBtns}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <div className={classes.ctaRow}>
            <button
              className={classes.addBtn}
              onClick={() => { for (let i = 0; i < qty; i++) addToCart(product, size); }}
              disabled={!size}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>

            <button
              className={`${classes.wishlistBtn} ${wishlisted ? classes.wishlisted : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          <details className={classes.accordion}>
            <summary>Description</summary>
            <p>{product.description || `${product.brand_name} ${product.name} — premium quality.`}</p>
          </details>

          {product.boot_details && (
            <details className={classes.accordion}>
              <summary>Boot Details</summary>
              <p>
                {product.boot_details.boot_type && `Type: ${product.boot_details.boot_type}. `}
                {product.boot_details.upper_material && `Upper: ${product.boot_details.upper_material}. `}
                {product.boot_details.stud_type && `Studs: ${product.boot_details.stud_type}. `}
                {product.boot_details.colorway && `Colorway: ${product.boot_details.colorway}.`}
              </p>
            </details>
          )}

          <details className={classes.accordion}>
            <summary>Care</summary>
            <p>Wipe clean with a damp cloth. Do not machine wash. Store away from direct sunlight.</p>
          </details>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
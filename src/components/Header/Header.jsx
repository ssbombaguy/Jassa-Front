// File: src/components/Header/Header.jsx

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../../store/slices/cartSlice";
import { setSearchQuery } from "../../store/slices/productsSlice";
import classes from "./Header.module.scss";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Jerseys", href: "#jerseys" },
  { label: "Boots", href: "#" },
  { label: "Accessories", href: "#" },
  { label: "Contact", href: "#" },
];

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Header = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    dispatch(setSearchQuery(val));
  };

  const handleNavClick = (label, href) => {
    setActiveLink(label);
    setMenuOpen(false);
    if (href.startsWith("#") && href.length > 1) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`${classes["header"]} ${scrolled ? classes["scrolled"] : ""}`}>
        <div className={classes["inner"]}>
          {/* Logo */}
          <a href="#home" className={classes["logo"]} onClick={() => setActiveLink("Home")}>
            <div className={classes["logoIcon"]}>⚽</div>
            <div className={classes["logoText"]}>
              Strike<span>Green</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className={classes["nav"]}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`${classes["navLink"]} ${activeLink === link.label ? classes["active"] : ""}`}
                onClick={() => handleNavClick(link.label, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className={classes["right"]}>
            {/* Search */}
            <div className={classes["searchWrapper"]}>
              <span className={classes["searchIcon"]}>
                <SearchIcon />
              </span>
              <input
                type="text"
                className={classes["searchInput"]}
                placeholder="Search jerseys, brands…"
                value={searchValue}
                onChange={handleSearchChange}
                aria-label="Search products"
              />
            </div>

            {/* Cart */}
            <button
              className={classes["cartButton"]}
              aria-label={`Cart with ${cartCount} items`}
              onClick={() => {}}
            >
              <CartIcon />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className={classes["cartCount"]}>{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`${classes["menuToggle"]} ${menuOpen ? classes["open"] : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <nav className={`${classes["mobileNav"]} ${menuOpen ? classes["open"] : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={classes["mobileNavLink"]}
            onClick={() => handleNavClick(link.label, link.href)}
          >
            {link.label}
          </a>
        ))}
        <div className={`${classes["mobileSearch"]} ${classes["searchWrapper"]}`}>
          <span className={classes["searchIcon"]}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search jerseys, brands…"
            value={searchValue}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
        </div>
      </nav>
    </>
  );
};

export default Header;

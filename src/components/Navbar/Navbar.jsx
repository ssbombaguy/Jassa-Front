import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import classes from './Navbar.module.scss';

const navLinks = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.leagues', path: '/leagues' },
  { labelKey: 'nav.clubs', path: '/jerseys' },
  { labelKey: 'nav.jerseys', path: '/jerseys' },
];

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Navbar = ({ onCartOpen }) => {
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (searchValue.trim()) navigate(`/jerseys?search=${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <>
      <header className={`${classes.header} ${scrolled ? classes.scrolled : ''}`}>
        <div className={classes.inner}>
          <Link to="/" className={classes.logo}>
            JASSA
          </Link>

          <form className={classes.searchForm} onSubmit={handleSearch}>
            <span className={classes.searchIcon}><SearchIcon /></span>
            <input
              type="search"
              className={classes.searchInput}
              placeholder={t('nav.search')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
            />
          </form>

          <nav className={classes.nav}>
            {navLinks.map((link) => (
              <Link key={link.labelKey} to={link.path} className={classes.navLink}>
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          <div className={classes.actions}>
            <div className={classes.langSwitcher}>
              <button
                className={lang === 'en' ? classes.langActive : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={lang === 'ka' ? classes.langActive : ''}
                onClick={() => setLang('ka')}
              >
                KA
              </button>
            </div>
            <button
              className={classes.themeBtn}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? '☀' : '☽'}
            </button>
            <button
              className={classes.cartBtn}
              onClick={onCartOpen}
              aria-label={`${t('nav.cart')}: ${cartCount} items`}
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className={classes.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>
          </div>

          <button
            className={`${classes.menuToggle} ${menuOpen ? classes.open : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <nav className={`${classes.mobileNav} ${menuOpen ? classes.open : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.labelKey} to={link.path} className={classes.mobileLink} onClick={() => setMenuOpen(false)}>
            {t(link.labelKey)}
          </Link>
        ))}
        <form className={classes.mobileSearch} onSubmit={handleSearch}>
          <input
            type="search"
            placeholder={t('nav.search')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search"
          />
        </form>
      </nav>
    </>
  );
};

export default Navbar;

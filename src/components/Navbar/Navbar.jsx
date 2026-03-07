import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getHeaderNav } from '../../api/navApi';
import {Search, ShoppingCart,Sun,Moon } from 'lucide-react';
import classes from './Navbar.module.scss';



const fallbackLinks = [
  { id: 'jerseys',     label: 'Jerseys',       path: '/jerseys',  children: [] },
  { id: 'leagues',     label: 'Leagues',       path: '/leagues',  children: [] },
  { id: 'equipment',   label: 'Equipment',     path: '/equipment',children: [] },
  { id: 'sale',        label: 'Sale',          path: '/sale',     children: [] },
  { id: 'new-arrivals',label: 'New Arrivals',  path: '/new-arrivals', children: [] },
]

const Navbar = ({ onCartOpen }) => {
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [headerLinks, setHeaderLinks] = useState([]);


  const navLinks = headerLinks.length ? headerLinks : fallbackLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    getHeaderNav().then((items) => {
        if (!mounted) return;
        console.log(items);
        setHeaderLinks(items);
      })
      .catch(() => {
        if (!mounted) return;
        setHeaderLinks([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (searchValue.trim()) navigate(`/jerseys?search=${encodeURIComponent(searchValue.trim())}`);
  };

  const renderNavItem = (item, mobile = false) => {
    const key = `${mobile ? 'mobile' : 'desktop'}-${item.id}`;

    if (item.children?.length) {
      return (
        <div key={key} className={mobile ? classes.mobileGroup : classes.dropdown}>
          <span className={mobile ? classes.mobileGroupTitle : classes.dropdownTitle}>{item.label}</span>
          <div className={mobile ? classes.mobileGroupLinks : classes.dropdownMenu}>
            {item.children.map((child) =>
              child.external ? (
                <a
                  key={`${key}-${child.id}`}
                  href={child.path || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={mobile ? classes.mobileLink : classes.dropdownLink}
                >
                  {child.label}
                </a>
              ) : (
                <Link
                  key={`${key}-${child.id}`}
                  to={child.path || '/'}
                  className={mobile ? classes.mobileLink : classes.dropdownLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {child.label}
                </Link>
              )
            )}
          </div>
        </div>
      );
    }

    if (item.external) {
      return (
        <a key={key} href={item.path || '#'} target="_blank" rel="noreferrer" className={mobile ? classes.mobileLink : classes.navLink}>
          {item.label}
        </a>
      );
    }

    return (
      <Link key={key} to={item.path || '/'} className={mobile ? classes.mobileLink : classes.navLink} onClick={() => setMenuOpen(false)}>
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header className={`${classes.header} ${scrolled ? classes.scrolled : ''}`}>
        <div className={classes.inner}>
          <Link to="/" className={classes.logo}>
            JASSSPORT
          </Link>

          <form className={classes.searchForm} onSubmit={handleSearch}>
            <span className={classes.searchIcon}><Search /></span>
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
            {navLinks.map((item) => renderNavItem(item))}
          </nav>

          <div className={classes.actions}>
            <div className={classes.langSwitcher}>
              <button className={lang === 'en' ? classes.langActive : ''} onClick={() => setLang('en')}>
                EN
              </button>
              <button className={lang === 'ka' ? classes.langActive : ''} onClick={() => setLang('ka')}>
                KA
              </button>
            </div>
            <button
              className={classes.themeBtn}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? <Sun size={20}/> :<Moon size={20}/>}
            </button>
            <button className={classes.cartBtn} onClick={onCartOpen} aria-label={`${t('nav.cart')}: ${cartCount} items`}>
              <ShoppingCart />
              {cartCount > 0 ? <span className={classes.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span> : null}
            </button>
          </div>

          <button className={`${classes.menuToggle} ${menuOpen ? classes.open : ''}`} onClick={() => setMenuOpen((p) => !p)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <nav className={`${classes.mobileNav} ${menuOpen ? classes.open : ''}`}>
        {navLinks.map((item) => renderNavItem(item, true))}
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

import { Link } from 'react-router-dom';
import classes from './Footer.module.scss';

const Footer = () => (
  <footer className={classes.footer}>
    <div className={classes.grid}>
      <div className={classes.col}>
        <h4>About</h4>
        <p>Jassa Store — Official club jerseys for every league and season. Authentic, premium quality.</p>
      </div>
      <div className={classes.col}>
        <h4>Leagues</h4>
        <ul>
          <li><Link to="/leagues">All Leagues</Link></li>
          <li><Link to="/jerseys?league=premier">Premier League</Link></li>
          <li><Link to="/jerseys?league=ucl">UEFA Champions League</Link></li>
          <li><Link to="/jerseys?league=mls">MLS</Link></li>
        </ul>
      </div>
      <div className={classes.col}>
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/jerseys">Jerseys</Link></li>
          <li><a href="#">Size Guide</a></li>
          <li><a href="#">Shipping & Returns</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div className={classes.col}>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:hello@jassastore.com">hello@jassastore.com</a></li>
          <li><a href="tel:+1234567890">+1 234 567 890</a></li>
        </ul>
      </div>
    </div>
    <div className={classes.socialRow}>
      <a href="#" aria-label="Instagram">𝕀</a>
      <a href="#" aria-label="Twitter">𝕏</a>
      <a href="#" aria-label="Facebook">𝔽</a>
    </div>
    <div className={classes.bar}>
      © 2025 Jassa Store. All rights reserved.
    </div>
  </footer>
);

export default Footer;

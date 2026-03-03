// File: src/components/Footer/Footer.jsx

import { useState } from "react";
import classes from "./Footer.module.scss";

const footerLinks = {
  Shop: ["Jerseys", "Boots", "Accessories", "Goalkeeper Kits", "Training Wear", "Sale"],
  Help: ["Size Guide", "Shipping Info", "Returns & Exchanges", "Order Tracking", "FAQ", "Contact Us"],
  Company: ["About Us", "Careers", "Press", "Sustainability", "Affiliate Programme"],
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className={classes["footer"]}>
      <div className={classes["upper"]}>
        {/* Brand Column */}
        <div className={classes["brandCol"]}>
          <div className={classes["logo"]}>
            <div className={classes["logoIcon"]}>⚽</div>
            <div className={classes["logoText"]}>
              Strike<span>Green</span>
            </div>
          </div>
          <p className={classes["tagline"]}>
            Your go-to destination for professional football jerseys. Club colours, national pride — all in one pitch-perfect store.
          </p>
          <div className={classes["socials"]}>
            <button className={classes["socialBtn"]} aria-label="Instagram">𝕀</button>
            <button className={classes["socialBtn"]} aria-label="Twitter/X">𝕏</button>
            <button className={classes["socialBtn"]} aria-label="Facebook">𝔽</button>
            <button className={classes["socialBtn"]} aria-label="YouTube">▶</button>
          </div>
        </div>

        {/* Navigation Columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className={classes["col"]}>
            <h4>{heading}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter — only show on lg+ via grid flow */}
      </div>

      {/* Newsletter Strip */}
      <div className={classes["lower"]} style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className={classes["lowerInner"]}>
          <p className={classes["copyright"]}>
            © {new Date().getFullYear()} StrikeGreen Sports Ltd. All rights reserved.
          </p>

          <div className={classes["paymentIcons"]}>
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>PAYPAL</span>
            <span>KLARNA</span>
          </div>

          <div className={classes["legalLinks"]}>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

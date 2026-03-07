import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFooterNav } from '../../api/navApi';
import classes from './Footer.module.scss';

const fallbackGroups = [
  {
    id: 'shop',
    label: 'Shop',
    links: [
      { id: 'shop-jerseys', label: 'Jerseys', path: '/jerseys', external: false },
      { id: 'shop-leagues', label: 'Leagues', path: '/leagues', external: false },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    links: [
      { id: 'support-contact', label: 'Contact', path: '#', external: false },
      { id: 'support-shipping', label: 'Shipping', path: '#', external: false },
    ],
  },
];

const Footer = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let mounted = true;

    getFooterNav()
      .then((items) => {
        if (!mounted) return;
        setGroups(items);
      })
      .catch(() => {
        if (!mounted) return;
        setGroups([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const navGroups = groups.length ? groups : fallbackGroups;

  return (
    <footer className={classes.footer}>
      <div className={classes.grid}>
        <div className={classes.col}>
          <h4>About</h4>
          <p>JassSport official football store. Authentic kits, training wear, and fan favorites from top clubs and nations.</p>
        </div>
        {navGroups.map((group) => (
          <div className={classes.col} key={group.id}>
            <h4>{group.label}</h4>
            <ul>
              {group.links.map((link) => (
                <li key={link.id}>
                  {link.external ? (
                    <a href={link.path || '#'} target="_blank" rel="noreferrer">{link.label}</a>
                  ) : (
                    <Link to={link.path || '/'}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={classes.bar}>
        &copy; 2026 JassSport. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

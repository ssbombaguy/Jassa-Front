import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import classes from './Hero.module.scss';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className={classes.hero} id="home">
      <div className={classes.bgPattern} />
      <div className={classes.overlay} />
      <div className={classes.content}>
        <h1 className={classes.title}>{t('hero.title')}</h1>
        <p className={classes.subtitle}>{t('hero.subtitle')}</p>
        <div className={classes.actions}>
          <Link to="/jerseys" className={classes.ctaPrimary}>{t('hero.shopNow')}</Link>
          <Link to="/leagues" className={classes.ctaOutline}>{t('hero.viewLeagues')}</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

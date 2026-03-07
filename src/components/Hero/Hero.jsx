import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useDotButton } from '../../hooks/Useherocarousel';
import classes from './Hero.module.scss';
import dinamo    from '../../assets/hero/dinamo.jpg';
import jassport  from '../../assets/hero/jassport.jpg';
import newArrival from '../../assets/hero/newArrival.jpg';
import uclStadium from '../../assets/hero/uclstadium.jpg';

const slides = [
  {
    id: 1,
    bg: '#1a3a2a',
    accent: '#52b788',
    label: 'New Season',
    title: 'Official Club Jerseys',
    subtitle: 'Shop the latest 2024/25 kits from top clubs worldwide',
    cta: { label: 'Shop Jerseys', path: '/jerseys' },
    ctaSecondary: { label: 'View Leagues', path: '/leagues' },
    align: 'left',
    image: dinamo,
  },
  {
    id: 2,
    bg: '#0d1b2a',
    accent: '#4895ef',
    label: 'Just Dropped',
    title: 'New Arrivals',
    subtitle: 'Fresh boots, training gear and accessories just landed',
    cta: { label: 'Shop New In', path: '/new-arrivals' },
    ctaSecondary: null,
    align: 'left',
    image: newArrival,
  },
  {
    id: 3,
    bg: '#2d0a0a',
    accent: '#e63946',
    label: 'Limited Time',
    title: 'Sale — Up to 30% Off',
    subtitle: 'Grab discounted jerseys and equipment before they\'re gone',
    cta: { label: 'Shop Sale', path: '/sale' },
    ctaSecondary: null,
    align: 'left',
    image: jassport,
  },
  {
    id: 4,
    bg: '#1a1a2e',
    accent: '#f4d03f',
    label: 'Champions League',
    title: 'UCL Collection',
    subtitle: 'Authentic kits from Europe\'s elite clubs',
    cta: { label: 'Shop UCL', path: '/jerseys?is_ucl=true' },
    ctaSecondary: { label: 'Explore Clubs', path: '/leagues/5' },
    align: 'left',
    image: uclStadium,
  },
];

const Hero = () => {
  const { t } = useLanguage();
  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [autoplayPlugin.current]
  );

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <section className={classes.hero}>
      <div className={classes.embla} ref={emblaRef}>
        <div className={classes.emblaContainer}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={classes.emblaSlide}
              style={{ backgroundColor: slide.bg }}
            >
              {/* placeholder image area */}
              <div
                className={classes.imagePlaceholder}
                style={{ background: `url(${slide.image})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover' }}
              />

              {/* text content */}
              <div className={`${classes.content} ${classes[slide.align]}`}>
                <span className={classes.label} style={{ color: slide.accent }}>
                  {slide.label}
                </span>
                <h1 className={classes.title}>{slide.title}</h1>
                <p className={classes.subtitle}>{slide.subtitle}</p>
                <div className={classes.actions}>
                  <Link
                    to={slide.cta.path}
                    className={classes.ctaPrimary}
                    style={{ backgroundColor: slide.accent }}
                  >
                    {slide.cta.label}
                  </Link>
                  {slide.ctaSecondary && (
                    <Link to={slide.ctaSecondary.path} className={classes.ctaOutline}>
                      {slide.ctaSecondary.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.dots}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`${classes.dot} ${index === selectedIndex ? classes.dotActive : ''}`}
            onClick={() => onDotButtonClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      </div>

    </section>
  );
};

export default Hero;
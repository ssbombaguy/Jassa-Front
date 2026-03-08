import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getLeagues } from '../../api/leaguesApi';
import { getClubs } from '../../api/clubsApi';
import classes from './FindYourTeam.module.scss';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TAB_STORAGE_KEY = 'find-your-team-tab';

const FindYourTeam = ({ onSelect }) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState(() => localStorage.getItem(TAB_STORAGE_KEY) || 'leagues');
  const [leagues, setLeagues] = useState([]);
  const [clubs, setClubs]     = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([getLeagues({ limit: 100 }), getClubs({ limit: 100 })])
      .then(([leaguesRes, clubsRes]) => {
        if (!mounted) return;
        const leaguesData = Array.isArray(leaguesRes?.data) ? leaguesRes.data : [];
        const clubsData   = Array.isArray(clubsRes?.data)   ? clubsRes.data   : [];

        setLeagues(leaguesData.map((l) => ({
          id:        String(l.league_id ?? l.id),
          name:      l.league_name ?? l.name,
          image_url: l.image_url || null,
          country:   l.country || '',
          type:      'league',
        })));

        setClubs(clubsData.map((c) => ({
          id:        String(c.club_id ?? c.id),
          name:      c.club_name ?? c.name,
          image_url: c.image_url || null,
          type:      'club',
        })));
      })
      .catch(() => { if (mounted) { setLeagues([]); setClubs([]); } });
    return () => { mounted = false; };
  }, []);

  const handleTabChange = (next) => {
    setTab(next);
    localStorage.setItem(TAB_STORAGE_KEY, next);
  };

  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [autoplayPlugin.current]
  );

  const items = tab === 'leagues' ? leagues : clubs;
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>{t('findTeam.title')}</h2>

      <div className={classes.tabs}>
        <button
          className={`${classes.tab} ${tab === 'leagues' ? classes.active : ''}`}
          onClick={() => handleTabChange('leagues')}
        >
          {t('findTeam.leagueTeams')}
        </button>
        <button
          className={`${classes.tab} ${tab === 'clubs' ? classes.active : ''}`}
          onClick={() => handleTabChange('clubs')}
        >
          {t('findTeam.clubs')}
        </button>
      </div>

      <div className={classes.carouselWrapper}>
        <button className={classes.arrowLeft} onClick={scrollPrev} aria-label="Previous">
          <ChevronLeft size={24} />
        </button>

        <div className={classes.embla} ref={emblaRef}>
          <div className={classes.emblaContainer}>
            {items.map((item) => (
              <div className={classes.emblaSlide} key={item.id}>
                <Link
                  to={onSelect ? '#' : item.type === 'club'
                    ? `/jerseys?club=${item.id}`
                    : `/jerseys?league=${item.id}`}
                  className={classes.card}
                  onClick={(e) => {
                    if (onSelect) {
                      e.preventDefault();
                      onSelect(item);
                      document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <div className={classes.logo}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} />
                    ) : (
                      <span className={classes.logoFallback}>
                        {item.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className={classes.name}>{item.name}</span>
                  {item.country && tab === 'leagues' && (
                    <span className={classes.country}>{item.country}</span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button className={classes.arrowRight} onClick={scrollNext} aria-label="Next">
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default FindYourTeam;
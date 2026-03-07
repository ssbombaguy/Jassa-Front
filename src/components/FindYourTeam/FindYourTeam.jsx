import { useEffect, useState, useRef} from 'react';
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
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [clubs, setClubs] = useState([]);


  useEffect(() => {
    let isMounted = true;

    Promise.all([getLeagues({ limit: 100 }), getClubs({ limit: 100 })])
      .then(([leaguesRes, clubsRes]) => {
        if (!isMounted) return;

        const leagues = Array.isArray(leaguesRes?.data) ? leaguesRes.data : [];
        const clubsData = Array.isArray(clubsRes?.data) ? clubsRes.data : [];

        const countriesMap = new Map();
        leagues.forEach((league) => {
          const country = league.country || 'Unknown';
          if (!countriesMap.has(country)) {
            countriesMap.set(country, {
              id: String(league.league_id ?? league.id),
              name: league.league_name,
              type: 'league',
            });
          }
        });

          setLeagueTeams(Array.from(countriesMap.values()));
        setClubs(
          clubsData.map((club) => ({
            id: String(club.club_id ?? club.id),
            name: club.club_name ?? club.name,
            type: 'club',
          }))
        );
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
          setLeagueTeams([]);
        setClubs([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    localStorage.setItem(TAB_STORAGE_KEY, nextTab);
  };
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start' },
        [autoplayPlugin.current]
    );

  const items = tab === 'leagues' ? leagueTeams : clubs;
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  return (
    <section className={classes.section}>
      <h2 className={classes.title}>{t('findTeam.title')}</h2>
      <div className={classes.tabs}>
        <button
          className={`${classes.tab} ${tab === 'leagues' ? classes.active : ''}`}
          onClick={() => {
            handleTabChange('leagues');
          }}
        >
          {t('findTeam.leagueTeams')}
        </button>
        <button
          className={`${classes.tab} ${tab === 'clubs' ? classes.active : ''}`}
          onClick={() => {
            handleTabChange('clubs');
          }}
        >
          {t('findTeam.clubs')}
        </button>
      </div>
        <div className={classes.carouselWrapper}>
            <button className={classes.arrowLeft} onClick={scrollPrev}>
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
                                        document.getElementById('new-arrivals')
                                            ?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                <div className={classes.logo} />
                                <span className={classes.name}>{item.name}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <button className={classes.arrowRight} onClick={scrollNext}>
                <ChevronRight size={24} />
            </button>
        </div>


    </section>
  );
};

export default FindYourTeam;

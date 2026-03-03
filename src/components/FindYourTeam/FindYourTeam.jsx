import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import classes from './FindYourTeam.module.scss';

const NATIONAL_TEAMS = [
  { id: 'argentina', name: 'Argentina', slug: 'argentina' },
  { id: 'germany', name: 'Germany', slug: 'germany' },
  { id: 'spain', name: 'Spain', slug: 'spain' },
  { id: 'italy', name: 'Italy', slug: 'italy' },
  { id: 'belgium', name: 'Belgium', slug: 'belgium' },
  { id: 'jamaica', name: 'Jamaica', slug: 'jamaica' },
];

const CLUBS_LEAGUES = [
  { id: 'premier', name: 'Premier League', slug: 'premier' },
  { id: 'bundesliga', name: 'Bundesliga', slug: 'bundesliga' },
  { id: 'serie-a', name: 'Serie A', slug: 'serie-a' },
  { id: 'mls', name: 'MLS', slug: 'mls' },
  { id: 'ucl', name: 'UEFA Champions League', slug: 'ucl' },
  { id: 'la-liga', name: 'La Liga', slug: 'la-liga' },
];

const FindYourTeam = ({ onSelect }) => {
  const { t } = useLanguage();
  const [tab, setTab] = useState('national');

  const items = tab === 'national' ? NATIONAL_TEAMS : CLUBS_LEAGUES;

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>{t('findTeam.title')}</h2>
      <div className={classes.tabs}>
        <button
          className={`${classes.tab} ${tab === 'national' ? classes.active : ''}`}
          onClick={() => setTab('national')}
        >
          {t('findTeam.nationalTeams')}
        </button>
        <button
          className={`${classes.tab} ${tab === 'clubs' ? classes.active : ''}`}
          onClick={() => setTab('clubs')}
        >
          {t('findTeam.clubs')}
        </button>
      </div>
      <div className={classes.grid}>
        {items.map((item) => (
          <Link
            key={item.id}
            to={onSelect ? '#' : `/jerseys?league=${item.slug}`}
            className={classes.card}
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(item.slug);
                document.getElementById('jersey-grid')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className={classes.logo} />
            <span className={classes.name}>{item.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FindYourTeam;

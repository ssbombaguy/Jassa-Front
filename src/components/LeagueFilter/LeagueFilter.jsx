import classes from './LeagueFilter.module.scss';

const LEAGUES = [
  { id: 'all', label: 'All' },
  { id: 'premier', label: 'Premier League' },
  { id: 'bundesliga', label: 'Bundesliga' },
  { id: 'serie-a', label: 'Serie A' },
  { id: 'mls', label: 'MLS' },
  { id: 'ucl', label: 'UCL' },
];

const LeagueFilter = ({ selected, onChange }) => (
  <div className={classes.wrapper}>
    <div className={classes.scroll}>
      {LEAGUES.map((league) => (
        <button
          key={league.id}
          className={`${classes.pill} ${selected === league.id ? classes.active : ''}`}
          onClick={() => onChange(league.id)}
          aria-pressed={selected === league.id}
        >
          {league.label}
        </button>
      ))}
    </div>
  </div>
);

export default LeagueFilter;

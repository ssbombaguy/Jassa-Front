import { useEffect, useState } from 'react';
import { getLeagues } from '../../api/leaguesApi';
import classes from './LeagueFilter.module.scss';

const LeagueFilter = ({ selected, onChange }) => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getLeagues({ limit: 100 })
      .then((res) => {
        if (!isMounted) return;
        const arr = Array.isArray(res?.data) ? res.data : [];
        setLeagues(arr);
      })
      .catch(() => {
        if (isMounted) setLeagues([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const leagueOptions = [{ id: 'all', label: 'All' }, ...leagues.map((league) => ({
    id: String(league.league_id ?? league.id),
    label: league.league_name ?? league.name,
  }))];

  return (
    <div className={classes.wrapper}>
      <div className={classes.scroll}>
        {leagueOptions.map((league) => (
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
};

export default LeagueFilter;

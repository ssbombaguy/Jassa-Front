import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeagues } from '../services/api';
import classes from './Leagues.module.scss';

const mockLeagues = [
  { id: 1, name: 'Premier League', slug: 'premier', country: 'England', clubs_count: 20 },
  { id: 2, name: 'Bundesliga', slug: 'bundesliga', country: 'Germany', clubs_count: 18 },
  { id: 3, name: 'Serie A', slug: 'serie-a', country: 'Italy', clubs_count: 20 },
  { id: 4, name: 'UEFA Champions League', slug: 'ucl', country: 'Europe', clubs_count: 32 },
  { id: 5, name: 'MLS', slug: 'mls', country: 'USA', clubs_count: 29 },
];

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeagues()
      .then((res) => {
        const arr = res?.data ?? res;
        setLeagues(Array.isArray(arr) && arr.length ? arr : mockLeagues);
      })
      .catch(() => setLeagues(mockLeagues))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={classes.loading}>Loading leagues…</div>;

  return (
    <main className={classes.page}>
      <h1>Leagues</h1>
      <div className={classes.grid}>
        {leagues.map((league) => (
          <Link
            key={league.id}
            to={`/jerseys?league=${league.slug || league.id}`}
            className={classes.card}
          >
            <h3>{league.name}</h3>
            <p>{league.country}</p>
            <span className={classes.clubs}>
              {league.clubs_count ?? league.club_count ?? 0} clubs
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Leagues;

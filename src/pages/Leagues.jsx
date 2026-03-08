import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getLeagues } from '../api/leaguesApi';
import classes from './Leagues.module.scss';

const Leagues = () => {
  const { id } = useParams(); // present on /leagues/:id
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLeagues()
      .then((res) => {
        const arr = res?.data ?? res;
        setLeagues(Array.isArray(arr) ? arr : []);
      })
      .catch((err) => setError(err?.error || err?.message || 'Failed to load leagues'))
      .finally(() => setLoading(false));
  }, []);

  // /leagues/1 → redirect to /jerseys?league=1
  if (id) return <Navigate to={`/jerseys?league=${id}`} replace />;

  if (loading) return <div className={classes.loading}>Loading leagues...</div>;
  if (error) return <div className={classes.loading}>{error}</div>;

  return (
    <main className={classes.page}>
      <h1>Leagues</h1>
      <div className={classes.grid}>
        {leagues.map((league) => (
          <Link
            key={league.league_id ?? league.id}
            to={`/jerseys?league=${league.league_id ?? league.id}`}
            className={classes.card}
          >
            <h3>{league.league_name ?? league.name}</h3>
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
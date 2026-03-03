import { useState, useEffect, useCallback } from 'react';
import { getJerseys, getProducts } from '../services/api';
import { mockJerseys } from '../data/mockJerseys';

const normalizeJerseys = (raw) => {
  const arr = Array.isArray(raw) ? raw : raw?.data ?? raw?.products ?? [];
  return arr.map((j) => ({
    ...j,
    id: j.id ?? j.jersey_id,
    club_name: j.club_name ?? j.club?.name ?? j.name ?? j.brand,
    type: (j.type || j.jersey_type || 'home').toLowerCase(),
    price: j.price ?? j.price_usd ?? 0,
  }));
};

export const useJerseysList = (params = {}) => {
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      try {
        res = await getJerseys(params);
      } catch (e) {
        res = await getProducts(params);
      }
      const list = normalizeJerseys(res);
      setJerseys(list);
      return list;
    } catch (err) {
      if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network')) {
        const filtered = [...mockJerseys];
        if (params.league && params.league !== 'all') {
          const leagueMap = { premier: 'Premier League', bundesliga: 'Bundesliga', 'serie-a': 'Serie A', mls: 'MLS', ucl: 'UEFA Champions League' };
          const leagueName = leagueMap[params.league] || params.league;
          setJerseys(filtered.filter((j) => (j.league_name || '').toLowerCase().includes((leagueName || '').toLowerCase())));
        } else {
          setJerseys(filtered);
        }
        setError(null);
        return filtered;
      }
      setError(err?.message || 'Failed to load jerseys');
      setJerseys([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { jerseys, loading, error, refetch: fetch };
};

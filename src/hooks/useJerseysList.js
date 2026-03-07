import { useState, useEffect, useCallback } from 'react';
import { getJerseys } from '../api/jerseysApi';
import { getLeagues } from '../api/leaguesApi';

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeJerseys = (raw) => {
  const arr = Array.isArray(raw) ? raw : raw?.data ?? raw?.products ?? [];
  return arr.map((j) => ({
    ...j,
    id: j.id ?? j.jersey_id ?? j.product_code,
    club_name: j.club_name ?? j.club?.name ?? j.name ?? j.brand ?? 'Unknown Club',
    type: (j.jersey_type || j.type || 'home').toLowerCase(),
    price: Number(j.price ?? j.price_usd ?? 0),
  }));
};

export const useJerseysList = (params = {}) => {
  const [jerseys, setJerseys] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);

  const fetchLeagueId = useCallback(async (leagueValue) => {
    if (!leagueValue || leagueValue === 'all') return undefined;
    const numeric = Number(leagueValue);
    if (!Number.isNaN(numeric) && Number.isFinite(numeric)) return numeric;

    const leaguesResponse = await getLeagues({ limit: 100 });
    const leagues = Array.isArray(leaguesResponse?.data) ? leaguesResponse.data : [];
    const valueSlug = slugify(leagueValue);

    const match = leagues.find((league) => {
      const idMatch = String(league.league_id ?? league.id) === String(leagueValue);
      const nameSlug = slugify(league.league_name || league.name);
      const shortSlug = slugify(league.short_code || league.slug);
      return idMatch || nameSlug === valueSlug || shortSlug === valueSlug;
    });

    return match?.league_id ?? match?.id;
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const requestParams = { ...params };
      if (requestParams.league && requestParams.league !== 'all') {
        const leagueId = await fetchLeagueId(requestParams.league);
        delete requestParams.league;
        if (leagueId) requestParams.league_id = leagueId;
      }

      const res = await getJerseys(requestParams);
      const list = normalizeJerseys(res);
      const page = Number(res?.pagination?.page ?? requestParams.page ?? 1);
      const limit = Number(res?.pagination?.limit ?? requestParams.limit ?? 15);
      const total = Number(res?.pagination?.total ?? list.length ?? 0);
      const totalPages = Math.max(1, Math.ceil(total / Math.max(limit, 1)));

      setJerseys(list);
      setPagination({ page, limit, total, totalPages });
      return list;
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to load jerseys');
      setJerseys([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  }, [fetchLeagueId, paramsKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { jerseys, pagination, loading, error, refetch: fetch };
};

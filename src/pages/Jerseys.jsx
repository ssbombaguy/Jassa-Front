import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LeagueFilter from '../components/LeagueFilter/LeagueFilter';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import JerseyGrid from '../components/JerseyGrid/JerseyGrid';
import { useJerseysList } from '../hooks/useJerseysList';
import classes from './Jerseys.module.scss';

const Jerseys = () => {
  const [searchParams] = useSearchParams();
  const leagueParam = searchParams.get('league') || 'all';
  const clubParam = searchParams.get('club');
  const searchParam = (searchParams.get('search') || '').trim();
  const [league, setLeague] = useState(leagueParam);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    setLeague(searchParams.get('league') || 'all');
    setPage(1);
  }, [searchParams]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [],
    maxPrice: 200,
    inStockOnly: false,
  });

  const params = {
    page,
    limit,
    ...(league !== 'all' && { league }),
    ...(clubParam && { club_id: clubParam }),
    ...(searchParam && { search: searchParam }),
    ...(filters.inStockOnly && { in_stock: true }),
  };

  const { jerseys, pagination, loading, error } = useJerseysList(params);
  const visiblePages = Array.from(
    { length: Math.max(0, Math.min(5, pagination.totalPages)) },
    (_, i) => {
      const start = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
      return start + i;
    }
  ).filter((p) => p >= 1 && p <= pagination.totalPages);

  const filtered = jerseys.filter((j) => {
    if (searchParam) {
      const q = searchParam.toLowerCase();
      const haystack = `${j.name || ''} ${j.club_name || ''} ${j.league_name || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.types?.length && !filters.types.includes((j.type || 'home').toLowerCase())) return false;
    const price = Number(j.price ?? j.price_usd ?? 0);
    if (filters.maxPrice && price > filters.maxPrice) return false;
    if (filters.inStockOnly && !j.in_stock && j.inStock !== true) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({ types: [], maxPrice: 200, inStockOnly: false });
    setPage(1);
  };

  return (
    <main className={classes.page}>
      <div className={classes.header}>
        <h1>Jerseys</h1>
        <button
          className={classes.filterToggle}
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
        >
          Filters
        </button>
      </div>
      <LeagueFilter
        selected={league}
        onChange={(value) => {
          setLeague(value);
          setPage(1);
        }}
      />
      <div className={classes.layout}>
        <FilterSidebar
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onClear={clearFilters}
        />
        <div className={classes.content}>
          <div className={classes.controls}>
            <div className={classes.leftControls}>
              <label htmlFor="jerseys-page-size">Per page</label>
              <select
                id="jerseys-page-size"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            <div className={classes.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={loading || pagination.page <= 1}
              >
                Prev
              </button>
              {visiblePages.map((p) => (
                <button
                  key={p}
                  className={p === pagination.page ? classes.activePage : ''}
                  onClick={() => setPage(p)}
                  disabled={loading}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={loading || pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
          <JerseyGrid jerseys={filtered} loading={loading} error={error} />
        </div>
      </div>
    </main>
  );
};

export default Jerseys;

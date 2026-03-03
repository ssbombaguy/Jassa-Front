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
  const [league, setLeague] = useState(leagueParam);

  useEffect(() => {
    setLeague(searchParams.get('league') || 'all');
  }, [searchParams]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [],
    maxPrice: 200,
    inStockOnly: false,
  });

  const params = { ...(league !== 'all' && { league }) };
  const { jerseys, loading, error } = useJerseysList(params);

  const filtered = jerseys.filter((j) => {
    if (filters.types?.length && !filters.types.includes((j.type || 'home').toLowerCase())) return false;
    const price = j.price ?? j.price_usd ?? 0;
    if (filters.maxPrice && price > filters.maxPrice) return false;
    if (filters.inStockOnly && !j.in_stock && j.inStock !== true) return false;
    return true;
  });

  const clearFilters = () => setFilters({ types: [], maxPrice: 200, inStockOnly: false });

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
      <LeagueFilter selected={league} onChange={setLeague} />
      <div className={classes.layout}>
        <FilterSidebar
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onClear={clearFilters}
        />
        <div className={classes.content}>
          <JerseyGrid jerseys={filtered} loading={loading} error={error} />
        </div>
      </div>
    </main>
  );
};

export default Jerseys;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Grid2x2, SlidersHorizontal } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import ItemGrid from '../components/ItemGrid/ItemGrid';
import JerseyCard from '../components/JerseyCard/JerseyCard';
import ProductCard from '../components/ProductCard/ProductCard';
import { useJerseysList } from '../hooks/useJerseysList';
import { getProducts } from '../api/productsApi';
import classes from './ProductListPage.module.scss';

const useProductsList = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!paramsKey || paramsKey === '{}') return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProducts(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(Array.isArray(res?.products) ? res.products : []);
        setPagination({
          page: res?.pagination?.page ?? 1,
          limit: res?.pagination?.limit ?? 15,
          total: res?.pagination?.total ?? 0,
          totalPages: res?.pagination?.totalPages ?? 1,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || 'Failed to load products');
        setProducts([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [paramsKey]);

  return { products, pagination, loading, error };
};

const ProductListPage = ({
  type = 'jerseys',
  title = 'Browse',
  defaultFilters = {},
  category,
  showLeagueFilter = true,
}) => {
  const [searchParams] = useSearchParams();
  const leagueParam = searchParams.get('league') || 'all';
  const clubParam = searchParams.get('club');
  const searchParam = (searchParams.get('search') || '').trim();

  const typeParam = searchParams.get('type'); // e.g. /jerseys?type=home

  const [league, setLeague] = useState(leagueParam);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cols, setCols] = useState(3);
  const [filters, setFilters] = useState({
    types: [], subcategories: [], brands: [],
    maxPrice: 300, inStockOnly: false, saleOnly: false,
  });

  useEffect(() => {
    setLeague(searchParams.get('league') || 'all');
    setPage(1);
  }, [searchParams]);

  const jerseyParams = {
    page, limit, ...defaultFilters,
    ...(league !== 'all' && { league }),
    ...(clubParam && { club_id: clubParam }),
    ...(searchParam && { search: searchParam }),
    ...(filters.inStockOnly && { in_stock: true }),
    ...(filters.saleOnly && { is_discounted: true }),
    ...(typeParam && { jersey_type: typeParam }),
  };

  const productParams = {
    page, limit, ...defaultFilters,
    ...(category && { category }),
    ...(searchParam && { search: searchParam }),
    ...(filters.inStockOnly && { in_stock: true }),
    ...(filters.saleOnly && { is_discounted: true }),
    ...(filters.maxPrice < 300 && { max_price: filters.maxPrice }),
    ...(filters.subcategories?.length === 1 && { subcategory: filters.subcategories[0] }),
    ...(filters.brands?.length === 1 && { brand: filters.brands[0] }),
  };

  const jerseyData = useJerseysList(type === 'jerseys' ? jerseyParams : {});
  const productData = useProductsList(type === 'products' ? productParams : {});

  const { loading, error, pagination } = type === 'jerseys' ? jerseyData : productData;
  const rawItems = type === 'jerseys' ? jerseyData.jerseys : productData.products;

  const items = rawItems.filter((item) => {
    if (type === 'jerseys') {
      if (filters.types?.length &&
        !filters.types.includes((item.jersey_type || 'home').toLowerCase())) return false;
    }
    if (type === 'products') {
      if (filters.subcategories?.length > 1 &&
        !filters.subcategories.includes(item.subcategory_slug)) return false;
      if (filters.brands?.length > 1 &&
        !filters.brands.includes(item.brand_slug)) return false;
    }
    const price = Number(item.price ?? item.price_usd ?? 0);
    if (filters.maxPrice < 300 && price > filters.maxPrice) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({ types: [], subcategories: [], brands: [], maxPrice: 300, inStockOnly: false, saleOnly: false });
    setLeague('all');
    setPage(1);
  };

  const activeFilterCount = [
    filters.types?.length, filters.subcategories?.length, filters.brands?.length,
    filters.inStockOnly ? 1 : 0, filters.saleOnly ? 1 : 0,
    filters.maxPrice < 300 ? 1 : 0,
    (league && league !== 'all') ? 1 : 0,
  ].reduce((a, b) => a + (b || 0), 0);

  const visiblePages = Array.from(
    { length: Math.max(0, Math.min(5, pagination.totalPages)) },
    (_, i) => {
      const start = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
      return start + i;
    }
  ).filter((p) => p >= 1 && p <= pagination.totalPages);

  return (
    <main className={classes.page}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <h1>{title}</h1>
          {!loading && <span className={classes.resultCount}>{pagination.total} items</span>}
        </div>
        <div className={classes.headerRight}>
          <div className={classes.gridToggle}>
            <button className={cols === 3 ? classes.activeToggle : ''} onClick={() => setCols(3)} aria-label="3 columns">
              <Grid2x2 size={16} />
            </button>
            <button className={cols === 6 ? classes.activeToggle : ''} onClick={() => setCols(6)} aria-label="6 columns">
              <LayoutGrid size={16} />
            </button>
          </div>
          <button className={classes.mobileFilterBtn} onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && <span className={classes.filterBadge}>{activeFilterCount}</span>}
          </button>
          <div className={classes.perPage}>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>
      </div>

      <div className={classes.layout}>
        <FilterSidebar
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onClear={clearFilters}
          type={type}
          category={category}
          league={type === 'jerseys' && showLeagueFilter ? league : undefined}
          onLeagueChange={type === 'jerseys' && showLeagueFilter
            ? (val) => { setLeague(val); setPage(1); }
            : undefined
          }
        />

        <div className={classes.content}>
          <ItemGrid
            items={items}
            loading={loading}
            error={error}
            cols={cols}
            emptyTitle={type === 'jerseys' ? 'No jerseys found' : 'No products found'}
            renderCard={(item, i) =>
              type === 'jerseys'
                ? <JerseyCard key={item.jersey_id ?? i} jersey={item} index={i} />
                : <ProductCard key={item.product_id ?? i} product={item} index={i} />
            }
          />

          {!loading && pagination.totalPages > 1 && (
            <div className={classes.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className={classes.pageBtn}
              >← Prev</button>
              {visiblePages.map((p) => (
                <button
                  key={p}
                  className={`${classes.pageBtn} ${p === pagination.page ? classes.pageActive : ''}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className={classes.pageBtn}
              >Next →</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductListPage;
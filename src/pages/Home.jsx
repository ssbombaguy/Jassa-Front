import { useEffect, useMemo, useState } from 'react';
import Hero from '../components/Hero/Hero';
import FindYourTeam from '../components/FindYourTeam/FindYourTeam';
import JerseyCard from '../components/JerseyCard/JerseyCard';
import { getFeaturedHome } from '../api/homeApi';
import classes from './Home.module.scss';

const matchesSelection = (item, selection) => {
  if (!selection || selection.id === 'all') return true;
  const targetId = String(selection.id);
  if (selection.type === 'club') {
    const clubId = item?.club_id ?? item?.club?.id ?? item?.clubId;
    if (clubId === undefined || clubId === null) return true;
    return String(clubId) === targetId;
  }
  if (selection.type === 'league') {
    const leagueId = item?.league_id ?? item?.league?.id ?? item?.leagueId;
    if (leagueId === undefined || leagueId === null) return true;
    return String(leagueId) === targetId;
  }
  return true;
};

const CollectionSection = ({ id, title, items, loading, error }) => (
  <section id={id} className={classes.section}>
    <div className={classes.container}>
      <h2 className={classes.sectionTitle}>{title}</h2>
      {loading && <p className={classes.status}>Loading {title.toLowerCase()}...</p>}
      {!loading && error && <p className={classes.statusError}>{error}</p>}
      {!loading && !error && !items.length && (
        <p className={classes.status}>No items available right now.</p>
      )}
      {!loading && !error && items.length > 0 && (
        <div className={classes.grid}>
          {items.map((item, index) => (
            <JerseyCard
              key={item?.jersey_id ?? item?.product_id ?? index}
              jersey={item}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  </section>
);

const Home = () => {
  const [selection, setSelection] = useState({ type: 'league', id: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [homeData, setHomeData] = useState({
    featuredJerseys: [],
    featuredProducts: [],
    newArrivals: [],
    saleItems: [],
    leagues: [],
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    getFeaturedHome()
      .then((data) => {
        if (!mounted) return;
        setHomeData(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.error || err?.message || 'Failed to load homepage collections.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const arrivals = useMemo(
    () => homeData.newArrivals.filter((item) => matchesSelection(item, selection)).slice(0, 12),
    [homeData.newArrivals, selection]
  );
  const featuredJerseys = useMemo(
    () => homeData.featuredJerseys.filter((item) => matchesSelection(item, selection)).slice(0, 8),
    [homeData.featuredJerseys, selection]
  );
  const featuredProducts = useMemo(
    () => homeData.featuredProducts.filter((item) => matchesSelection(item, selection)).slice(0, 8),
    [homeData.featuredProducts, selection]
  );
  const saleItems = useMemo(
    () => homeData.saleItems.filter((item) => matchesSelection(item, selection)).slice(0, 8),
    [homeData.saleItems, selection]
  );

  return (
    <main>
      <Hero />
      <FindYourTeam
        onSelect={(item) => setSelection({ type: item.type, id: item.id })}
      />
      <CollectionSection
        id="new-arrivals"
        title="New Arrivals"
        items={arrivals}
        loading={loading}
        error={error}
      />
      <CollectionSection
        id="featured-jerseys"
        title="Featured Jerseys"
        items={featuredJerseys}
        loading={loading}
        error={error}
      />
      <CollectionSection
        id="featured-products"
        title="Featured Products"
        items={featuredProducts}
        loading={loading}
        error={error}
      />
      <CollectionSection
        id="sale-items"
        title="Sale Items"
        items={saleItems}
        loading={loading}
        error={error}
      />
    </main>
  );
};

export default Home;
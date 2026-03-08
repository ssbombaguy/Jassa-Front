import { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { getLeagues } from '../../api/leaguesApi';
import classes from './FilterSidebar.module.scss';

const JERSEY_TYPES = [
  { id: 'home',       label: 'Home' },
  { id: 'away',       label: 'Away' },
  { id: 'third',      label: 'Third' },
  { id: 'goalkeeper', label: 'Goalkeeper' },
];

const SUBCATEGORIES = {
  boot: [
    { id: 'firm-ground',  label: 'Firm Ground' },
    { id: 'soft-ground',  label: 'Soft Ground' },
    { id: 'astro-turf',   label: 'Astro Turf' },
    { id: 'indoor',       label: 'Indoor' },
    { id: 'multi-ground', label: 'Multi Ground' },
  ],
  equipment: [
    { id: 'football',     label: 'Football' },
    { id: 'shin-guard',   label: 'Shin Guards' },
    { id: 'gk-glove',     label: 'GK Gloves' },
    { id: 'training-bib', label: 'Training Bibs' },
    { id: 'training-bag', label: 'Training Bags' },
  ],
  training: [
    { id: 'football',     label: 'Football' },
    { id: 'training-bib', label: 'Training Bibs' },
    { id: 'training-bag', label: 'Training Bags' },
  ],
};

const BRANDS = [
  { id: 'adidas',       label: 'Adidas' },
  { id: 'nike',         label: 'Nike' },
  { id: 'puma',         label: 'Puma' },
  { id: 'under-armour', label: 'Under Armour' },
  { id: 'new-balance',  label: 'New Balance' },
];

const MAX_PRICE = {
  boot: 400, equipment: 300, training: 200, default: 300,
};

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={classes.section}>
      <button className={classes.sectionHeader} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown size={14} className={open ? classes.chevronOpen : classes.chevron} />
      </button>
      {open && <div className={classes.sectionBody}>{children}</div>}
    </div>
  );
};

const FilterSidebar = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClear,
  type = 'jerseys',
  category = null,
  league,
  onLeagueChange,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => { setLocalFilters(filters); }, [filters]);

  // fetch leagues only for jerseys
  useEffect(() => {
    if (type !== 'jerseys') return;
    let mounted = true;
    getLeagues({ limit: 100 })
      .then((res) => {
        if (!mounted) return;
        setLeagues(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => { if (mounted) setLeagues([]); });
    return () => { mounted = false; };
  }, [type]);

  const isJerseys = type === 'jerseys';
  const subcats = SUBCATEGORIES[category] || [];
  const maxPrice = MAX_PRICE[category] || MAX_PRICE.default;

  const update = (key, value) => {
    const next = { ...localFilters, [key]: value };
    setLocalFilters(next);
    onFilterChange(next);
  };

  const toggleArray = (key, id) => {
    const arr = localFilters[key] || [];
    const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
    update(key, next);
  };

  const activeCount = [
    localFilters.types?.length,
    localFilters.subcategories?.length,
    localFilters.brands?.length,
    localFilters.inStockOnly ? 1 : 0,
    localFilters.saleOnly ? 1 : 0,
    localFilters.maxPrice < maxPrice ? 1 : 0,
    (league && league !== 'all') ? 1 : 0,
  ].reduce((a, b) => a + (b || 0), 0);

  const leagueOptions = [
    { id: 'all', label: 'All Leagues' },
    ...leagues.map((l) => ({
      id: String(l.league_id ?? l.id),
      label: l.league_name ?? l.name,
    })),
  ];

  const sidebarContent = (
    <div className={classes.inner}>
      <div className={classes.sidebarHeader}>
        <div className={classes.sidebarTitle}>
          <span>Filters</span>
          {activeCount > 0 && <span className={classes.activePill}>{activeCount}</span>}
        </div>
        <div className={classes.sidebarActions}>
          {activeCount > 0 && (
            <button className={classes.clearLink} onClick={() => {
              onClear();
              onLeagueChange?.('all');
            }}>
              Clear all
            </button>
          )}
          <button className={classes.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className={classes.sections}>

        {/* LEAGUE — jerseys only */}
        {isJerseys && leagues.length > 0 && (
          <Section title="League" defaultOpen={true}>
            <div className={classes.pillGroup}>
              {leagueOptions.map((l) => (
                <span
                  key={l.id}
                  className={`${classes.pill} ${league === l.id ? classes.pillActive : ''}`}
                  onClick={() => onLeagueChange?.(l.id)}
                >
                  {l.label}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* JERSEY TYPE */}
        {isJerseys && (
          <Section title="Jersey Type">
            <div className={classes.pillGroup}>
              {JERSEY_TYPES.map((t) => (
                <span
                  key={t.id}
                  className={`${classes.pill} ${localFilters.types?.includes(t.id) ? classes.pillActive : ''}`}
                  onClick={() => toggleArray('types', t.id)}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* SUBCATEGORY */}
        {!isJerseys && subcats.length > 0 && (
          <Section title="Category">
            <div className={classes.pillGroup}>
              {subcats.map((s) => (
                <span
                  key={s.id}
                  className={`${classes.pill} ${localFilters.subcategories?.includes(s.id) ? classes.pillActive : ''}`}
                  onClick={() => toggleArray('subcategories', s.id)}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* BRAND */}
        {!isJerseys && (
          <Section title="Brand">
            {BRANDS.map((b) => (
              <label key={b.id} className={classes.checkRow}>
                <input
                  type="checkbox"
                  checked={localFilters.brands?.includes(b.id) ?? false}
                  onChange={() => toggleArray('brands', b.id)}
                  className={classes.checkbox}
                />
                <span className={classes.checkLabel}>{b.label}</span>
              </label>
            ))}
          </Section>
        )}

        {/* PRICE */}
        <Section title="Price">
          <div className={classes.priceRow}>
            <span className={classes.priceMuted}>$0</span>
            <span className={classes.priceActive}>${localFilters.maxPrice ?? maxPrice}</span>
            <span className={classes.priceMuted}>${maxPrice}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={localFilters.maxPrice ?? maxPrice}
            onChange={(e) => update('maxPrice', Number(e.target.value))}
            className={classes.range}
            style={{ '--pct': `${((localFilters.maxPrice ?? maxPrice) / maxPrice) * 100}%` }}
          />
        </Section>

        {/* AVAILABILITY */}
        <Section title="Availability">
          {[
            { key: 'inStockOnly', label: 'In stock only' },
            { key: 'saleOnly',    label: 'Sale only' },
          ].map(({ key, label }) => (
            <label key={key} className={classes.toggleRow}>
              <span className={classes.toggleLabel}>{label}</span>
              <button
                className={`${classes.toggle} ${localFilters[key] ? classes.toggleOn : ''}`}
                onClick={() => update(key, !localFilters[key])}
                role="switch"
                aria-checked={localFilters[key]}
              >
                <span className={classes.toggleThumb} />
              </button>
            </label>
          ))}
        </Section>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <aside className={classes.desktopSidebar}>
        {sidebarContent}
      </aside>

      {/* Mobile: slide-out overlay */}
      {open && (
        <>
          <div className={classes.backdrop} onClick={onClose} aria-hidden="true" />
          <aside className={classes.mobileSidebar}>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default FilterSidebar;
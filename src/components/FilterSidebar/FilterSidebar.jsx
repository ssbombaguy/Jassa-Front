import classes from './FilterSidebar.module.scss';

const JERSEY_TYPES = [
  { id: 'home', label: 'Home' },
  { id: 'away', label: 'Away' },
  { id: 'third', label: 'Third' },
  { id: 'goalkeeper', label: 'Goalkeeper' },
];

const FilterSidebar = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClear,
}) => {
  if (!open) return null;

  return (
    <>
      <div className={classes.backdrop} onClick={onClose} aria-hidden="true" />
      <aside className={classes.sidebar}>
        <div className={classes.header}>
          <h3>Filters</h3>
          <button className={classes.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={classes.content}>
          <div className={classes.group}>
            <h4>Jersey Type</h4>
            {JERSEY_TYPES.map((t) => (
              <label key={t.id} className={classes.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.types?.includes(t.id) ?? false}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...(filters.types || []), t.id]
                      : (filters.types || []).filter((x) => x !== t.id);
                    onFilterChange({ ...filters, types: next });
                  }}
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
          <div className={classes.group}>
            <h4>Price</h4>
            <div className={classes.range}>
              <span>$0</span>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.maxPrice ?? 200}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              />
              <span>${filters.maxPrice ?? 200}</span>
            </div>
          </div>
          <div className={classes.group}>
            <label className={classes.checkbox}>
              <input
                type="checkbox"
                checked={filters.inStockOnly ?? false}
                onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              />
              <span>In stock only</span>
            </label>
          </div>
          <button className={classes.clearBtn} onClick={onClear}>
            Clear all filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;

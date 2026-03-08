import SkeletonCard from '../SkeletonCard/SkeletonCard';
import classes from './ItemGrid.module.scss';

const ItemGrid = ({
  items = [],
  loading,
  error,
  renderCard,
  cols = 3,
  emptyTitle = 'No items found',
  emptyMessage = 'Try adjusting your filters or search.',
  skeletonCount = 8,
}) => {
  if (loading) {
    return (
      <div className={classes.grid} data-cols={cols}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={classes.empty}>
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={classes.grid} data-cols={cols}>
      {items.map((item, i) => renderCard(item, i))}
    </div>
  );
};

export default ItemGrid;
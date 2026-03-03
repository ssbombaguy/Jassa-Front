import JerseyCard from '../JerseyCard/JerseyCard';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import classes from './JerseyGrid.module.scss';

const JerseyGrid = ({ jerseys = [], loading, error }) => {
  if (loading) {
    return (
      <div className={classes.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
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

  if (!jerseys.length) {
    return (
      <div className={classes.empty}>
        <h3>No jerseys found</h3>
        <p>Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className={classes.grid}>
      {jerseys.map((jersey, i) => (
        <JerseyCard key={jersey.id ?? jersey.jersey_id ?? i} jersey={jersey} index={i} />
      ))}
    </div>
  );
};

export default JerseyGrid;

import classes from './SkeletonCard.module.scss';

const SkeletonCard = () => (
  <div className={classes.card}>
    <div className={classes.image} />
    <div className={classes.badges}>
      <div className={classes.badge} />
      <div className={classes.badge} />
    </div>
    <div className={classes.title} />
    <div className={classes.subtitle} />
    <div className={classes.price} />
    <div className={classes.cta} />
  </div>
);

export default SkeletonCard;

import { Link } from 'react-router-dom';
import classes from './NotFound.module.scss';

const NotFound = () => (
  <main className={classes.page}>
    <h1>404</h1>
    <p>Page not found</p>
    <Link to="/" className={classes.backBtn}>Back to Home</Link>
  </main>
);

export default NotFound;

import { useState, useEffect } from 'react';
import classes from './OfflineBanner.module.scss';

const OfflineBanner = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className={classes.banner} role="alert">
      You appear to be offline. Some features may be limited.
    </div>
  );
};

export default OfflineBanner;

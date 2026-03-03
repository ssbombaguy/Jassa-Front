import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to fetch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, deps);

  return { data, loading, error, refetch: run };
};

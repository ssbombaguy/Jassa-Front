import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJerseys } from '../store/slices/jerseysSlice';

export const useJerseys = (filters = {}) => {
  const dispatch = useDispatch();
  const { items, loading, error, pagination } = useSelector((state) => state.jerseys);

  useEffect(() => {
    dispatch(fetchJerseys(filters));
  }, [dispatch, JSON.stringify(filters)]);

  return { jerseys: items, loading, error, pagination };
};

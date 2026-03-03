import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJerseyById } from '../store/slices/jerseysSlice';

export const useJerseyDetail = (jerseyId) => {
  const dispatch = useDispatch();
  const { selectedJersey, loading, error } = useSelector((state) => state.jerseys);

  useEffect(() => {
    if (jerseyId) {
      dispatch(fetchJerseyById(jerseyId));
    }
  }, [dispatch, jerseyId]);

  return { jersey: selectedJersey, loading, error };
};

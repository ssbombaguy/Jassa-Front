import apiClient from './client';

const toArray = (value) => (Array.isArray(value) ? value : []);

export const getFeaturedHome = async () => {
  const payload = await apiClient.get('/featured');
  const data = payload?.data || {};

  return {
    featuredJerseys: toArray(data.featured_jerseys),
    featuredProducts: toArray(data.featured_products),
    newArrivals: toArray(data.new_arrivals),
    saleItems: toArray(data.sale_items),
    leagues: toArray(data.leagues),
  };
};

export default {
  getFeaturedHome,
};

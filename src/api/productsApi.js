import apiClient from "./client";

const pickData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  return [];
};

const pickPagination = (payload, fallbackLimit) => {
  const source = payload?.pagination || payload?.meta || payload?.data?.pagination || payload?.data?.meta;

  return {
    total: source?.total ?? payload?.total ?? payload?.data?.total ?? 0,
    page: source?.page ?? payload?.page ?? payload?.data?.page ?? 1,
    limit: source?.limit ?? payload?.limit ?? payload?.data?.limit ?? fallbackLimit,
    totalPages: source?.totalPages ?? payload?.totalPages ?? payload?.data?.totalPages ?? 1,
  };
};

const normalizeProduct = (product) => {
  return {
    ...product,
    id: product?.product_id ?? product?.id,
    inStock: product?.in_stock ?? true,
    image: product?.image_url,
    discountedPrice: product?.is_discounted ? +(product.price * (1 - product.discount_pct / 100)).toFixed(2) : null,
  };
};

export const getProducts = async (params) => {
  const payload = await apiClient.get("/products", { params });
  const products = pickData(payload).map(normalizeProduct);
  const pagination = pickPagination(payload, params?.limit ?? 20);

  return {
    products,
    pagination,
  };
};

export const getProductById = async (id) => {
  const payload = await apiClient.get(`/products/${id}`);
  const product = payload?.data || payload?.product || payload;
  return normalizeProduct(product);
};


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
  const sizes = product?.sizes || product?.availableSizes || [];

  const inStock =
    typeof product?.inStock === "boolean"
      ? product.inStock
      : typeof product?.stock === "number"
        ? product.stock > 0
        : true;

  return {
    ...product,
    id: product?.id ?? product?._id,
    sizes: Array.isArray(sizes) ? sizes : [],
    inStock,
    originalPrice: product?.originalPrice ?? null,
    rating: Number(product?.rating ?? 0),
    reviews: Number(product?.reviews ?? 0),
    image: product?.image || product?.imageUrl || "https://placehold.co/400x480/1F6F50/FFFFFF?text=Jersey",
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
  const payload = await apiRequest(`/api/products/${id}`);
  const product = payload?.data || payload?.product || payload;
  return normalizeProduct(product);
};

export const createProduct = (body) => apiRequest("/api/products", { method: "POST", body });
export const updateProduct = (id, body) => apiRequest(`/api/products/${id}`, { method: "PUT", body });
export const deleteProduct = (id) => apiRequest(`/api/products/${id}`, { method: "DELETE" });

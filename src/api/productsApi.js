import apiClient from "./client";
import { mockProducts } from "../data/mockProducts";

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

const filterAndSortMock = (params = {}) => {
  let list = [...mockProducts];
  if (params?.brand && params.brand !== "All") {
    list = list.filter((p) => p.brand === params.brand);
  }
  if (params?.size && params.size !== "All") {
    list = list.filter((p) => (p.sizes || []).includes(params.size));
  }
  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q)
    );
  }
  const sort = params?.sort || "";
  const order = params?.order || "asc";
  if (sort === "price") {
    list.sort((a, b) => (order === "desc" ? b.price - a.price : a.price - b.price));
  } else if (sort === "rating") {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "name") {
    list.sort((a, b) =>
      order === "desc"
        ? (b.name || "").localeCompare(a.name || "")
        : (a.name || "").localeCompare(b.name || "")
    );
  }
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const total = list.length;
  const start = (page - 1) * limit;
  const products = list.slice(start, start + limit);
  return {
    products: products.map(normalizeProduct),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getProducts = async (params) => {
  try {
    const payload = await apiClient.get("/products", { params });
    const products = pickData(payload).map(normalizeProduct);
    const pagination = pickPagination(payload, params?.limit ?? 20);

    return {
      products,
      pagination,
    };
  } catch (err) {
    if (err?.code === "ERR_NETWORK" || err?.message?.includes("Network Error")) {
      return filterAndSortMock(params);
    }
    throw err;
  }
};

export const getProductById = async (id) => {
  const payload = await apiRequest(`/api/products/${id}`);
  const product = payload?.data || payload?.product || payload;
  return normalizeProduct(product);
};

export const createProduct = (body) => apiRequest("/api/products", { method: "POST", body });
export const updateProduct = (id, body) => apiRequest(`/api/products/${id}`, { method: "PUT", body });
export const deleteProduct = (id) => apiRequest(`/api/products/${id}`, { method: "DELETE" });

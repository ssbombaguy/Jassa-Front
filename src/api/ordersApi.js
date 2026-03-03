import apiClient from "./client";

export const placeOrder = (body) => apiClient.post("/orders", body);
export const getOrders = () => apiClient.get("/orders");
export const getOrderById = (id) => apiClient.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  apiClient.patch(`/orders/${id}/status`, { status });


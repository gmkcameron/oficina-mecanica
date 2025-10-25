import apiClient from './apiClient';

export const getOrders = () => apiClient.get('/orders');
export const getOrder = (id) => apiClient.get(`/orders/${id}`);
export const createOrder = (data) => apiClient.post('/orders', data);
export const updateOrder = (id, data) => apiClient.put(`/orders/${id}`, data);
export const deleteOrder = (id) => apiClient.delete(`/orders/${id}`);

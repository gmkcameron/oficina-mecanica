import apiClient from './apiClient';

export const getPieces = () => apiClient.get('/pieces');
export const getPiece = (id) => apiClient.get(`/pieces/${id}`);
export const createPiece = (data) => apiClient.post('/pieces', data);
export const updatePiece = (id, data) => apiClient.put(`/pieces/${id}`, data);
export const deletePiece = (id) => apiClient.delete(`/pieces/${id}`);

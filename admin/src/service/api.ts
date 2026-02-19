import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Helper to handle response and throw errors for TanStack Query to catch
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

export const apiClient = {
  get: async (url: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}${url}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  post: async (url: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetchWithAuth(`${API_BASE_URL}${url}`, {
      method: 'POST',
      // If FormData, let the browser set the Content-Type with the boundary
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Apply the same logic to patch to be safe
  patch: async (url: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetchWithAuth(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (url: string, data: any) => {
    const response = await fetchWithAuth(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  // ✅ ADD THIS METHOD
  // ✅ UPDATED PATCH METHOD
 
  delete: async (url: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};
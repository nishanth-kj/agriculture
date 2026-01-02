import axios, { AxiosResponse } from 'axios';

// Define the standard API response structure
export interface ApiResponse<T = any> {
    status: 0 | 1; // 1: success, 0: error
    message: string;
    data: T | null;
    error: any | null;
}

// Use NEXT_PUBLIC_API_URL for client-side, fallback to API_URL (if defined) or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? process.env.API_URL : '') || 'http://localhost:8000/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling cookies/sessions if needed
});

// Response interceptor to handle standardized responses
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // If the API returns a status of 0 (error) in the body, reject the promise
        if (response.data && response.data.status === 0) {
            return Promise.reject(new Error(response.data.message || 'API Error'));
        }
        // Return the full response, components can access .data.data
        return response;
    },
    (error) => {
        // Handle network or server errors
        if (error.response && error.response.data) {
            // Try to extract the error message from our standardized format
            const apiError = error.response.data as ApiResponse;
            if (apiError.message) {
                return Promise.reject(new Error(apiError.message));
            }
        }
        return Promise.reject(error);
    }
);

// Helper function to extract data directly
export const fetchApi = async <T>(url: string, payload?: any, method: 'GET' | 'POST' = 'GET'): Promise<T> => {
    try {
        let response: AxiosResponse<ApiResponse<T>>;
        if (method === 'POST') {
            response = await apiClient.post<ApiResponse<T>>(url, payload);
        } else {
            response = await apiClient.get<ApiResponse<T>>(url, { params: payload });
        }

        if (response.data.data) {
            return response.data.data;
        }
        // Fallback if data is null but status is success (e.g. simple success message)
        return response.data as unknown as T;

    } catch (error) {
        throw error;
    }
};

export default apiClient;

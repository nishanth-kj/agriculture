/**
 * Standardized API Client
 * Usage: api('/url', payload).post() or api('/url').get()
 * All methods call POST under the hood to satisfy the project's POST-only architecture.
 */
export const api = (url: string, payload: unknown = {}) => {
  const request = async (method: string) => {
    const options: RequestInit = {
      method: 'POST', // Enforced architecture
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...(payload as Record<string, unknown>),
        _method: method // Pass the intended method for legacy/logging purposes
      }),
    };

    const response = await fetch(url, options);

    // Auto-handle 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
          window.location.href = '/login';
      }
      return null;
    }

    const result = await response.json();

    if (result.status === 0) {
      throw new Error(result.error?.message || 'API Error');
    }

    return result.data;
  };

  return {
    get: () => request('GET'),
    post: () => request('POST'),
    put: () => request('PUT'),
    delete: () => request('DELETE'),
  };
};

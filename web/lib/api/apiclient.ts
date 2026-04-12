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
        ...(payload as Record<string, unknown>)
      }),
    };

    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    const response = await fetch(normalizedUrl, options);

    // Auto-handle 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
          window.location.href = '/login';
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API did not return a valid JSON response");
    }

    const result = await response.json();

    if (result.status === 0) {
      throw new Error(result.error?.message || 'API Error');
    }

    return result;
  };

  return {
    get: () => request('GET'),
    post: () => request('POST'),
    put: () => request('PUT'),
    delete: () => request('DELETE'),
  };
};

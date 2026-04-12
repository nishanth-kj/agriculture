/**
 * Unified API Client
 * Enforces the POST-only modification pattern and handles standardized responses.
 */
export async function apiRequest(url: string, body?: Record<string, unknown>) {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    // Auto-handle 401 Unauthorized
    if (response.status === 401) {
        window.location.href = '/login';
        return null;
    }

    const result = await response.json();

    if (result.status === 0) {
        throw new Error(result.error?.message || 'API Error');
    }

    return result.data;
}

/**
 * Convenience wrapper for simple GET-style retrieval via POST
 */
export async function apiFetch(url: string) {
    return apiRequest(url, {}); // Empty body to trigger retrieval
}

export const api = (url: string, payload: Record<string, unknown> = {}) => {
  const request = async (method: "GET" | "POST" | "PUT" | "DELETE") => {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET") {
      options.body = JSON.stringify(payload);
    }

    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    const response = await fetch(normalizedUrl, options);

    // 401 handling
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("API did not return a valid JSON response");
    }

    const result = await response.json();

    if (result.status === 0) {
      throw new Error(result.error?.message || "API Error");
    }

    return result;
  };

  return {
    get: () => request("GET"),       
    post: () => request("POST"),     
        put: () => request("PUT"),
    delete: () => request("DELETE"),
  };
};
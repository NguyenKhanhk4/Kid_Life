const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (response.status === 204) {
      return {} as T;
    }

    let json: ApiEnvelope<T>;
    try {
      json = (await response.json()) as ApiEnvelope<T>;
    } catch {
      throw new ApiError('Invalid JSON response from server', 'PARSE_ERROR', response.status);
    }

    if (!response.ok) {
      const errCode = json?.error?.code || 'UNKNOWN_ERROR';
      const errMsg = json?.error?.message || 'An unknown error occurred';
      throw new ApiError(errMsg, errCode, response.status);
    }

    if (json && json.data !== undefined) {
      return json.data;
    }

    throw new ApiError('Response missing data payload', 'MALFORMED_RESPONSE', response.status);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      // Auto-refresh token logic
      if (error.statusCode === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });

            if (refreshRes.ok) {
              const refreshJson = await refreshRes.json();
              if (refreshJson.data?.accessToken && refreshJson.data?.refreshToken) {
                localStorage.setItem('access_token', refreshJson.data.accessToken);
                localStorage.setItem('refresh_token', refreshJson.data.refreshToken);
                
                // Retry the original request
                const newHeaders = new Headers(options.headers);
                newHeaders.set('Content-Type', 'application/json');
                newHeaders.set('Authorization', `Bearer ${refreshJson.data.accessToken}`);
                
                const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
                  ...options,
                  headers: newHeaders
                });
                
                if (retryRes.status === 204) return {} as T;
                const retryJson = await retryRes.json();
                if (retryRes.ok && retryJson.data !== undefined) {
                  return retryJson.data as T;
                }
              }
            }
          } catch (refreshErr) {
            // Ignore, let it throw 401
          }
          // Clear tokens to force re-login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 'TIMEOUT', 408);
    }
    const msg = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(msg, 'NETWORK_ERROR', 0);
  } finally {
    clearTimeout(timeoutId);
  }
};

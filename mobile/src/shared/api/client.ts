import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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
  options: RequestInit = {},
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is not defined');
  }

  const token = await SecureStore.getItemAsync('user_token');

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
      throw new ApiError(
        'Invalid JSON response from server',
        'PARSE_ERROR',
        response.status,
      );
    }

    if (!response.ok) {
      const errCode = json?.error?.code || 'UNKNOWN_ERROR';
      const errMsg = json?.error?.message || 'An unknown error occurred';
      throw new ApiError(errMsg, errCode, response.status);
    }

    if (json && json.data !== undefined) {
      return json.data;
    }

<<<<<<< HEAD
=======
    // According to contract, successful response should have 'data' (unless 204)
>>>>>>> 9c100f5821007e1b02b22adb6b13a80ea7ea71a3
    throw new ApiError(
      'Response missing data payload',
      'MALFORMED_RESPONSE',
      response.status,
    );
  } catch (error: unknown) {
    if (error instanceof ApiError) {
<<<<<<< HEAD
      // Auto-refresh token logic
      if (error.statusCode === 401) {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
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
                await SecureStore.setItemAsync('user_token', refreshJson.data.accessToken);
                await SecureStore.setItemAsync('refresh_token', refreshJson.data.refreshToken);
                
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
            // Refresh failed, fall through to throwing the original 401
          }
          // If refresh fails, clear tokens to force re-login
          await SecureStore.deleteItemAsync('user_token');
          await SecureStore.deleteItemAsync('refresh_token');
        }
      }
=======
>>>>>>> 9c100f5821007e1b02b22adb6b13a80ea7ea71a3
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 'TIMEOUT', 408);
    }
    const msg =
      error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(msg, 'NETWORK_ERROR', 0);
  } finally {
    clearTimeout(timeoutId);
  }
};

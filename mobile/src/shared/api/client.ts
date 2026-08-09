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

    // According to contract, successful response should have 'data' (unless 204)
    throw new ApiError(
      'Response missing data payload',
      'MALFORMED_RESPONSE',
      response.status,
    );
  } catch (error: unknown) {
    if (error instanceof ApiError) {
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

export class ApiError extends Error {
  public code: string;
  constructor(message: string, code: string = "UNKNOWN_ERROR") {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export interface ApiResponse<T> {
  data?: T;
  meta?: unknown;
  error?: {
    code: string;
    message: string;
  };
}

export interface AdminReportData {
  subscriptionsCount: number;
  transactionsCount: number;
  revenue: number;
  subscriptions: Array<{
    _id: string;
    planId: string;
    status: string;
    createdAt: string;
    startDate: string | null;
    endDate: string | null;
  }>;
  transactions: Array<{
    _id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  }>;
}

export interface ExpertReportData {
  contentStats: unknown[];
  topModules: Array<{
    moduleId: string;
    name: string;
    views: number;
    rating: number;
  }>;
  engagementMetrics: {
    views: number;
    completions: number;
  };
}

const fetchWithTimeout = async (
  resource: string,
  options: RequestInit & { timeout?: number },
) => {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", "TIMEOUT");
    }
    throw error;
  }
};

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) throw new ApiError("Missing VITE_API_URL", "CONFIG_ERROR");
  return url;
};

const getToken = () => {
  const token = localStorage.getItem("user_token");
  if (!token) throw new ApiError("Chưa đăng nhập", "NO_TOKEN");
  return token;
};

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const headers = new Headers(options?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  const response = await fetchWithTimeout(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new ApiError(
        `HTTP Error ${response.status}`,
        `HTTP_${response.status}`,
      );
    }
    throw new ApiError("Malformed response", "PARSE_ERROR");
  }

  if (!response.ok) {
    throw new ApiError(
      json.error?.message || `HTTP Error ${response.status}`,
      json.error?.code || `HTTP_${response.status}`,
    );
  }

  if (json.data === undefined) {
    throw new ApiError("Malformed response", "MISSING_DATA");
  }

  return json.data;
}

export const getAdminOverview = (dateFrom: string, dateTo: string) => {
  return fetchApi<AdminReportData>(
    `/api/v1/reports/admin/overview?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`,
  );
};

export const getExpertContent = (dateFrom: string, dateTo: string) => {
  return fetchApi<ExpertReportData>(
    `/api/v1/reports/expert/content?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`,
  );
};

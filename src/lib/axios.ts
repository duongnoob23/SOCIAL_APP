import { useAuthStore } from "@/store/authStore";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const ZIPTASTIC_API_BASE_URL = process.env.EXPO_PUBLIC_ZIPTASTIC_API_BASE_URL;

const baseConfig = {
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// PHẦN 1: Tạo Instances
export const axiosInstanceZipcode = axios.create({
  baseURL: ZIPTASTIC_API_BASE_URL,
  ...baseConfig,
});

export const axiosInstanceV1 = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  ...baseConfig,
});

export const axiosInstanceV2 = axios.create({
  baseURL: `${API_BASE_URL}/api/v2`,
  ...baseConfig,
});

// PHẦN 2: Request Interceptor
const onRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (__DEV__) {
    console.log(`[API] ▶ ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  if (__DEV__) {
    console.error("[API] Request setup failed:", error.message);
  }
  return Promise.reject(error);
};

// PHẦN 3: Response Interceptor + Refresh Token Queue
const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (__DEV__) {
    console.log(`[API] ✅ ${response.status} ${response.config.url}`);
  }
  return response;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

const onResponseError = async (error: AxiosError): Promise<unknown> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (__DEV__) {
    console.error(
      `[API] ❌ ${error.response?.status} ${originalRequest?.url}`,
      error.response?.data,
    );
  }

  // Trường hợp 1: Mạng chết, timeout, server sập
  if (!error.response) {
    return Promise.reject(error);
  }

  // Trường hợp 2: 401 - Token hết hạn
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstanceV2(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/v2/auth/refresh`, {
        refresh_token: useAuthStore.getState().refreshToken,
      });

      const newToken: string = data.access_token;
      const newRefreshToken: string = data.refresh_token;
      const currentUser = useAuthStore.getState().user!;

      useAuthStore.getState().setAuth(newToken, currentUser, newRefreshToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstanceV2(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  // Trường hợp 3: 403 - Không có quyền
  if (error.response.status === 403) {
    if (__DEV__) {
      console.warn("[API] 403 Forbidden:", originalRequest.url);
    }
    return Promise.reject(error);
  }

  // Trường hợp 4: 5xx - Lỗi server
  if (error.response.status >= 500) {
    if (__DEV__) {
      console.error("[API] Server error:", error.response.status);
    }
    return Promise.reject(error);
  }

  return Promise.reject(error);
};

// PHẦN 4: Gắn interceptor vào V1, V2 (Zipcode không gắn)
const authInstances = [axiosInstanceV1, axiosInstanceV2];

authInstances.forEach((instance) => {
  instance.interceptors.request.use(onRequest, onRequestError);
  instance.interceptors.response.use(onResponse, onResponseError);
});

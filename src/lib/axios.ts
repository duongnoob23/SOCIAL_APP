import { logBreadcrumb, logEmbraceMessage } from '@/utils/embrace';
import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const ZIPTASTIC_API_BASE_URL = process.env.EXPO_PUBLIC_ZIPTASTIC_API_BASE_URL;

const baseConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const axiosInstanceZipcode = axios.create({
  baseURL: ZIPTASTIC_API_BASE_URL,
  ...baseConfig,
});

export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
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

// Add Embrace network monitoring to all axios instances (only on native)
if (Platform.OS !== 'web') {
  const instances = [axiosInstance, axiosInstanceV1, axiosInstanceV2, axiosInstanceZipcode];
  
  instances.forEach((instance) => {
    // Response interceptor to log errors
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorData = {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          status: error.response?.status,
          message: error.message,
        };
        
        // Log error to Embrace
        logEmbraceMessage(
          `API Error: ${errorData.method} ${errorData.url}`,
          'error',
          errorData
        );
        
        // Add breadcrumb
        logBreadcrumb('API Request Failed', errorData);
        
        console.log('[Embrace] API Error logged:', errorData);
        
        return Promise.reject(error);
      }
    );
  });
}

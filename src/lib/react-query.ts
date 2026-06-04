import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Infinite stale time
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days for persist
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const asyncStoragePersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await AsyncStorage.setItem(
      'REACT_QUERY_OFFLINE_CACHE',
      JSON.stringify(client)
    );
  },
  restoreClient: async () => {
    const cached = await AsyncStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
    return cached ? JSON.parse(cached) : undefined;
  },
  removeClient: async () => {
    await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
  },
};

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
});

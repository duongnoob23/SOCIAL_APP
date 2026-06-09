import { QueryClient } from "@tanstack/react-query";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "react-query-cache" });

const CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";

// MMKV persister — đồng bộ, không cần async/await
const mmkvPersister: Persister = {
  persistClient: (client: PersistedClient) => {
    storage.set(CACHE_KEY, JSON.stringify(client));
  },
  restoreClient: () => {
    const cached = storage.getString(CACHE_KEY);
    return cached ? JSON.parse(cached) : undefined;
  },
  removeClient: () => {
    storage.delete(CACHE_KEY);
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 ngày
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

persistQueryClient({
  queryClient,
  persister: mmkvPersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
});

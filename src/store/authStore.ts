import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 1. MMKV Storage instance
const mmkvStorage = new MMKV({ id: "auth-storage" });

// 2. Adapter để Zustand hiểu được MMKV
//    Zustand persist cần object có 3 method: getItem, setItem, removeItem
const zustandMMKVStorage = {
  getItem: (name: string) => {
    const value = mmkvStorage.getString(name);
    if (value === undefined) {
      return null;
    }
    return value;
  },

  // MMKV dùng .set() không phải .setItem()
  setItem: (name: string, value: string) => {
    mmkvStorage.set(name, value);
  },

  // MMKV dùng .delete() không phải .removeItem()
  removeItem: (name: string) => {
    mmkvStorage.delete(name);
  },
};

// 3. Kiểu dữ liệu cho User
//    Không nên dùng any — định nghĩa rõ những field bạn dùng
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

// 4. Kiểu dữ liệu cho toàn bộ Store
//    Tách rõ: State (dữ liệu) và Actions (hành động)
interface AuthStateData {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  refreshToken: string | null;
}

interface AuthStateActions {
  setAuth: (token: string, user: AuthUser, refreshToken: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

type AuthState = AuthStateData & AuthStateActions;

// 5. Giá trị mặc định ban đầu
//    Tách ra để dùng lại trong logout (reset về trạng thái gốc)

const initateData = {
  token: null,
  user: null,
  isHydrated: false,
  refreshToken: null,
};

// 6. Tạo Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // --- State ban đầu ---
      token: initateData.token,
      user: initateData.user,
      isHydrated: initateData.isHydrated,
      refreshToken: initateData.refreshToken,

      // --- Actions ---
      // Gọi sau khi login thành công: lưu token và thông tin user
      setAuth: (token: string, user: AuthUser, refreshToken: string) => {
        set({
          token: token,
          user: user,
          refreshToken: refreshToken,
        });
      },

      // Gọi khi logout: xóa token và user, reset về trạng thái ban đầu
      // isHydrated giữ nguyên true vì app vẫn đang chạy
      logout: () => {
        set({
          token: initateData.token,
          user: initateData.user,
          refreshToken: initateData.refreshToken,
        });
      },

      // Gọi tự động bởi onRehydrateStorage khi MMKV load xong dữ liệu
      // Dùng để các component biết rằng store đã sẵn sàng (tránh flash màn hình)
      setHydrated: () => {
        set({
          isHydrated: true,
        });
      },
    }),
    // --- Cấu hình persist ---
    {
      name: "auth-storage",

      // Nói cho Zustand biết dùng storage nào và serialize bằng JSON
      storage: createJSONStorage(() => zustandMMKVStorage),

      // Chỉ persist token và user, KHÔNG persist isHydrated
      // vì isHydrated luôn bắt đầu là false khi app khởi động
      partialize: (state: AuthState): AuthStateData => ({
        token: state.token,
        user: state.user,
        isHydrated: state.isHydrated,
        refreshToken: state.refreshToken,
      }),

      // Callback chạy sau khi Zustand đọc xong dữ liệu từ MMKV
      // state có thể là undefined nếu chưa có dữ liệu lưu trước đó
      onRehydrateStorage: () => {
        return (state: AuthState | undefined) => {
          if (state !== undefined) {
            state.setHydrated();
          }
        };
      },
    },
  ),
);

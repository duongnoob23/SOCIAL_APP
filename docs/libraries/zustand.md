# Toàn tập Hướng dẫn sử dụng Zustand

Zustand là thư viện quản lý State (trạng thái) cực kỳ nhỏ gọn (~1.1kB) nhưng vô cùng mạnh mẽ. Tài liệu này sẽ đi từ cơ bản đến nâng cao, hướng dẫn mọi pattern chuẩn xác nhất để dùng cho dự án lớn.

---

## 1. Nền tảng: Hiểu đúng cách hoạt động của `set` và `get`
Khi tạo một store, hàm `create` truyền vào một callback chứa 2 tham số quan trọng: `set` và `get`.

### 3 cách sử dụng `set`
```typescript
import { create } from 'zustand';

interface State {
  count: number;
  user: { name: string; age: number };
  setCount: (n: number) => void;
  increment: () => void;
  dangerousReset: () => void;
  fetchAndUpdate: () => Promise<void>;
}

const useStore = create<State>((set, get) => ({
  count: 0,
  user: { name: 'Bear', age: 3 },

  // Cách 1: Ghi thẳng giá trị mới (Merge Shallow)
  // Chỉ cập nhật field count, field user vẫn được giữ nguyên.
  setCount: (n: number) => set({ count: n }),

  // Cách 2: Dùng callback nhận state hiện tại (Dựa vào giá trị cũ)
  increment: () => set((state) => ({ count: state.count + 1 })),

  // Cách 3: Replace toàn bộ (Hiếm dùng, nguy hiểm)
  // Truyền tham số thứ 2 là `true`, store sẽ bị thay thế HOÀN TOÀN bằng object mới.
  dangerousReset: () => set({ count: 0, user: { name: '', age: 0 } }, true),

  // Cách dùng get() - Đọc state hiện tại bên trong Async Action
  fetchAndUpdate: async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    // NGUY HIỂM: Nếu dùng biến (state) => {...}, giá trị có thể đã "stale" (bị cũ).
    // CHUẨN: Dùng get() để đảm bảo đọc ra giá trị MỚI NHẤT ngay sau khi await xong.
    const currentCount = get().count;
    set({ count: currentCount + data.value });
  },
}));
```

---

## 2. Selector & Re-render (Quan trọng nhất về Hiệu năng)
Điểm người mới hay sai lầm nhất là làm Component bị re-render liên tục vì lấy toàn bộ store thay vì lấy một phần nhỏ.

```typescript
const useStore = create<State>()((set) => ({
  bears: 0,
  fishes: 0,
  weather: 'sunny',
  setBears: (n: number) => set({ bears: n }),
}));
```

### Các ví dụ từ Sai đến Chuẩn:

```tsx
// ❌ SAI: Lấy toàn bộ store
// Hậu quả: Component sẽ re-render nếu fishes hoặc weather đổi, dù nó chỉ cần in ra bears.
function BadComponent() {
  const store = useStore(); 
  return <Text>{store.bears}</Text>;
}

// ✓ ĐÚNG: Chỉ Subscribe đúng thứ mình cần
// Component chỉ re-render khi `bears` thực sự thay đổi.
function GoodComponent() {
  const bears = useStore((state) => state.bears);
  return <Text>{bears}</Text>;
}

// ✓ NÂNG CAO: Lấy nhiều field bằng useShallow
import { useShallow } from 'zustand/react/shallow';

function MultiFieldComponent() {
  // Tại sao cần useShallow? 
  // Object ({ bears, fishes }) là object mới TẠO MỚI mỗi lần render.
  // Zustand mặc định so sánh (===) thấy reference khác nhau -> cho rằng data thay đổi -> Re-render thừa.
  // useShallow giúp Zustand check SÂU vào từng giá trị (keys) thay vì check reference.
  const { bears, fishes } = useStore(
    useShallow((state) => ({ bears: state.bears, fishes: state.fishes }))
  );
  return <Text>{bears} bears, {fishes} fishes</Text>;
}
```

---

## 3. Pattern Tách Biệt Actions (Chuẩn cho App Lớn)
Tách functions (actions) ra một object riêng giúp code dễ bảo trì, gọn gàng và quan trọng nhất: không gây re-render thừa vì function không bị check khi lấy data.

```typescript
// ✓ Cách chuẩn: Gom actions vào object riêng
interface AuthState {
  token: string | null;
  user: User | null;
  actions: {
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (partial: Partial<User>) => void;
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  user: null,

  actions: {
    login: (token, user) => set({ token, user }),
    logout: () => set({ token: null, user: null }),
    
    // Cập nhật lồng (Nested update) phải tự merge thủ công nếu không dùng Immer
    updateUser: (partial) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...partial } : null,
      })),
  },
}));
```

**Cách gọi Component cực kỳ an toàn (Không sợ Re-render):**
```tsx
function LoginButton() {
  // Biến actions không bao giờ đổi tham chiếu -> An toàn lấy chung 1 cục.
  const { login, logout } = useAuthStore((state) => state.actions);
  const token = useAuthStore((state) => state.token);
}
```

---

## 4. Middleware Persist (Lưu xuống đĩa qua MMKV)
Lưu data xuống ở cứng (vĩnh viễn) bằng MMKV kết hợp với `persist` middleware.

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'auth-storage' });

// 1. Adapter để Zustand nói chuyện được với cấu trúc MMKV
const zustandMMKVStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isHydrated: false,
      actions: {
        setHydrated: () => set({ isHydrated: true }),
      },
    }),
    {
      name: 'auth-storage', // Key lưu dưới ổ đĩa
      storage: createJSONStorage(() => zustandMMKVStorage),

      // 2. QUAN TRỌNG: Partialize - Chọn lọc những gì cần lưu
      // Không lưu actions (vì hàm luôn tạo lại mỗi lần chạy lên RAM).
      // Không lưu isHydrated (vì lúc nào bật app cũng phải đợi từ đầu = false).
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),

      // 3. Callback sau khi MMKV load xong từ ổ cứng
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.actions.setHydrated();
      },

      // 4. Versioning - Dùng khi đổi schema (vd update app từ version 1 -> 2)
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            user: { name: persistedState.userName }, // Gộp field cũ vào field mới
          };
        }
        return persistedState;
      },
    }
  )
);
```

---

## 5. Gọi Store bên ngoài React Component
Cực kỳ hữu ích khi bạn phải tương tác State trong Axios Interceptors, Background Tasks (ví dụ như Sync Queue), hoặc các hàm thuần JS.

```typescript
// 1. Đọc giá trị
const token = useAuthStore.getState().token;

// 2. Gọi hàm
useAuthStore.getState().actions.logout();

// 3. Đăng ký tự động thay đổi (Subscribe)
const unsubscribe = useAuthStore.subscribe(
  (state) => state.token, // Chỉ theo dõi trường hợp token thay đổi
  (token, previousToken) => {
    console.log('Token đổi từ', previousToken, 'thành', token);
    axiosInstance.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
  }
);
// Nhớ unsubscribe() để tránh memory leak nếu dùng trong hook vòng đời.
```

**Ví dụ kinh điển - File Axios Interceptor:**
```typescript
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // Không bị vướng bận Component
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().actions.logout(); // Trục xuất tự động
    }
    return Promise.reject(error);
  }
);
```

---

## 6. Mẫu Slice (Chia nhỏ Store lớn)
App phức tạp thì không nên nhét vào 1 file 5000 dòng. Zustand cho phép gom mảnh (Slices).

```typescript
// src/store/slices/authSlice.ts
import { StateCreator } from 'zustand';

export interface AuthSlice {
  token: string | null;
  authActions: { login: (token: string) => void };
}

// Cấu trúc StateCreator nhận đủ type để biết các mảnh khác
export const createAuthSlice: StateCreator<AuthSlice & UISlice, [], [], AuthSlice> = (set, get) => ({
  token: null,
  authActions: {
    login: (token) => {
      set({ token });
      get().uiActions.showToast('Đăng nhập thành công'); // Cảnh cáo UI ở mảnh khác!
    },
  },
});

// src/store/useStore.ts - Hợp thể lại
import { create } from 'zustand';

export const useStore = create<AuthSlice & UISlice>()((...args) => ({
  ...createAuthSlice(...args),
  ...createUISlice(...args), // File khác
}));
```

---

## 7. Immer Middleware (Nested State đột biến nhàn hơn)
Zustand thuần ép bạn dùng Immutable (dấu `...`). Nếu object lồng quá sâu, code sẽ cực dơ và sai số.

```typescript
// KHÔNG CÓ IMMER (Spread địa ngục)
updateUserCity: (city: string) =>
  set((state) => ({
    user: {
      ...state.user,
      address: {
        ...state.user?.address,
        city,
      },
    },
  })),

// CÓ IMMER (Code như bình thường)
import { immer } from 'zustand/middleware/immer';

const useStore = create<State>()(
  immer((set) => ({
    user: { name: 'Bear', address: { city: 'HN', country: 'VN' } },

    updateUserCity: (city: string) =>
      set((state) => {
        // Biến state này là "Draft copy", cứ gán thoải mái, Immer tự tạo Object Clone mới.
        if (state.user) {
          state.user.address.city = city;
        }
      }),
  }))
);
```

---

## TỔNG KẾT MENTAL MODEL CẦN NHỚ
1. **`set` vs `get`:** `set` dùng để ghi đè. `get` dùng để đọc state **mới nhất** (rất cần sau khi dùng hàm await gọi API).
2. **Selector:** Lấy đúng trường cần thiết để không bị re-render láo. Bọc `useShallow` khi lấy Object hoặc Array.
3. **`partialize`:** Luôn nhớ filter khi dùng MMKV Persist (Tuyệt đối không lưu hàm actions, không lưu cờ `isHydrated` tạm thời).
4. **`getState()`:** Vũ khí tối thượng khi code Axios / Socket / Background Tasks.
5. **Immer:** Dành cho object lồng quá sâu từ 2 cấp trở lên.

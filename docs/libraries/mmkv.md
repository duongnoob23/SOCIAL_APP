# Toàn tập Hướng dẫn sử dụng react-native-mmkv

MMKV là giải pháp lưu trữ cục bộ (Local Storage) tối ưu và mạnh mẽ nhất hiện tại cho React Native. Nó thay thế hoàn toàn `AsyncStorage` vốn đã cũ, chậm và gây ra nhiều vấn đề về trải nghiệm người dùng (UX).

---

## 1. Bản chất cốt lõi: Vì sao lại nhanh đến vậy?
Khác với `AsyncStorage` sử dụng cầu nối JS Bridge (cũ và chậm), MMKV được đội ngũ WeChat viết bằng **C++** và kết nối thẳng vào môi trường React Native thông qua **JSI** (JavaScript Interface).

Nhờ cấu trúc kiến trúc này, MMKV đạt được hai thứ cực kỳ quan trọng:
1. **Tốc độ:** Nhanh hơn AsyncStorage khoảng 30 lần.
2. **Đồng bộ (Synchronous):** Đọc và ghi ngay lập tức trên cùng một luồng (thread), không cần phải đẩy sang luồng khác rồi dùng Promise (`await`) để chờ kết quả.

**Lợi ích triệt để:** Giải quyết dứt điểm lỗi **Flicker (chớp màn hình)**. 
- *Hệ lụy của AsyncStorage:* Mở app lên -> Cần lấy Token để biết đi tới màn nào -> Dùng `await` chờ mất vài chục mili-giây -> Trong lúc chờ, Token đang là `null` -> App lầm tưởng user chưa login -> Đá ra màn hình Login -> Chờ xong có Token -> App lại giật ngược đá vào màn hình Home.
- *Quyền năng của MMKV:* Mở app lên -> Đọc thẳng Token từ ổ cứng lên RAM trong **0.001ms** -> App biết ngay user đã login -> Vẽ thẳng màn hình Home mượt mà.

---

## 2. Cách khởi tạo Instance
Luôn tạo một (hoặc nhiều) file chứa instance riêng để quản lý, thay vì dùng chung chung. Điều này giúp dễ quản lý và bật tính năng mã hóa (encryption) khi cần.

```typescript
// src/lib/storage.ts
import { MMKV } from 'react-native-mmkv';

// Khởi tạo ổ đĩa mặc định
export const storage = new MMKV({
  id: 'social-app-storage',
  // encryptionKey: 'my-secret-key-123' // Thêm dòng này nếu muốn mã hóa toàn bộ file lưu trữ bằng AES
});
```

---

## 3. Các thao tác Đọc/Ghi cơ bản
Lưu ý quan trọng: Tuyệt đối **không dùng** `async` hay `await` với các hàm của MMKV. Code chạy từ trên xuống dưới mượt mà.

```typescript
import { storage } from '@/lib/storage';

// ---------------------------
// 1. GHI DỮ LIỆU (SET)
// ---------------------------
storage.set('user.name', 'Marc');
storage.set('user.age', 21);
storage.set('is-premium', true);

// Lưu Object/Array (Phải biến thành chuỗi JSON trước khi lưu)
const userProfile = { id: 1, role: 'admin' };
storage.set('user.profile', JSON.stringify(userProfile));

// ---------------------------
// 2. ĐỌC DỮ LIỆU (GET)
// ---------------------------
// Bắt buộc phải gọi đúng hàm tương ứng với kiểu dữ liệu
const username = storage.getString('user.name'); // 'Marc'
const age = storage.getNumber('user.age'); // 21
const isPremium = storage.getBoolean('is-premium'); // true

// Đọc Object/Array (Phải parse ngược lại)
const profileStr = storage.getString('user.profile');
const profile = profileStr ? JSON.parse(profileStr) : null;

// Kiểm tra xem key có tồn tại trong máy không
const hasName = storage.contains('user.name');

// ---------------------------
// 3. XÓA DỮ LIỆU (DELETE)
// ---------------------------
storage.delete('user.name');

// Xóa trắng toàn bộ dữ liệu (Dùng khi user nhấn nút Đăng Xuất)
storage.clearAll();
```

---

## 4. Tích hợp cực mạnh với Zustand (State Persistence)
Đây là Use-case quan trọng nhất của MMKV trong dự án: Trở thành "ổ cứng" để lưu lại các state quan trọng của Zustand (giúp dữ liệu trên RAM không bị bốc hơi khi tắt app).

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';

// 1. Tạo Adapter: Dịch ngôn ngữ của Zustand sang ngôn ngữ của MMKV
const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};

interface AuthState {
  token: string | null;
  actions: {
    setToken: (token: string) => void;
  }
}

// 2. Bọc store bằng middleware Persist
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      actions: {
        setToken: (token) => set({ token }),
      }
    }),
    {
      name: 'auth-storage', // Tên file lưu trên ổ cứng
      storage: createJSONStorage(() => zustandStorage), // Bọc Adapter vào đây
      
      // Quan trọng: Tách actions ra không cho lưu xuống đĩa
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

---

## 5. Dùng như Cache cho React Query (Advanced)
Ngoài việc đồng hành với Zustand, tính năng bá đạo thứ hai của MMKV là làm kho lưu trữ Cache cho API của `React Query`.

Sự kết hợp này giúp app có khả năng **Offline-first** cực kỳ mượt mà. User mở app ra khi không có kết nối mạng (wifi/4g) vẫn thấy được danh sách bài viết cũ hiển thị ngay lập tức không trễ một nhịp nào.

*(Phần này sẽ được hướng dẫn chi tiết ở file cấu hình React Query `src/lib/react-query.ts` của dự án).*

---

## 6. Lời khuyên & Best Practices
1. **Sự kiện thay đổi (Hook vs Store):** Thư viện có cung cấp hook `useMMKVString`, `useMMKVBoolean` để component tự động re-render khi dữ liệu trong MMKV đổi. **Tuy nhiên**, trong dự án lớn như Social App này, hãy **hạn chế dùng**. Thay vào đó, hãy đưa dữ liệu vào Zustand rồi nhờ Zustand lưu xuống MMKV. Kiến trúc sẽ quản lý tập trung (Single Source of Truth) và đồng nhất hơn rất nhiều.
2. **Lưu dữ liệu siêu nhạy cảm:** Nếu dữ liệu cực kỳ nhạy cảm và nguy hiểm (như Private Key, Token Ngân Hàng, Refresh Token cấp cao), hãy lưu bằng `Expo SecureStore` (nó ghi trực tiếp vào Keychain/Keystore của hệ điều hành), tốc độ sẽ chậm hơn nhưng bảo mật tuyệt đối. Dù vậy, với đại đa số dữ liệu, MMKV là đủ an toàn, nhất là khi đã bật `encryptionKey`.
3. **Kích thước file (Bottleneck):** Kiến trúc của MMKV là tải toàn bộ nội dung file vào RAM khi app khởi động. Vì thế, **tuyệt đối không dùng** MMKV để lưu các mảng dữ liệu khổng lồ vô tận (ví dụ: 100,000 tin nhắn chat log). Nếu cần lưu lượng data lớn và có cấu trúc quan hệ phức tạp, hãy sử dụng cơ sở dữ liệu thực thụ như `SQLite`.

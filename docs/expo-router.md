# 📡 Expo Router — Tài Liệu Cá Nhân

> Framework: **React Native + Expo SDK 52**  
> Ngôn ngữ: **TypeScript**  
> Mục tiêu: Đọc 5 phút là nhớ lại ngay — không cần vào docs gốc

---

## 🗺️ MỤC LỤC

1. [Expo Router là gì?](#1-expo-router-là-gì)
2. [Cấu trúc thư mục app/](#2-cấu-trúc-thư-mục-app)
3. [Route cơ bản — Static Routes](#3-route-cơ-bản--static-routes)
4. [Layout — _layout.tsx](#4-layout--_layouttsx)
5. [Tabs Navigation](#5-tabs-navigation)
6. [Stack Navigation](#6-stack-navigation)
7. [Dynamic Routes — Tham số URL](#7-dynamic-routes--tham-số-url)
8. [Nested Navigation — Lồng nhau](#8-nested-navigation--lồng-nhau)
9. [Modal Screen](#9-modal-screen)
10. [Trang đặc biệt: index, 404, loading](#10-trang-đặc-biệt-index-404-loading)
11. [Điều hướng bằng code — useRouter / Link](#11-điều-hướng-bằng-code--userouter--link)
12. [Lấy params — useLocalSearchParams](#12-lấy-params--uselocalsearchparams)
13. [Authentication Flow — Bảo vệ route](#13-authentication-flow--bảo-vệ-route)
14. [Bố cục dự án thực tế (timeshel-style)](#14-bố-cục-dự-án-thực-tế-timeshel-style)

---

## 1. Expo Router là gì?

**Expo Router** = điều hướng dựa trên **file system** (giống Next.js).

```
Tên file          →  URL / Màn hình
────────────────────────────────────
app/index.tsx     →  /         (màn hình Home)
app/login.tsx     →  /login
app/profile.tsx   →  /profile
```

> 💡 **Tại sao dùng?** Không cần khai báo route thủ công như React Navigation. Tạo file → route tự động có.

---

## 2. Cấu trúc thư mục app/

### Quy tắc đặt tên file

| Tên file / thư mục | Ý nghĩa |
|---|---|
| `index.tsx` | Màn hình mặc định của thư mục đó |
| `_layout.tsx` | Layout bọc ngoài các màn hình cùng cấp |
| `[id].tsx` | Dynamic route — nhận tham số |
| `[...slug].tsx` | Catch-all route — nhận nhiều segment |
| `(tabs)/` | Group — **không tạo segment URL**, chỉ để tổ chức |
| `+not-found.tsx` | Trang 404 |
| `+html.tsx` | Tuỳ chỉnh HTML shell (web only) |

### Ví dụ cấu trúc đầy đủ

```
app/
├── 📄 _layout.tsx          ← Root layout (bọc toàn bộ app)
├── 📄 index.tsx             ← Màn hình Intro / Splash  →  route: /
│
├── 📁 (auth)/               ← Group auth (URL vẫn là /login, không phải /auth/login)
│   ├── 📄 _layout.tsx
│   ├── 📄 login.tsx         →  route: /login
│   └── 📄 register.tsx      →  route: /register
│
├── 📁 (tabs)/               ← Group tab chính
│   ├── 📄 _layout.tsx       ← Cấu hình tab bar
│   ├── 📄 index.tsx         →  route: /   (tab Home)
│   ├── 📄 explore.tsx       →  route: /explore
│   └── 📄 profile.tsx       →  route: /profile
│
├── 📁 post/
│   ├── 📄 [id].tsx          →  route: /post/123
│   └── 📄 create.tsx        →  route: /post/create
│
└── 📄 +not-found.tsx        ← Trang 404
```

---

## 3. Route cơ bản — Static Routes

```tsx
// app/login.tsx
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <View>
      <Text>Màn hình Login</Text>
    </View>
  );
}
```

> Chỉ cần tạo file → tự động có route `/login`. Không cần đăng ký ở đâu cả.

---

## 4. Layout — _layout.tsx

`_layout.tsx` là **khung bọc ngoài**. Mọi màn hình cùng cấp đều chạy bên trong layout này.

### Root Layout (app/_layout.tsx) — BẮT BUỘC có

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Mỗi <Stack.Screen> tương ứng 1 file trong app/ */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

> 💡 **Tại sao cần?** Đây là nơi bạn đặt Provider (theme, auth, react-query...) để bọc toàn app.

### Kết hợp Provider vào Root Layout

```tsx
// app/_layout.tsx — thực tế
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
```

---

## 5. Tabs Navigation

### Cấu trúc

```
app/
├── 📄 _layout.tsx
└── 📁 (tabs)/
    ├── 📄 _layout.tsx    ← Cấu hình tab bar ở đây
    ├── 📄 index.tsx      ← Tab 1: Home
    ├── 📄 explore.tsx    ← Tab 2: Explore
    └── 📄 profile.tsx    ← Tab 3: Profile
```

### Code _layout.tsx trong (tabs)/

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"                   // ← tên file, không có .tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Ẩn 1 tab khỏi tab bar (nhưng vẫn là màn hình trong group)

```tsx
<Tabs.Screen
  name="settings"
  options={{
    href: null,   // ← ẩn tab, vẫn navigate được bằng router.push
  }}
/>
```

---

## 6. Stack Navigation

Stack = stack màn hình chồng lên nhau (push / pop).

### Tự cấu hình header từng màn hình

```tsx
// app/(tabs)/_layout.tsx hoặc bất kỳ _layout nào
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Trang Chủ',
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="post/[id]"
        options={{
          title: 'Chi Tiết Bài Viết',
          headerBackTitle: 'Quay lại',
        }}
      />
    </Stack>
  );
}
```

### Tuỳ chỉnh header trong từng Screen component

```tsx
// app/post/[id].tsx
import { Stack } from 'expo-router';

export default function PostDetail() {
  return (
    <>
      {/* Thay đổi header ngay trong component */}
      <Stack.Screen options={{ title: 'Bài viết #123', headerShown: true }} />

      <View>
        <Text>Nội dung bài viết</Text>
      </View>
    </>
  );
}
```

---

## 7. Dynamic Routes — Tham số URL

### Tạo dynamic route

```
app/post/[id].tsx     →   /post/123, /post/abc, /post/xyz
app/user/[username].tsx  →  /user/john, /user/alice
```

### Lấy giá trị tham số

```tsx
// app/post/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  //      ↑ tên phải trùng với tên trong ngoặc vuông [id]

  return <Text>Post ID: {id}</Text>;
}
```

### Catch-all route [...slug].tsx

```
app/docs/[...slug].tsx  →  /docs/a, /docs/a/b, /docs/a/b/c
```

```tsx
// app/docs/[...slug].tsx
import { useLocalSearchParams } from 'expo-router';

export default function DocsPage() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  // slug = ['a', 'b', 'c'] với URL /docs/a/b/c

  return <Text>{slug.join(' > ')}</Text>;
}
```

---

## 8. Nested Navigation — Lồng nhau

Dùng khi 1 tab có cả Stack navigation bên trong.

### Ví dụ: Tab Home có thêm màn hình Detail

```
app/
└── 📁 (tabs)/
    ├── 📄 _layout.tsx        ← Tab layout
    └── 📁 home/
        ├── 📄 _layout.tsx    ← Stack layout bên trong tab Home
        ├── 📄 index.tsx      →  Tab Home chính
        └── 📄 [postId].tsx   →  Màn hình detail, push từ Home
```

```tsx
// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[postId]" options={{ headerShown: true, title: 'Chi tiết' }} />
    </Stack>
  );
}
```

---

## 9. Modal Screen

Modal = màn hình nổi lên từ dưới, không thay thế màn hình hiện tại.

### Cách 1: Dùng presentation: 'modal' trong Stack.Screen

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="modal/create-post"
    options={{
      presentation: 'modal',   // ← hiệu ứng modal
      headerShown: false,
    }}
  />
</Stack>
```

```
app/
├── 📄 _layout.tsx
├── 📁 (tabs)/...
└── 📁 modal/
    └── 📄 create-post.tsx    ←  Màn hình modal
```

```tsx
// app/modal/create-post.tsx
import { router } from 'expo-router';

export default function CreatePost() {
  return (
    <View>
      <Text>Tạo bài viết mới</Text>
      <Button title="Đóng" onPress={() => router.back()} />
    </View>
  );
}
```

### Mở modal từ bất kỳ đâu

```tsx
router.push('/modal/create-post');
```

---

## 10. Trang đặc biệt: index, 404, loading

### index.tsx — Màn hình mặc định của thư mục

```
app/index.tsx          →  Route /   (gốc của app)
app/(tabs)/index.tsx   →  Tab Home mặc định
app/profile/index.tsx  →  Route /profile
```

> 💡 Nếu thư mục `profile/` có `index.tsx`, thì `/profile` trỏ đến đó. Nếu không có `index.tsx`, Expo Router báo lỗi.

### +not-found.tsx — Trang 404

```tsx
// app/+not-found.tsx
import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View>
        <Text>Trang này không tồn tại.</Text>
        <Link href="/">Về trang chủ</Link>
      </View>
    </>
  );
}
```

### Trang Intro / Splash — Đặt ở đâu?

```
app/index.tsx   ←  Đây là màn hình đầu tiên khi mở app
```

```tsx
// app/index.tsx — ví dụ màn hình Intro
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function IntroScreen() {
  useEffect(() => {
    // Tự động chuyển sang Home sau 3 giây
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Màn hình Giới Thiệu</Text>
    </View>
  );
}
```

> ⚠️ Dùng `router.replace` (không dùng `router.push`) để không thể bấm back về Intro.

---

## 11. Điều hướng bằng code — useRouter / Link

### useRouter hook

```tsx
import { router } from 'expo-router';
//  hoặc:
import { useRouter } from 'expo-router';
const router = useRouter();
```

| Method | Dùng khi nào |
|---|---|
| `router.push('/login')` | Chuyển màn, có thể back về |
| `router.replace('/home')` | Chuyển màn, **không** back về được |
| `router.back()` | Quay lại màn trước |
| `router.navigate('/profile')` | Thông minh hơn push — nếu route đang active thì không push thêm |
| `router.dismissAll()` | Đóng tất cả modal |

### Link component — dùng trong JSX

```tsx
import { Link } from 'expo-router';

// push (mặc định)
<Link href="/profile">Xem Profile</Link>

// replace
<Link href="/home" replace>Về Home</Link>

// truyền params
<Link href={{ pathname: '/post/[id]', params: { id: '123' } }}>
  Xem bài viết
</Link>
```

---

## 12. Lấy params — useLocalSearchParams

### Truyền params khi navigate

```tsx
// Cách 1: Truyền qua string URL
router.push('/post/123');

// Cách 2: Truyền qua object (TYPE SAFE hơn)
router.push({
  pathname: '/post/[id]',
  params: { id: '123' },
});

// Cách 3: Truyền query params (không cần trong tên file)
router.push({
  pathname: '/search',
  params: { keyword: 'react native', page: '1' },
});
// → URL: /search?keyword=react+native&page=1
```

### Nhận params

```tsx
// app/post/[id].tsx — nhận dynamic param [id]
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>Post: {id}</Text>;
}
```

```tsx
// app/search.tsx — nhận query params
import { useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
  const { keyword, page } = useLocalSearchParams<{
    keyword: string;
    page: string;
  }>();

  return <Text>Tìm "{keyword}" — Trang {page}</Text>;
}
```

> ⚠️ **Tất cả params đều là string!** Nếu cần number: `Number(id)`.

---

## 13. Authentication Flow — Bảo vệ route

### Pattern chuẩn: Redirect trong Root Layout

```tsx
// app/_layout.tsx
import { Stack, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';  // hook trả về { isLoggedIn }

export default function RootLayout() {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  //  segments = ['(tabs)', 'profile'] nếu đang ở /profile

  useEffect(() => {
    if (isLoading) return; // chờ check auth xong

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      // Chưa đăng nhập mà vào app → đá về login
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Đã đăng nhập mà vào trang login → đá về home
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
```

### Cấu trúc thư mục khi có Auth

```
app/
├── 📄 _layout.tsx          ← Root layout + auth guard
├── 📄 index.tsx            ← Splash/Intro
│
├── 📁 (auth)/              ← Chưa đăng nhập
│   ├── 📄 _layout.tsx
│   ├── 📄 login.tsx
│   └── 📄 register.tsx
│
└── 📁 (tabs)/              ← Đã đăng nhập
    ├── 📄 _layout.tsx
    ├── 📄 index.tsx        ← Home
    ├── 📄 explore.tsx
    └── 📄 profile.tsx
```

---

## 14. Bố cục dự án thực tế (timeshel-style)

Đây là bố cục đầy đủ cho app thực tế — dùng làm tham khảo khi bắt đầu dự án mới:

```
app/
├── 📄 _layout.tsx                    ← Root layout: Provider + Auth guard
├── 📄 index.tsx                      ← Intro / Splash screen
├── 📄 +not-found.tsx                 ← Trang 404
│
├── 📁 (auth)/                        ← Nhóm: chưa đăng nhập
│   ├── 📄 _layout.tsx                ← Stack layout, ẩn header
│   ├── 📄 login.tsx                  →  /login
│   ├── 📄 register.tsx               →  /register
│   └── 📄 forgot-password.tsx        →  /forgot-password
│
├── 📁 (tabs)/                        ← Nhóm: tab bar chính (đã đăng nhập)
│   ├── 📄 _layout.tsx                ← Cấu hình tab bar
│   │
│   ├── 📁 home/                      ← Tab 1: Home (có Stack bên trong)
│   │   ├── 📄 _layout.tsx            ← Stack cho Home tab
│   │   ├── 📄 index.tsx              →  /home
│   │   └── 📄 [postId].tsx           →  /home/123
│   │
│   ├── 📁 story/                     ← Tab 2: Story
│   │   ├── 📄 _layout.tsx
│   │   ├── 📄 index.tsx              →  /story
│   │   └── 📄 history.tsx            →  /story/history
│   │
│   ├── 📄 explore.tsx                →  /explore (tab đơn giản, không có sub-screen)
│   └── 📄 profile.tsx                →  /profile
│
├── 📁 modal/                         ← Màn hình modal (hiện lên từ bất kỳ tab nào)
│   ├── 📄 create-post.tsx            →  /modal/create-post
│   └── 📄 image-picker.tsx           →  /modal/image-picker
│
└── 📁 payment/                       ← Màn hình ngoài tab (full screen)
    ├── 📄 index.tsx                  →  /payment
    └── 📄 success.tsx                →  /payment/success
```

### Phân loại theo tính năng — nơi đặt từng loại màn hình

| Loại màn hình | Đặt ở đâu | Ghi chú |
|---|---|---|
| Splash / Intro | `app/index.tsx` | Màn hình đầu tiên khi mở app |
| Login / Register | `app/(auth)/` | Chưa đăng nhập |
| Tab chính | `app/(tabs)/` | Mọi màn hình có tab bar |
| Sub-screen trong tab | `app/(tabs)/home/[id].tsx` | Stack trong tab |
| Modal | `app/modal/` hoặc root Stack | `presentation: 'modal'` |
| Full-screen ngoài tab | `app/payment/` | Không có tab bar |
| Trang 404 | `app/+not-found.tsx` | Tự động |

---

## ⚡ Cheat Sheet Nhanh

```tsx
// Điều hướng
router.push('/login')                    // Push, có back
router.replace('/home')                  // Replace, không back
router.back()                            // Quay lại
router.push({ pathname: '/post/[id]', params: { id: '1' } })

// Lấy params
const { id } = useLocalSearchParams<{ id: string }>();

// Biết đang ở segment nào
const segments = useSegments();          // ['(tabs)', 'home']
const pathname = usePathname();          // '/home'

// Link trong JSX
<Link href="/profile">Profile</Link>
<Link href={{ pathname: '/post/[id]', params: { id: '1' } }}>Post</Link>
```

---

> ✍️ **Ghi chú cá nhân:**  
> Thêm ghi chú của bạn vào đây sau mỗi lần học.  
> Ví dụ: "2026-03-05 — Hiểu được auth guard rồi, cần luyện thêm nested navigation"

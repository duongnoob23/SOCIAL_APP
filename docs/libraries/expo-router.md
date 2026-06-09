STEP-01

# Expo Router — File-based Routing: Toàn tập kiến thức

## Chúng ta vừa làm gì?

Thiết lập cấu trúc thư mục `app/` theo đúng quy tắc của Expo Router để:

1. App điều hướng đúng luồng: `_layout.tsx` → `index.tsx` → `auth/sign-in` hoặc `story/main-story`
2. Hiểu rõ khi nào cần `_layout.tsx`, khi nào cần `index.tsx`, khi nào không cần
3. Tránh các lỗi phổ biến như "missing default export", route không nhận ra

---

## 1. Cơ chế hoạt động cốt lõi — File = Route

Expo Router dùng **file-based routing**: mỗi file trong thư mục `app/` tự động trở thành một route, không cần khai báo thủ công như React Navigation.

```
app/
├── index.tsx          →  route "/"
├── about.tsx          →  route "/about"
├── auth/
│   ├── sign-in.tsx    →  route "/auth/sign-in"
│   └── sign-up.tsx    →  route "/auth/sign-up"
└── story/
    └── main-story.tsx →  route "/story/main-story"
```

Khi bạn gọi `router.replace("/auth/sign-in")`, Expo Router tìm file `app/auth/sign-in.tsx` và render nó. Đơn giản vậy thôi.

---

## 2. `_layout.tsx` — File đặc biệt số 1

### Nó là gì?

`_layout.tsx` là file **wrapper** — nó bọc quanh tất cả các route cùng cấp hoặc con cháu của nó. Bạn render `<Stack>`, `<Tabs>`, hoặc `<Drawer>` bên trong đây để định nghĩa kiểu điều hướng.

### Khi nào BẮT BUỘC phải có?

| Tình huống                              | Có cần \_layout.tsx?              |
| --------------------------------------- | --------------------------------- |
| Thư mục `app/` gốc                      | **Bắt buộc** — đây là Root Layout |
| Folder có nhiều màn hình cần Stack/Tabs | **Bắt buộc**                      |
| Folder là route group `(name)/`         | **Bắt buộc**                      |
| Folder chỉ có 1 file đơn lẻ             | Không cần                         |

### Khi không có `_layout.tsx` thì sao?

Expo Router tự dùng một layout mặc định (Stack đơn giản). Vẫn chạy được, nhưng bạn không kiểm soát được animation, header, hay thứ tự màn hình.

### Ví dụ — Root Layout (bắt buộc)

```tsx
// app/_layout.tsx — ngoài cùng tuyệt đối
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

### Ví dụ — Auth Layout (bọc nhóm màn hình login)

```tsx
// app/auth/_layout.tsx — chỉ bọc các màn auth
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
```

---

## 3. `index.tsx` — File đặc biệt số 2

### Nó là gì?

`index.tsx` là **trang mặc định** của một thư mục. Khi bạn điều hướng đến một thư mục mà không chỉ định tên file cụ thể, Expo Router sẽ tự tìm `index.tsx` trong thư mục đó.

```
/          →  app/index.tsx
/auth      →  app/auth/index.tsx    (nếu có)
/story     →  app/story/index.tsx   (nếu có)
```

### Khi nào CẦN `index.tsx`?

| Tình huống                                            | Cần index.tsx?                  |
| ----------------------------------------------------- | ------------------------------- |
| Folder gốc `app/`                                     | **Bắt buộc** — điểm vào của app |
| Folder mà bạn sẽ navigate đến bằng tên folder         | Cần                             |
| Folder chỉ được navigate đến bằng tên file con cụ thể | Không cần                       |

### Ví dụ thực tế:

```
// Nếu bạn gọi router.replace("/auth")
→ Expo Router tìm app/auth/index.tsx

// Nếu bạn gọi router.replace("/auth/sign-in")
→ Expo Router tìm app/auth/sign-in.tsx
→ app/auth/index.tsx KHÔNG cần thiết
```

**Trong dự án này:** Bạn điều hướng thẳng đến `ROUTES.SIGN_IN = "/auth/sign-in"`, không điều hướng đến `/auth` chung chung. Vì vậy `app/auth/index.tsx` không thực sự cần thiết — nhưng nếu Expo Router gặp thư mục `auth/` mà không có file index, đôi khi nó sẽ báo warning.

---

## 4. Route Groups `(name)/` — Nhóm route ẩn

### Tại sao cần Route Groups?

Route Groups cho phép bạn **tổ chức file theo nhóm logic mà không ảnh hưởng đến URL**. Tên trong ngoặc `()` bị ẩn khỏi URL.

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── sign-in.tsx   →  route "/sign-in" (không phải "/auth/sign-in")
│   └── sign-up.tsx   →  route "/sign-up"
└── (main)/
    ├── _layout.tsx
    └── home.tsx      →  route "/home"
```

### Dùng khi nào?

- Khi muốn chia nhóm màn hình để có layout khác nhau (auth group vs main group) nhưng không muốn tên nhóm xuất hiện trong URL
- Khi muốn share một `_layout.tsx` chung cho một nhóm màn hình liên quan

```
// Không dùng Route Group:
/auth/sign-in    ← URL có "auth"
/main/home       ← URL có "main"

// Dùng Route Group:
/sign-in         ← URL sạch hơn
/home            ← URL sạch hơn
```

### Ví dụ trong dự án này:

```
app/
├── (auth)/         ← Group: màn hình trước khi login
│   ├── _layout.tsx ← Stack riêng cho luồng auth
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── (main)/         ← Group: màn hình sau khi login
    ├── _layout.tsx ← Tabs hoặc Stack riêng cho main app
    └── story/
        └── main-story.tsx
```

---

## 5. Luồng app khởi động — Giải thích từng bước

```
1. App mở
        │
2. app/_layout.tsx mount
        │  ← Khởi tạo tất cả Provider (QueryClient, SafeArea, Theme...)
        │  ← Load fonts
        │  ← Render <Stack> với danh sách màn hình cho phép
        │
3. app/index.tsx mount (màn hình đầu tiên trong Stack)
        │  ← Không render gì cả (return null)
        │  ← Chỉ kiểm tra điều kiện và điều hướng
        │
        ├── isHydrated = false? → chờ MMKV load xong
        │
        ├── navigationState.key null? → chờ navigator sẵn sàng
        │
        └── Điều hướng
                ├── token có → router.replace("/story/main-story")
                └── token null → router.replace("/auth/sign-in")

4. Màn hình đích mount
        │
        ├── /auth/sign-in
        │       └── app/auth/_layout.tsx (nếu có) bọc quanh màn hình
        │           app/auth/sign-in.tsx render form login
        │
        └── /story/main-story
                └── app/story/_layout.tsx (nếu có) bọc quanh màn hình
                    app/story/main-story.tsx render danh sách story
```

---

## 6. Các lỗi phổ biến và cách fix

### Lỗi: "Route missing required default export"

**Nguyên nhân 1:** File không có `export default`

```tsx
// ❌ Sai
function SignIn() {
  return <View />;
}
// Quên export default

// ✅ Đúng
export default function SignIn() {
  return <View />;
}
```

**Nguyên nhân 2:** File bị crash khi load (import lỗi, native module chưa rebuild)

```
File crash → không load xong → Expo Router báo "missing default export"
```

Đây là lỗi misleading — thực ra không phải thiếu export, mà là file không chạy được.

**Nguyên nhân 3:** File hoàn toàn trống (0 bytes)

```tsx
// app/auth/index.tsx — trống hoàn toàn
// → Expo Router báo lỗi
```

### Lỗi: Native module crash (MMKV, Skia...)

```
TypeError: Cannot read property 'prototype' of undefined
```

**Nguyên nhân:** Dùng thư viện cần native code (MMKV, react-native-skia...) với Expo Go. Expo Go không có native code của các thư viện bên thứ 3.

**Fix:** Build Expo Dev Client:

```bash
yarn android   # hoặc
yarn ios
```

### Lỗi: "Unmatched Route"

```
Unmatched Route: No route named "/auth/sign-in"
```

**Nguyên nhân:** Tên route trong code khác tên file thực tế.

```
File:  app/auth/sign-in.tsx   →  route "/auth/sign-in"
Code:  router.replace("/auth/signIn")  ← sai, camelCase không được nhận
```

---

## 7. Cấu trúc thư mục chuẩn cho dự án Social App

```
app/
├── _layout.tsx              ← Root layout: providers, fonts
├── index.tsx                ← Điều phối auth: chờ hydration → điều hướng
│
├── (auth)/                  ← Group: luồng xác thực
│   ├── _layout.tsx          ← Stack của luồng auth
│   ├── sign-in.tsx          ← /sign-in
│   └── sign-up.tsx          ← /sign-up
│
├── (main)/                  ← Group: app chính sau khi login
│   ├── _layout.tsx          ← Tabs hoặc Drawer của main app
│   └── story/
│       ├── _layout.tsx      ← Stack của story feature
│       ├── index.tsx        ← /story (trang chính)
│       └── [id].tsx         ← /story/123 (dynamic route)
│
└── onboarding/              ← Không phải group vì URL cần có "onboarding"
    ├── _layout.tsx
    ├── intro-screen.tsx     ← /onboarding/intro-screen
    └── get-started.tsx      ← /onboarding/get-started
```

### Quy tắc đặt tên file

| Pattern          | Ý nghĩa                   | Ví dụ                                 |
| ---------------- | ------------------------- | ------------------------------------- |
| `name.tsx`       | Route tĩnh                | `sign-in.tsx` → `/sign-in`            |
| `[id].tsx`       | Dynamic route             | `[id].tsx` → `/123`, `/abc`           |
| `[...slug].tsx`  | Catch-all route           | `[...slug].tsx` → `/a/b/c`            |
| `_layout.tsx`    | Layout wrapper            | Không có URL, chỉ bọc                 |
| `index.tsx`      | Route mặc định của folder | `auth/index.tsx` → `/auth`            |
| `+not-found.tsx` | 404 fallback              | Bắt tất cả route không khớp           |
| `(name)/`        | Route group (ẩn URL)      | `(auth)/` → không xuất hiện trong URL |

---

## 8. FAQ — Câu hỏi thường gặp

### Mỗi folder có bắt buộc phải có cả `_layout.tsx` lẫn `index.tsx` không?

**Không.** Chỉ cần khi:

- `_layout.tsx`: Khi muốn kiểm soát kiểu điều hướng (Stack, Tabs, Drawer) hoặc share UI (header, tab bar) giữa các màn hình trong folder đó.
- `index.tsx`: Khi bạn navigate đến folder bằng tên folder chứ không phải tên file cụ thể.

### Route Group `(name)` khác gì với folder thường `name`?

```
Folder thường:  app/auth/sign-in.tsx  →  URL: /auth/sign-in
Route Group:    app/(auth)/sign-in.tsx →  URL: /sign-in   ← tên "(auth)" bị ẩn
```

Dùng Route Group khi bạn muốn nhóm logic nhưng không muốn tên nhóm xuất hiện trong URL.

### Tôi có nên dùng `<Redirect>` hay `useRouter` để điều hướng từ index.tsx?

Dùng `useRouter` trong `useEffect`. Lý do:

```
<Redirect>  →  điều hướng TRONG render  →  navigator có thể chưa sẵn sàng
useRouter   →  điều hướng SAU render    →  navigator đã sẵn sàng
```

`index.tsx` là màn hình đầu tiên app tải lên — navigator chưa ổn định ở giai đoạn này nên dùng `<Redirect>` sẽ đôi khi bị lỗi silent.

### Dynamic route `[id].tsx` dùng như thế nào?

```tsx
// app/story/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function StoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Khi navigate đến /story/123 → id = "123"
}

// Cách navigate đến dynamic route:
router.push("/story/123");
router.push(`/story/${storyId}`);
```

### Nested layout hoạt động như thế nào?

Layout được stack lên nhau từ ngoài vào trong. Mỗi màn hình nhận layout của tất cả các cấp trên nó.

```
app/_layout.tsx          ← RootLayout bọc toàn bộ
  app/(main)/_layout.tsx ← MainLayout bọc màn hình main
    app/(main)/story/_layout.tsx ← StoryLayout bọc màn hình story
      app/(main)/story/main-story.tsx ← Màn hình thực sự render
```

Khi `main-story.tsx` render, nó được bọc bởi 3 layer layout từ trong ra ngoài.

### Làm thế nào để chia sẻ header giữa các màn hình?

Dùng `_layout.tsx` của nhóm đó để định nghĩa header chung:

```tsx
// app/story/_layout.tsx
export default function StoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Stories" }} />
      <Stack.Screen name="[id]" options={{ title: "Detail" }} />
    </Stack>
  );
}
```

### Tại sao `+not-found.tsx` có dấu `+` phía trước?

Dấu `+` là ký hiệu đặc biệt của Expo Router cho các file có vai trò đặc biệt. `+not-found.tsx` bắt tất cả các URL không khớp với bất kỳ route nào, tương đương trang 404.

---

## 9. Checklist cấu trúc thư mục

### Bắt buộc phải có

- [ ] `app/_layout.tsx` — Root layout với tất cả Provider
- [ ] `app/index.tsx` — Điểm vào, điều phối auth flow
- [ ] `app/+not-found.tsx` — Bắt route không tồn tại

### Cần có nếu dùng Group

- [ ] `app/(auth)/_layout.tsx` — nếu dùng `(auth)` group
- [ ] `app/(main)/_layout.tsx` — nếu dùng `(main)` group

### Kiểm tra trước khi chạy

- [ ] Mọi file trong `app/` phải có `export default function`
- [ ] File không được trống (0 bytes)
- [ ] Tên file dùng kebab-case (`sign-in.tsx`, không phải `signIn.tsx`)
- [ ] Dynamic route dùng đúng cú pháp: `[id].tsx`, không phải `:id.tsx`
- [ ] Native modules (MMKV, Skia) phải dùng Expo Dev Client, không phải Expo Go

---

## 10. Pattern thực tế — `_layout.tsx` tối giản (hay dùng nhất)

### App không có Bottom Tabs (như Timeshel)

Khi app điều hướng bằng side menu hoặc Stack thuần, không có Bottom Tabs, không cần Route Group `(name)/`. Mỗi folder chỉ cần một `_layout.tsx` tối giản:

```tsx
// app/onboarding/_layout.tsx — minimal, đủ dùng
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

Expo Router tự động nhận ra tất cả `.tsx` trong folder mà không cần liệt kê từng `<Stack.Screen>`.

### Khi nào CẦN khai báo `<Stack.Screen>` tường minh?

Chỉ khai báo khi muốn custom riêng cho từng màn hình cụ thể:

```tsx
// ✅ Chỉ cần khi muốn custom
export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Chỉ màn hình này dùng animation khác */}
      <Stack.Screen
        name="select-print"
        options={{ animation: "slide_from_bottom" }}
      />
      {/* Các màn hình khác không cần khai báo — tự nhận diện */}
    </Stack>
  );
}
```

### Khi KHÔNG có `_layout.tsx` thì sao?

Expo Router dùng layout mặc định — vẫn chạy được nhưng:

- Không kiểm soát được header (mặc định hiển thị)
- Không chỉnh được animation transition
- Không share được state/context giữa các màn hình trong folder

### Cấu trúc Timeshel (không có Bottom Tabs)

```
app/
├── _layout.tsx            ← Root: providers, font
├── index.tsx              ← Điều phối auth
├── auth/
│   ├── _layout.tsx        ← Stack cho luồng auth
│   ├── sign-in.tsx
│   └── create-account.tsx
├── story/
│   ├── _layout.tsx        ← Stack cho luồng story
│   ├── main-story.tsx
│   └── add-moments.tsx
└── onboarding/
    ├── _layout.tsx        ← Stack cho luồng onboarding
    ├── get-started.tsx
    └── select-print.tsx
```

Mỗi folder có `_layout.tsx` chứa `<Stack>` — đây là pattern chuẩn cho app không có Tabs. Không cần Route Group, không cần `index.tsx` trong từng folder con (trừ khi navigate đến folder bằng tên folder).

# 🗺️ BẢN ĐỒ KIẾN TRÚC & PHÁT TRIỂN LẠI TIMESHEL (MASTER ROADMAP)

*Đây là tài liệu tối cao (Master Document) hướng dẫn từng bước đập đi xây lại toàn bộ codebase của Timeshel. Mọi file, thư mục và logic từ hệ thống cũ (`d:\timeshel\src`) đã được mổ xẻ và sắp xếp lại theo **Engineering Doctrine chuẩn mực**.*

---

## 📚 MỤC LỤC CHI TIẾT
1. [PHASE 1: ENGINEERING FOUNDATION (Nền móng)](#1-phase-1-engineering-foundation)
2. [PHASE 2: AUTH, ONBOARDING & USER IDENTITY (Định danh)](#2-phase-2-auth-onboarding--user-identity)
3. [PHASE 3: CORE DOMAIN - STORY & MOMENTS (Lõi ứng dụng)](#3-phase-3-core-domain---story--moments)
4. [PHASE 4: THE SKIA LAYER - IMAGE PROCESSING & PREVIEW (Xử lý ảnh)](#4-phase-4-the-skia-layer---image-processing--print-preview)
5. [PHASE 5: THE UPLOAD ENGINE & BACKGROUND SYNC (Đồng bộ ngầm)](#5-phase-5-the-upload-engine--background-sync)
6. [PHASE 6: PAYMENT, ORDERS & BILLING (Thanh toán & Đơn hàng)](#6-phase-6-payment-orders--billing)
7. [PHASE 7: ENGAGEMENT, CRM & NOTIFICATIONS (Tương tác)](#7-phase-7-engagement-crm--notifications)
8. [PHASE 8: POLISH, SETTINGS & RELEASE (Hoàn thiện)](#8-phase-8-polish-settings--release)

---

## 1. 🏗️ PHASE 1: ENGINEERING FOUNDATION
*(Chuyển hóa hoàn toàn kiến trúc từ Layer-based sang Feature-based strict boundaries)*

### 1.1. Doctrine & Rules (Bắt buộc phải define trước khi code)
- [ ] 📜 `docs/decisions/001-engineering-principles.md` (Triết lý lập trình)
- [ ] 📜 `docs/decisions/002-feature-architecture.md` (Cấu trúc Folder Feature)
- [ ] 📜 `docs/decisions/003-dependency-rules.md` (Luật Cấm import chéo giữa các features)
- [ ] 📜 `docs/decisions/004-state-doctrine.md` (Ranh giới Zustand vs React Query)
- [ ] 📜 `docs/decisions/005-component-doctrine.md` (Smart/Dumb components)
- [ ] 📜 `docs/decisions/006-performance-rules.md` (Rules cho FlatList, Image Cache, Re-renders)
- [ ] 📜 `docs/decisions/007-error-handling.md` (Cách ném lỗi, bắt lỗi tập trung ở Interceptor)
- [ ] 📜 `docs/decisions/008-design-system.md` (Tokens, Spacing, Typography)
- [ ] 📜 `docs/decisions/009-async-flow-doctrine.md` (Optimistic Update, Loading ownership)
- [ ] 📜 `docs/decisions/010-api-contract-doctrine.md` (Quy ước DTO, Zod parsing)
- [ ] 📜 `docs/decisions/011-styling-doctrine.md` (NativeWind/StyleSheet)
- [ ] 📜 `docs/decisions/012-feature-development-guide.md` (Vòng đời tạo Feature mới)

### 1.2. Kỹ thuật Lõi (Technical Setup)
- [ ] ⚙️ **Expo Router:** Setup Root Layout `app/_layout.tsx` và cấu hình deeplink.
- [ ] ⚙️ **Storage:** Khởi tạo `react-native-mmkv` thay thế hoàn toàn AsyncStorage cũ (`__mocks__/@react-native-async-storage`).
- [ ] ⚙️ **API Client:** Tạo `lib/axios.ts` với Interceptors xử lý 401 & đính token.
- [ ] ⚙️ **React Query:** Tạo `lib/react-query.ts` với default staleTime, gcTime.
- [ ] ⚙️ **Zustand:** Cấu hình store cơ bản với tính năng Persist.
- [ ] ⚙️ **UI Core:** Setup `GestureHandlerRootView`, `SafeAreaProvider`, `BottomSheetModalProvider`.
- [ ] ⚙️ **I18n:** Migrate hệ thống dịch vụ ngôn ngữ (`i18n/en/*.ts`).

---

## 2. 🔐 PHASE 2: AUTH, ONBOARDING & USER IDENTITY
*(Trọng tâm: Xây dựng cổng vào vững chắc, dứt điểm nợ kỹ thuật liên quan đến Auth State)*

### 2.1. Feature: `auth` (Thay thế `d:\timeshel\src\features\auth`)
- **API Layer (`features/auth/api`)**:
  - [ ] `postLogin`, `postRegister`, `postSocialLogin` (Google, Apple, Facebook).
  - [ ] `postResetPassword`, `postVerifyEmail`.
- **State (`features/auth/store`)**:
  - [ ] `useAuthStore` (Chỉ lưu Token, Session info cơ bản).
- **Hooks (`features/auth/hooks`)**:
  - [ ] `useAuthGuard` (Protect router - nếu chưa login đẩy ra màn Intro).
  - [ ] `useGoogleSignIn`, `useAppleSignIn`.
- **UI Components & Screens (`app/(auth)` & `features/auth/components`)**:
  - [ ] Tái tạo `SignInForm`, `SignUpForm`.
  - [ ] Tái tạo `ForgotPassword`, `ResetPassword`.
  - [ ] Tích hợp Zod + React Hook Form cho tất cả input.

### 2.2. Feature: `onboarding` & `introduction`
- **Logic**:
  - [ ] Xác định cờ `firstInstall` (lấy từ MMKV) để show Introduction.
- **UI**:
  - [ ] Tái tạo luồng Swiper giới thiệu App (`features/introduction`).
  - [ ] Màn hình xin quyền Notification (`features/onboarding`).
  - [ ] Màn hình xin quyền Photo Library / Tracking Transparency.

---

## 3. 🖼️ PHASE 3: CORE DOMAIN - STORY & MOMENTS
*(Trái tim của ứng dụng: Quản lý tháng, năm, và các hình ảnh được nạp vào)*

### 3.1. Feature: `story` (Lịch sử câu chuyện - `features/story`)
- **API Contracts**:
  - [ ] `indexStoryByYear`, `indexStoryCurrentYear`, `indexStoryByAllYear`.
  - [ ] `createPastMonth`, `submitPastMonth`, `syncStory`.
  - [ ] `skipStory`, `forceSubmit`.
- **Hooks & State**:
  - [ ] `useIndexStoryByYear.ts` (React Query - server state).
  - [ ] `useSyncStory.ts` (Xử lý logic đồng bộ).
  - [ ] `optimisticStoryCache.ts` (Tuyệt đối không đợi API, update UI ngay khi user hành động).
- **UI Components**:
  - [ ] `StoryList.tsx`, `StoryItemYearView.tsx`.
  - [ ] `MonthUploadProgress.tsx` (Hiển thị tiến trình upload).
  - [ ] `FloatingStoryButton.tsx`.

### 3.2. Feature: `moments` & `gallery` (Quản lý hình ảnh gốc)
- **Thiết kế**: Tách biệt hoàn toàn hình đã xử lý (Story) và hình gốc (Gallery/Albums).
- **API**:
  - [ ] `uploadMomentImage.ts` (Liên kết với Upload Engine ở Phase 5).
  - [ ] Liên kết API `GooglePhotosService.ts` và `useInstagram.ts` để kéo ảnh từ MXH.
- **UI Components**:
  - [ ] `SelectPhotosHeader.tsx`.
  - [ ] `RenderAlbumItem.tsx`, `RenderMediaItem.tsx` (Bắt buộc dùng `@shopify/flash-list` để mượt mà khi cuộn 1000+ ảnh).
  - [ ] Tái tạo `ListMediaSkeleton.tsx`.

---

## 4. 🎨 PHASE 4: THE SKIA LAYER - IMAGE PROCESSING & PREVIEW
*(Xử lý ma trận ảnh và Canvas - phần nặng kỹ thuật nhất của hệ thống cũ)*

### 4.1. Feature: `print-preview` (`features/print-preview`)
- **Kiến trúc Skia & OpenCV**:
  - [ ] Tích hợp `@shopify/react-native-skia` và `react-native-fast-opencv`.
  - [ ] Xây dựng lại hệ thống Render Ảnh chất lượng cao bằng WebAssembly (Canvaskit) cho Web và Native.
- **Image Filters & Matrix (`Layer/`)**:
  - [ ] `BrightnessMatrix.tsx` (Chỉnh sáng).
  - [ ] `ContrastMatrixLayer.tsx` (Chỉnh tương phản).
  - [ ] `SaturationMatrixLayer.tsx` (Chỉnh độ bão hòa).
  - [ ] `TemperatureMatrixLayer.tsx` (Chỉnh nhiệt độ màu).
  - [ ] `SharpnessLayer.tsx` (Chỉnh độ sắc nét).
- **Công cụ Crop & Chỉnh Sửa (`preview/`)**:
  - [ ] Tái tạo `AspectRatioSelector.tsx` (1:1, 4:3, 16:9...).
  - [ ] Tái tạo `CropImageContainer.tsx` và `CropOverlay.tsx` bằng Reanimated 3 để đảm bảo 60fps khi vuốt crop ảnh.
- **In ấn & Chọn Bản Sao**:
  - [ ] Tái tạo logic `numberOfCopies.ts` và `CopiesSelectedView.tsx` (Chọn in bao nhiêu tấm).

---

## 5. 🚀 PHASE 5: THE UPLOAD ENGINE & BACKGROUND SYNC
*(Hệ thống đồng bộ ngầm siêu việt: Đảm bảo user thoát app vẫn upload được ảnh)*

### 5.1. Feature: `upload` (`services/upload` & `store/upload-store.ts`)
- **Kiến trúc Engine**:
  - [ ] Tái cấu trúc `uploadEngine.ts` và `uploadQueue.ts`.
  - [ ] Sử dụng `react-native-background-actions` để duy trì tiến trình upload khi app bị ẩn (Background Sync).
  - [ ] Viết lại `SyncQueueManager.ts` dùng MMKV + Zustand để lưu trạng thái queue (chống mất data khi crash).
- **Image Processing Trước Khi Upload**:
  - [ ] Tái tạo `imageProcessor.ts` kết hợp `@bam.tech/react-native-image-resizer` (Giảm dung lượng trước khi đẩy lên S3).
  - [ ] Xử lý EXIF metadata bằng `piexifjs` để giữ nguyên thông tin ngày chụp/tọa độ.
- **Hệ thống AWS S3**:
  - [ ] Tái tạo `s3UploaderV2.ts` kết nối với `@aws-sdk/client-s3`.
  - [ ] Xử lý Multipart Upload cho các video/ảnh quá lớn.

---

## 6. 💳 PHASE 6: PAYMENT, ORDERS & BILLING
*(Tiền nong & Đơn hàng - Yêu cầu độ chính xác 100%)*

### 6.1. Feature: `payment` & `billing` (`features/payment`, `features/billing`)
- **Tích hợp Cổng Thanh Toán (Stripe)**:
  - [ ] Cài đặt `@stripe/stripe-react-native`.
  - [ ] Tái tạo các hooks: `useGooglePay.ts`, `useSaveCard.ts`, `useGetPaymentMethods.ts`.
  - [ ] Xây dựng form nhập thẻ an toàn (PCI Compliance).
- **Logic Giỏ hàng & Thanh toán**:
  - [ ] Xây dựng luồng `SignUpPayment` (Thu tiền ngay khi đăng ký).
  - [ ] Quản lý trạng thái Payment Intent (Intent state machine).
- **Feature: `orders` & `gift`**:
  - [ ] Tính năng mua Gift Code (`useGiftTimeshel.ts`).
  - [ ] Quản lý tiến trình đơn hàng (Đã in, Đang giao, Đã nhận).
  - [ ] Nhập thông tin Delivery Address (`useGetDeliveryAddress.ts`).

---

## 7. 🔔 PHASE 7: ENGAGEMENT, CRM & NOTIFICATIONS
*(Giữ chân người dùng - Notifications & Analytics)*

### 7.1. Feature: `notifications` (`managers/NotificationManager.ts`)
- **Push Notification (Firebase/APNs)**:
  - [ ] Setup `@react-native-firebase/messaging` và `@notifee/react-native` (để show local push đẹp hơn).
  - [ ] Xin quyền push notification đúng thời điểm (Contextual permission request).
  - [ ] Xử lý logic Deeplink khi user bấm vào Push Notification.
- **CRM & Email Marketing**:
  - [ ] Tích hợp `customerio-reactnative` (`lib/customerIO.ts`).
  - [ ] Gửi event để kích hoạt luồng email nhắc nhở (Abandon Cart, Missing Moments).

### 7.2. Analytics & Tracking
- **Facebook & Meta**:
  - [ ] Tích hợp `react-native-fbsdk-next`. Track `InitiateCheckout`, `Subscribe`.
- **Crash & Perf Monitoring**:
  - [ ] Tích hợp Embrace (`@embrace-io/react-native`) theo đúng cấu trúc cũ (`utils/embrace.ts`).

---

## 8. 🛠️ PHASE 8: POLISH, SETTINGS & RELEASE
*(Các tính năng hỗ trợ, dọn dẹp và đóng gói ứng dụng)*

### 8.1. Feature: `admin` & `contact`
- [ ] Xây dựng `useAdminDataSync.ts` (Tool cho admin ẩn).
- [ ] Tính năng Contact Us (Gửi email support).
- [ ] Tính năng Refer a Friend (Chia sẻ mã giới thiệu).
- [ ] Màn hình Cài đặt (Đổi mật khẩu, Quản lý nhắc nhở, Thông tin cá nhân).

### 8.2. Release Engineering
- [ ] Cấu hình Webpack / Metro cho việc build phiên bản Web (`web-streams-polyfill`, `canvaskit-wasm`).
- [ ] Chạy kiểm thử tự động (Jest, Unit Tests cho các file utils quan trọng).
- [ ] Build & Deploy bằng Expo EAS (Tạo profile Development, Preview, Production).

---
*(Tài liệu này sẽ liên tục được đánh dấu `[x]` khi dự án tiến triển. Hãy bắt đầu từ việc setup các file Doctrine ở Phase 1.1!)*

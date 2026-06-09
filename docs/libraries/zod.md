# Toàn tập Hướng dẫn sử dụng Zod

## PHẦN 1 — Bối cảnh & Lý do tồn tại

### Bài toán Zod giải quyết

Trong TypeScript, khi bạn nhận dữ liệu từ bên ngoài (API response, form input, localStorage...), TypeScript **không thể** kiểm tra kiểu dữ liệu lúc runtime — nó chỉ kiểm tra lúc compile time. Nghĩa là:

```typescript
// TypeScript vui vẻ compile thành công
interface User {
  id: number;
  email: string;
}

// Nhưng runtime, API có thể trả về:
// { id: "abc", email: null }  ← TypeScript không biết
// { email: "test@gmail.com" } ← Thiếu field id, TypeScript không hay
```

Zod giải quyết bằng cách **validate dữ liệu lúc runtime** và đồng thời **tự động sinh ra TypeScript types** từ schema đó.

### So sánh với các giải pháp khác

| Thư viện | TypeScript type tự sinh | Runtime validate | Bundle size | Học dễ? |
|----------|------------------------|------------------|-------------|---------|
| **Zod (Được chọn)** | ✅ Tự động | ✅ Có | ~13kB | Dễ |
| Yup | ❌ Phải viết tay | ✅ Có | ~17kB | Trung bình |
| Joi | ❌ Phải viết tay | ✅ Có | ~30kB | Khó |
| class-validator | ❌ Phải viết tay | ✅ Có | Nặng | Phức tạp |
| Tự viết if/else | ❌ Không | ✅ Thủ công | 0 | Tốn thời gian |

**Lý do chọn Zod:** Viết schema một lần → có cả validation lẫn TypeScript type. Không bao giờ bị lệch nhau.

---

## PHẦN 2 — Khái niệm cốt lõi

### Schema là gì?

Schema là bản mô tả hình dạng của dữ liệu. Zod dùng nó để:
1. Kiểm tra dữ liệu đầu vào có đúng không (`parse` / `safeParse`)
2. Sinh ra TypeScript type tương ứng (`z.infer<>`)

### Mental model

```
Zod Schema = Khuôn đúc
  │
  ├── parse(data)        → Đổ dữ liệu vào khuôn. Nếu không vừa → ném Error
  └── safeParse(data)    → Đổ dữ liệu vào khuôn. Nếu không vừa → trả về object lỗi (không throw)

z.infer<typeof Schema>  = Dùng khuôn để tạo ra TypeScript type tương ứng
```

---

## PHẦN 3 — Cú pháp & API

### 3.1 Các kiểu dữ liệu cơ bản

```typescript
import { z } from "zod";

// Primitive types
const nameSchema = z.string();
const ageSchema = z.number();
const isActiveSchema = z.boolean();
const createdAtSchema = z.date();

// Optional (có thể undefined)
const bioSchema = z.string().optional();   // string | undefined

// Nullable (có thể null)
const avatarSchema = z.string().nullable(); // string | null

// Optional + Nullable
const nicknameSchema = z.string().nullish(); // string | null | undefined
```

### 3.2 String validation (hay dùng nhất)

```typescript
const emailSchema = z
  .string()
  .min(1, "Email không được để trống")         // Tối thiểu 1 ký tự
  .max(100, "Email quá dài")                   // Tối đa 100 ký tự
  .email("Email không đúng định dạng");        // Phải là format email

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
  .regex(/[0-9]/, "Phải có ít nhất 1 chữ số");

const phoneSchema = z
  .string()
  .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ");
```

### 3.3 Object Schema (hay dùng nhất)

```typescript
// Định nghĩa schema cho form đăng nhập
const signInSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

// Tự động sinh ra TypeScript type từ schema — không cần viết interface thủ công
type SignInFormData = z.infer<typeof signInSchema>;
// Kết quả: { email: string; password: string }

// Sử dụng để validate
const result = signInSchema.safeParse({
  email: "test@gmail.com",
  password: "12345678",
});

if (result.success) {
  console.log(result.data); // data đã được validate, type là SignInFormData
} else {
  console.log(result.error.flatten()); // Danh sách lỗi theo field
}
```

### 3.4 `parse` vs `safeParse`

```typescript
const schema = z.string().email();

// parse: Throw Error nếu fail — dùng khi chắc chắn data đúng
try {
  const email = schema.parse("abc"); // ném ZodError
} catch (e) {
  console.error(e);
}

// safeParse: Không throw, trả về object kết quả — dùng trong form, API response
const result = schema.safeParse("abc");

if (!result.success) {
  // result.error.issues  →  mảng các lỗi chi tiết
  // result.error.flatten() →  { fieldErrors: {...}, formErrors: [...] }
  console.log(result.error.flatten());
}
```

### 3.5 Refine — Validation điều kiện phức tạp

```typescript
// Kiểm tra confirm password khớp với password
const signUpSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"], // Gán lỗi vào field confirmPassword
    }
  );

type SignUpFormData = z.infer<typeof signUpSchema>;
```

### 3.6 Transform — Biến đổi dữ liệu sau khi validate

```typescript
// Trim whitespace và lowercase email tự động
const emailSchema = z
  .string()
  .email()
  .transform((val) => val.trim().toLowerCase());

// Kết quả: "  TEST@Gmail.com  " → "test@gmail.com"
```

### 3.7 Enum

```typescript
const subscriptionSchema = z.enum(["FREE", "MONTHLY", "YEARLY"]);
type Subscription = z.infer<typeof subscriptionSchema>; // "FREE" | "MONTHLY" | "YEARLY"
```

---

## PHẦN 4 — Lỗi hay gặp

### Lỗi 1: Quên dùng `z.infer` và tự viết interface trùng lặp

```typescript
// ❌ Sai: Viết interface thủ công → dễ lệch với schema
interface LoginForm {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ✅ Đúng: Để Zod tự sinh type
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type LoginForm = z.infer<typeof loginSchema>; // Luôn khớp với schema
```

### Lỗi 2: Dùng `parse` thay vì `safeParse` trong form validation

```typescript
// ❌ Sai: Nếu data không hợp lệ, app sẽ crash với unhandled ZodError
const data = loginSchema.parse(formValues);

// ✅ Đúng: safeParse không throw, kiểm tra success trước
const result = loginSchema.safeParse(formValues);
if (result.success) {
  // xử lý data
} else {
  // hiển thị lỗi cho user
}
```

### Lỗi 3: `.refine()` đặt sai vị trí (thường xảy ra với confirm password)

```typescript
// ❌ Sai: refine đặt trên field thay vì trên toàn bộ object
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().refine(
    (val) => val === ???, // Không có cách nào truy cập password ở đây!
    "Mật khẩu không khớp"
  ),
});

// ✅ Đúng: refine đặt ở object level để truy cập cả 2 field
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });
```

---

## PHẦN 5 — Best Practices

### Tách schema ra file riêng

```typescript
// src/features/auth/schemas/signIn.schema.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

// Export type từ schema — một nguồn sự thật duy nhất
export type SignInFormData = z.infer<typeof signInSchema>;
```

### Tái sử dụng schema con

```typescript
// Định nghĩa một lần, dùng nhiều nơi
const emailField = z.string().min(1, "Email không được để trống").email("Email không hợp lệ");
const passwordField = z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự");

const signInSchema = z.object({ email: emailField, password: passwordField });
const signUpSchema = z.object({
  email: emailField,
  password: passwordField,
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});
```

---

## PHẦN 6 — Setup chuẩn Production với react-hook-form

Xem file `react-hook-form.md` để thấy cách Zod kết hợp với react-hook-form qua `zodResolver`.

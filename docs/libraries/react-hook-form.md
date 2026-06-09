# Toàn tập Hướng dẫn sử dụng react-hook-form

## PHẦN 1 — Bối cảnh & Lý do tồn tại

### Bài toán react-hook-form giải quyết

Quản lý form trong React có 3 vấn đề lớn:
1. **Re-render liên tục** — Mỗi lần user gõ phím, nếu dùng `useState` cho mỗi field, toàn bộ form re-render
2. **Validation phức tạp** — Validate lúc nào (onChange? onBlur? onSubmit?), hiển thị lỗi thế nào
3. **Boilerplate nhiều** — Với form 10 field, code `onChange` thủ công rất dài

### So sánh với các giải pháp khác

| Giải pháp | Re-render | Bundle size | Học dễ? | Tích hợp Zod |
|-----------|-----------|-------------|---------|--------------|
| **react-hook-form (Được chọn)** | Cực ít (uncontrolled) | ~10kB | Dễ | ✅ Chính thức |
| Formik | Nhiều (controlled) | ~15kB | Trung bình | ⚠️ Qua adapter |
| useState thủ công | Rất nhiều | 0 | Dễ nhưng tốn thời gian | ❌ Tự viết |

**Lý do chọn react-hook-form:** Dùng uncontrolled input + ref thay vì state → gần như zero re-render. Kết hợp với Zod qua `zodResolver` cực kỳ clean.

---

## PHẦN 2 — Khái niệm cốt lõi

### Uncontrolled vs Controlled

- **Controlled (useState):** React nắm giữ giá trị. Mỗi phím bấm → setState → re-render toàn component
- **Uncontrolled (react-hook-form):** DOM nắm giữ giá trị trong ref. React chỉ đọc khi cần (submit, validate)

```
Controlled:   User gõ → setState → re-render → 50ms mỗi phím
Uncontrolled: User gõ → ref update → không re-render → instant
```

### Các hook và function chính

| Tên | Vai trò |
|-----|---------|
| `useForm()` | Khởi tạo form, trả về tất cả tools cần thiết |
| `register()` | Đăng ký một input field vào form |
| `handleSubmit()` | Bọc submit function, tự validate trước khi gọi |
| `formState.errors` | Object chứa lỗi validation của từng field |
| `watch()` | Theo dõi giá trị của field theo thời gian thực |
| `setValue()` | Gán giá trị cho field từ code (không cần user nhập) |
| `reset()` | Reset toàn bộ form về giá trị ban đầu |
| `Controller` | Component bọc các input "không chuẩn" (như DatePicker, custom component) |

---

## PHẦN 3 — Cú pháp & API

### 3.1 Setup cơ bản với Zod

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Định nghĩa schema
const signInSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

// 2. Tự động sinh TypeScript type
type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const {
    register,       // Đăng ký input
    handleSubmit,   // Bọc submit, validate trước khi gọi
    formState: { errors, isSubmitting }, // Lỗi validation và trạng thái submit
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),  // Kết nối với Zod
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    // data đã được validate bởi Zod — chắc chắn đúng type
    await signIn(data.email, data.password);
  };

  return (
    <View>
      <TextInput {...register("email")} />
      {errors.email && <Text>{errors.email.message}</Text>}

      <TextInput {...register("password")} />
      {errors.password && <Text>{errors.password.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
    </View>
  );
}
```

### 3.2 `register()` — Đăng ký input

```typescript
// Cách dùng cơ bản
<TextInput {...register("email")} />

// register() trả về: { name, ref, onChange, onBlur }
// Spread vào TextInput sẽ tự động kết nối

// Với React Native, TextInput không dùng onChange mà dùng onChangeText
// Phải dùng Controller thay thế (xem phần 3.4)
```

### 3.3 `formState` — Trạng thái form

```typescript
const {
  formState: {
    errors,        // { email: { message: "..." }, password: { message: "..." } }
    isSubmitting,  // true khi đang gọi API
    isValid,       // true khi tất cả field hợp lệ
    isDirty,       // true khi user đã chỉnh sửa ít nhất 1 field
    dirtyFields,   // { email: true } — field nào đã được chỉnh
  }
} = useForm();
```

### 3.4 `Controller` — Bắt buộc dùng với React Native

React Native `TextInput` không có `onChange` như HTML input — nó dùng `onChangeText`. Vì vậy, **không thể dùng `register()` trực tiếp** với React Native. Phải dùng `Controller`.

```typescript
import { Controller, useForm } from "react-hook-form";
import { TextInput, Text, View } from "react-native";

export default function SignInForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <View>
      {/* Controller bọc bên ngoài TextInput */}
      <Controller
        control={control}       // Truyền control từ useForm
        name="email"            // Tên field (phải khớp với schema)
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onChangeText={onChange}  // react-hook-form dùng onChange, map sang onChangeText
            onBlur={onBlur}          // Validate khi user rời khỏi field
            value={value}            // Giá trị hiện tại của field
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {/* Hiển thị lỗi nếu có */}
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message}</Text>
      )}
    </View>
  );
}
```

### 3.5 `watch()` — Theo dõi giá trị realtime

```typescript
const { watch } = useForm();

// Theo dõi một field
const email = watch("email");

// Theo dõi nhiều field
const [email, password] = watch(["email", "password"]);

// Dùng khi: Cần hiển thị preview, enable/disable field khác dựa trên giá trị field này
```

### 3.6 `setValue()` — Gán giá trị từ code

```typescript
const { setValue } = useForm();

// Gán giá trị (ví dụ: sau khi user chọn từ picker)
setValue("email", "auto-filled@gmail.com");

// Với shouldValidate: true → validate ngay sau khi set
setValue("email", "auto-filled@gmail.com", { shouldValidate: true });
```

### 3.7 `reset()` — Reset form

```typescript
const { reset } = useForm();

// Reset về defaultValues
reset();

// Reset về giá trị cụ thể
reset({ email: "", password: "" });

// Dùng sau khi submit thành công
const onSubmit = async (data: SignInFormData) => {
  await signIn(data);
  reset(); // Xóa sạch form
};
```

---

## PHẦN 4 — Lỗi hay gặp

### Lỗi 1: Dùng `register()` thay vì `Controller` trong React Native

```typescript
// ❌ Sai: register() return onChange (HTML) nhưng TextInput cần onChangeText
<TextInput {...register("email")} />
// → TextInput sẽ không nhận được input của user, form luôn rỗng

// ✅ Đúng: Dùng Controller
<Controller
  control={control}
  name="email"
  render={({ field: { onChange, value, onBlur } }) => (
    <TextInput onChangeText={onChange} value={value} onBlur={onBlur} />
  )}
/>
```

### Lỗi 2: `handleSubmit` không được gọi vì missing `onPress`

```typescript
// ❌ Sai: Truyền handleSubmit(onSubmit) không có dấu ngoặc gọi
<Button title="Đăng nhập" onPress={handleSubmit} />
// → onSubmit không bao giờ được gọi

// ✅ Đúng: handleSubmit(onSubmit) trả về function, truyền function đó vào onPress
<Button title="Đăng nhập" onPress={handleSubmit(onSubmit)} />
```

### Lỗi 3: Không có `defaultValues` → lỗi controlled/uncontrolled

```typescript
// ❌ Sai: Không khai báo defaultValues
const { control } = useForm<SignInFormData>();
// → Ban đầu value là undefined → React cảnh báo về controlled/uncontrolled switch

// ✅ Đúng: Luôn khai báo defaultValues
const { control } = useForm<SignInFormData>({
  defaultValues: {
    email: "",
    password: "",
  },
});
```

### Lỗi 4: Xử lý lỗi API nhưng không báo cho form

```typescript
// ❌ Sai: Lỗi API chỉ show toast, form không biết
const onSubmit = async (data: SignInFormData) => {
  try {
    await signIn(data);
  } catch (e) {
    showToast("Email hoặc mật khẩu không đúng"); // User phải đọc toast
  }
};

// ✅ Đúng: Dùng setError để đặt lỗi vào đúng field
const { setError } = useForm();

const onSubmit = async (data: SignInFormData) => {
  try {
    await signIn(data);
  } catch (e) {
    setError("email", {
      type: "server",
      message: "Email hoặc mật khẩu không đúng",
    });
  }
};
```

---

## PHẦN 5 — Best Practices

1. **Luôn dùng `zodResolver`** thay vì viết validate thủ công
2. **Luôn khai báo `defaultValues`** để tránh cảnh báo controlled/uncontrolled
3. **Tách schema ra file riêng** (`features/auth/schemas/signIn.schema.ts`)
4. **Dùng `isSubmitting`** để disable button khi đang gọi API, tránh double submit
5. **Dùng `setError("root")`** cho lỗi không thuộc về field cụ thể nào

---

## PHẦN 6 — Setup chuẩn Production (React Native)

```typescript
// src/features/auth/schemas/signIn.schema.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng")
    .transform((val) => val.trim().toLowerCase()), // Tự động clean input
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
```

```typescript
// src/features/auth/components/SignInForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInSchema, type SignInFormData } from "../schemas/signIn.schema";

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => Promise<void>;
}

export function SignInForm({ onSubmit }: SignInFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema), // Kết nối Zod với react-hook-form
    defaultValues: {                     // Luôn có defaultValues
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: SignInFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      // Đặt lỗi API vào form để hiển thị đúng vị trí
      setError("root", {
        type: "server",
        message: error?.message ?? "Đăng nhập thất bại, thử lại sau",
      });
    }
  };

  return (
    <View>
      {/* Email field */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onChangeText={onChange}        // Map onChangeText → onChange của react-hook-form
            onBlur={onBlur}                // Trigger validation khi rời field
            value={value}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      {/* Lỗi validation của email */}
      {errors.email && <Text>{errors.email.message}</Text>}

      {/* Password field */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="Mật khẩu"
            secureTextEntry            // Ẩn ký tự password
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      {/* Lỗi từ server (không thuộc field cụ thể nào) */}
      {errors.root && (
        <Text style={{ color: "red" }}>{errors.root.message}</Text>
      )}

      {/* Submit button */}
      <TouchableOpacity
        onPress={handleSubmit(handleFormSubmit)} // handleSubmit validate trước khi gọi onSubmit
        disabled={isSubmitting}                  // Disable khi đang gọi API → tránh double submit
      >
        {isSubmitting
          ? <ActivityIndicator />
          : <Text>Đăng nhập</Text>
        }
      </TouchableOpacity>
    </View>
  );
}
```

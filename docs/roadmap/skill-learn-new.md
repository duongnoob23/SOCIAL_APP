# Prompt Template — Học Thư Viện Mới

## Cách dùng

Mỗi khi muốn học một thư viện mới, copy nguyên đoạn prompt bên dưới, thay `[TÊN_THƯ_VIỆN]` bằng tên thư viện thực tế, ném vào chat.

---

## Master Prompt

```
Tôi muốn học [TÊN_THƯ_VIỆN]. Hãy viết một tài liệu đầy đủ vào file:
C:\social_app\docs\libraries\[ten-thu-vien].md

Tài liệu phải tuân thủ đúng cấu trúc sau:

────────────────────────────────────────
PHẦN 1 — BỐI CẢNH & LÝ DO TỒN TẠI
────────────────────────────────────────
- Thư viện này giải quyết bài toán gì?
- Trước khi có nó, dev phải làm như thế nào?
- So sánh với các thư viện cùng mục đích (bảng so sánh rõ ràng)
- Lý do tại sao chọn cái này trong dự án social_app (WHY)

────────────────────────────────────────
PHẦN 2 — KHÁI NIỆM CỐT LÕI
────────────────────────────────────────
- Định nghĩa các thuật ngữ quan trọng nhất của thư viện
- Giải thích cơ chế hoạt động bên trong (không cần quá sâu, đủ để debug)
- Mental model: hãy giúp tôi hình dung nó hoạt động như thế nào

────────────────────────────────────────
PHẦN 3 — CÚ PHÁP & API (Từng phần có ví dụ)
────────────────────────────────────────
Với MỖI function/hook/method quan trọng:
  - Cú pháp đầy đủ với TypeScript
  - Giải thích từng tham số
  - Ví dụ thực tế (không dùng "foo/bar", dùng ví dụ gắn với dự án thực)
  - Khi nào dùng, khi nào không nên dùng

────────────────────────────────────────
PHẦN 4 — CÁC LỖI HAY GẶP & CÁCH FIX
────────────────────────────────────────
Với MỖI lỗi phổ biến:
  - Mô tả lỗi (error message hoặc behavior sai)
  - Nguyên nhân tại sao xảy ra
  - Code ví dụ SAI và ĐÚNG (có comment giải thích)

────────────────────────────────────────
PHẦN 5 — BEST PRACTICES & ANTI-PATTERNS
────────────────────────────────────────
- Những gì NÊN làm (với lý do)
- Những gì TUYỆT ĐỐI KHÔNG làm (với lý do)
- Pattern hay dùng nhất trong production

────────────────────────────────────────
PHẦN 6 — SETUP CHUẨN PRODUCTION
────────────────────────────────────────
- Code setup hoàn chỉnh, sẵn sàng dùng trong dự án social_app
- Comment vào TỪNG dòng code (không bỏ sót)
- Giải thích tại sao mỗi option được chọn như vậy

────────────────────────────────────────
YÊU CẦU CHUNG
────────────────────────────────────────
- Mọi ví dụ phải dùng TypeScript, không dùng JavaScript thuần
- Mọi ví dụ phải gắn với context của dự án social_app (auth, story, payment...)
- Không viết ví dụ kiểu "hello world" vô nghĩa
- Không giải thích chung chung — phải cụ thể, có code
- Sau mỗi đoạn lý thuyết phải có ít nhất 1 ví dụ code thực tế
```

---

## Ví dụ cách dùng

**Input:**
```
Tôi muốn học react-hook-form. Hãy viết tài liệu vào
C:\social_app\docs\libraries\react-hook-form.md
[paste toàn bộ Master Prompt bên trên vào đây]
```

---

## Danh sách thư viện đã học

| Thư viện | File | Ngày học |
|----------|------|----------|
| Zustand | `docs/libraries/zustand.md` | 04-06-2026 |
| MMKV | `docs/libraries/mmkv.md` | 04-06-2026 |
| Expo Router | `docs/libraries/expo-router.md` | 08-06-2026 |
| react-hook-form | `docs/libraries/react-hook-form.md` | 08-06-2026 |
| Zod | `docs/libraries/zod.md` | 08-06-2026 |
khi fix một lỗi 

1. Cho AI fix trước một lần
2. search lỗi theo tài liệu
3. tìm lỗi trên google 
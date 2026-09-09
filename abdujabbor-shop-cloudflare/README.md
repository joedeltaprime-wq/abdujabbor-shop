# Abdujabbor Shop — Cloudflare version

Bu loyiha eski `abdujabbor-shop.joedeltaprime.chatgpt.site` ko‘rinishiga yaqin qilib qayta tiklangan.

## Bor funksiyalar

- Originalga yaqin dark/light dizayn
- Desktop + mobile responsive katalog
- 6 ta namuna mahsulot
- Search, kategoriya va sort
- Product detail sahifasi
- Uzbek / Russian / English UI
- Brand maydoni
- Admin panel
- Mahsulot qo‘shish / tahrirlash / o‘chirish
- 6 tagacha mahsulot rasmi
- Sotuvda mavjud / katalogda ko‘rsatish switchlari
- Telefon, Telegram, location va about textlarini admin paneldan o‘zgartirish
- Cloudflare KV orqali global saqlash
- Admin paroli server-side secret sifatida saqlanadi

## 1. GitHub'ga yuklash

Repo: `joedeltaprime-wq/abdujabbor-shop`

ZIP ichidagi barcha fayl va papkalarni repo rootiga yuklang. `README.md`ni replace qilishingiz mumkin.

Muhim papkalar:

```
assets/
functions/
index.html
styles.css
app.js
_routes.json
_redirects
_headers
```

## 2. Cloudflare Pages deploy

Cloudflare -> Workers & Pages -> Create -> Pages / Import existing Git repository.

- Repository: `abdujabbor-shop`
- Framework preset: None
- Build command: bo‘sh qoldiring
- Build output directory: `.`
- Root directory: `/`

Deploy qiling.

## 3. KV yaratish

Cloudflare -> Storage & databases -> Workers KV -> Create namespace.

Masalan nomi:

`abdujabbor-shop-store`

Keyin Pages project -> Settings -> Bindings -> Add binding -> KV namespace.

Variable name aynan:

`STORE`

KV namespace sifatida yangi yaratgan namespace'ni tanlang.

## 4. Admin secretlar

Pages project -> Settings -> Variables and Secrets.

Quyidagi 2 ta Secret qo‘shing:

- `ADMIN_PASSWORD` = admin panelga kirish paroli
- `SESSION_SECRET` = uzun random secret, masalan 40+ belgili tasodifiy matn

Secretlarni qo‘shgandan keyin yangi deployment qiling.

## 5. Admin panel

Sayt manziliga `/admin` qo‘shing:

`https://YOUR-DOMAIN.pages.dev/admin`

`ADMIN_PASSWORD` qiymati bilan kiring.

## Eslatma

Agar KV binding hali qo‘shilmagan bo‘lsa, public katalog namuna mahsulotlari bilan ishlaydi, lekin admin orqali saqlash ishlamaydi. `STORE`, `ADMIN_PASSWORD`, va `SESSION_SECRET` qo‘shilgach admin o‘zgarishlari barcha foydalanuvchilarga global ko‘rinadi.

## Rasm limitlari

- JPG / PNG / WebP
- Har bir rasm 5 MB gacha
- Har mahsulotga 6 tagacha rasm
- Rasmlar Cloudflare KV'da saqlanadi

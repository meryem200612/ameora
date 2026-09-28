# Ameora Laravel API

This is the real Laravel backend for Ameora. The existing `backend` Node/Prisma project is intentionally untouched.

## XAMPP / Windows

Ensure MySQL is running in XAMPP and create a database named `ameora` (or let your MySQL client create it). The generated `.env` is configured for `127.0.0.1:3306`, user `root`, blank password.

```powershell
$env:Path="C:\xamp\php;$env:Path"
& "C:\xamp\php\php.exe" artisan key:generate
& "C:\xamp\php\php.exe" artisan migrate --seed
& "C:\xamp\php\php.exe" artisan serve --host=127.0.0.1 --port=4000
```

The API is under `/api` and includes guest carts (`x-guest-token`), bearer-token auth, checkout stock transactions, customer account endpoints, wishlists, newsletter, reviews-ready product data, and admin endpoints. Admin seed credentials are `admin@ameora.com` / `password`; change them before production. Payment tokens are hashed and never stored as raw card data.

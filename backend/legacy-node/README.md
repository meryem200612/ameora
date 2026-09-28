# Ameora API

API REST TypeScript/Express pour le frontend Ameora, avec Prisma et MySQL
(compatible XAMPP).

## Pré-requis

- XAMPP avec **MySQL** démarré dans le panneau de contrôle ;
- Node.js installé ;
- une base MySQL nommée `ameora`.

La base peut être créée depuis phpMyAdmin (`http://localhost/phpmyadmin`) avec :

```sql
CREATE DATABASE ameora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Configuration

1. Copiez `.env.example` vers `.env`.
2. Adaptez `DATABASE_URL` si votre installation XAMPP utilise un mot de passe MySQL :

```env
DATABASE_URL="mysql://root:VOTRE_MOT_DE_PASSE@127.0.0.1:3306/ameora"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
CLIENT_ORIGIN="http://localhost:8443"
```

Avec la configuration XAMPP courante (`root` sans mot de passe), utilisez :

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/ameora"
```

## Installation et base de données

```powershell
npm install
npm run prisma:generate
npx prisma db push
npm run prisma:seed
npm run dev
```

`prisma db push` crée les tables MySQL à partir de
[prisma/schema.prisma](./prisma/schema.prisma). Le seed ajoute les catégories et
les produits initiaux Améora.

Toutes les routes sont sous `/api`. Le paiement accepte uniquement un token
fourni par un prestataire de paiement ; aucune carte bancaire brute n'est
stockée.

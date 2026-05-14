# Shop Builder API — backend integration

This document matches what the **user** Next app calls when `NEXT_PUBLIC_SHOP_BUILDER_USE_MOCK` is `false` and `NEXT_PUBLIC_SHOP_BUILDER_API_URL` is set.

## Environment

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_SHOP_BUILDER_USE_MOCK` | `true` (default): in-memory seeds. `false`: HTTP client active. |
| `NEXT_PUBLIC_SHOP_BUILDER_API_URL` | REST base, no trailing slash (e.g. `http://localhost:4000`). |
| `NEXT_PUBLIC_PLATFORM_API_URL` | Existing platform login; unrelated to shop CRUD. |
| `DATABASE_URL` | **Backend repo only** — use with Drizzle/Prisma against Postgres. |

Copy `user/.env.example` → `user/.env.local` and adjust.

## Auth

The browser sends `Authorization: Bearer <token>` when `getAuthSession()` has a token (same storage key as sign-in). Your gateway should validate JWT / session and scope shops to the owner.

## JSON conventions

- **camelCase** keys in JSON bodies and responses (matches `types/dashboard.ts`).
- Dates as **ISO 8601 strings** for `createdAt` / `updatedAt`; the client parses them with `new Date(...)`.

## Endpoints

Prefix all paths with `NEXT_PUBLIC_SHOP_BUILDER_API_URL`.

### Shops

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/v1/shops` | — | `Shop[]` |
| `PATCH` | `/v1/shops/:shopId` | `ShopUpdateInput` (partial `name`, `logoUrl`, `brandColor`, `accentColor`, `radiusPx`, `backgroundColor`, `tagline`, `textColor`) | `Shop` |

### Products

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/v1/shops/:shopId/products` | — | `Product[]` |
| `POST` | `/v1/shops/:shopId/products` | `NewProductInput` | `Product` |
| `PATCH` | `/v1/shops/:shopId/products/:productId` | `ProductUpdateInput` | `Product` |
| `DELETE` | `/v1/shops/:shopId/products/:productId` | — | empty body |

`NewProductInput` fields: `name`, `sku`, `category`, `size`, `description`, `imageUrl`, `status` (`Live` \| `Draft`), `price`, `inventory`.

### Customers (read-only in UI today)

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/v1/shops/:shopId/customers` | `Customer[]` |

### Shop category labels

Used for storefront filters / pickers (distinct strings per shop).

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/v1/shops/:shopId/categories` | — | `string[]` **or** `{ names: string[] }` |
| `POST` | `/v1/shops/:shopId/categories` | `{ "name": "Accessories" }` | `string[]` (full list) **or** refresh with `GET` |
| `DELETE` | `/v1/shops/:shopId/categories/:categoryName` | — | `string[]` or client refetches `GET` |

`categoryName` in the path must be URL-encoded.

## Initial load strategy

`apiLoadFullDashboard()` runs `GET /v1/shops`, then for **each** shop in parallel:

- `GET .../products`
- `GET .../customers`
- `GET .../categories`

You can later replace this with a single `GET /v1/dashboard/bootstrap` handler; update `user/lib/api/shop-builder-client.ts` when ready.

## Errors

Return JSON such as `{ "error": "message" }` or `{ "message": "..." }` on 4xx/5xx. The client surfaces `error` / `message` in `ShopBuilderApiError`.

## Database

See `user/drizzle/reference-schema.sql` (Postgres DDL) and `user/drizzle/schema.ts` (Drizzle `pgTable` definitions, requires `drizzle-orm` in this repo as a devDependency). Map columns to your migrations.

## Frontend types

Canonical TypeScript models: `user/types/dashboard.ts`. Keep API payloads aligned with these names and enums (`product_status`, `shop_currency`, etc.).

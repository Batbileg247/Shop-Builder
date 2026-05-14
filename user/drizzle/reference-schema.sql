-- Shop Builder reference schema (Postgres).
-- Backend: map to Drizzle (`pgTable`) or your ORM; money fields are integer minor units or whole currency units — align with `types/dashboard.ts`.

CREATE TYPE product_status AS ENUM ('Live', 'Draft');
CREATE TYPE shop_currency AS ENUM ('USD', 'EUR', 'MNT');

CREATE TABLE shops (
  id                VARCHAR(64) PRIMARY KEY,
  owner_id          VARCHAR(64) NOT NULL,
  name              TEXT NOT NULL,
  logo_url          TEXT NOT NULL,
  brand_color       VARCHAR(32) NOT NULL,
  accent_color      VARCHAR(32) NOT NULL,
  currency          shop_currency NOT NULL DEFAULT 'USD',
  radius_px         INTEGER NOT NULL DEFAULT 8,
  background_color  VARCHAR(32) NOT NULL DEFAULT '#f8fafc',
  tagline           TEXT NOT NULL DEFAULT '',
  text_color        VARCHAR(32) NOT NULL DEFAULT '#0f172a',
  created_at        TIMESTAMPTZ NOT NULL,
  updated_at        TIMESTAMPTZ NOT NULL
);

CREATE TABLE products (
  id              VARCHAR(64) PRIMARY KEY,
  shop_id         VARCHAR(64) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  sku             VARCHAR(64) NOT NULL,
  category        TEXT NOT NULL,
  size            TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  image_url       TEXT NOT NULL,
  status          product_status NOT NULL,
  price           INTEGER NOT NULL,
  inventory       INTEGER NOT NULL,
  sales           INTEGER NOT NULL DEFAULT 0,
  earning         INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX products_shop_id_idx ON products(shop_id);

CREATE TABLE customers (
  id               VARCHAR(64) PRIMARY KEY,
  shop_id          VARCHAR(64) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  email            VARCHAR(320) NOT NULL,
  avatar_url       TEXT NOT NULL DEFAULT '',
  total_orders     INTEGER NOT NULL DEFAULT 0,
  lifetime_value   INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX customers_shop_id_idx ON customers(shop_id);

CREATE TABLE shop_categories (
  id          VARCHAR(64) PRIMARY KEY,
  shop_id     VARCHAR(64) NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  UNIQUE (shop_id, name)
);

CREATE INDEX shop_categories_shop_id_idx ON shop_categories(shop_id);

/**
 * Drizzle table definitions mirroring `reference-schema.sql`.
 * Copy into your API workspace or run drizzle-kit from a package that owns `DATABASE_URL`.
 */
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const productStatusEnum = pgEnum("product_status", ["Live", "Draft"]);
export const shopCurrencyEnum = pgEnum("shop_currency", ["USD", "EUR", "MNT"]);

export const shops = pgTable("shops", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ownerId: varchar("owner_id", { length: 64 }).notNull(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  brandColor: varchar("brand_color", { length: 32 }).notNull(),
  accentColor: varchar("accent_color", { length: 32 }).notNull(),
  currency: shopCurrencyEnum("currency").notNull().default("USD"),
  radiusPx: integer("radius_px").notNull().default(8),
  backgroundColor: varchar("background_color", { length: 32 })
    .notNull()
    .default("#f8fafc"),
  tagline: text("tagline").notNull().default(""),
  textColor: varchar("text_color", { length: 32 })
    .notNull()
    .default("#0f172a"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  shopId: varchar("shop_id", { length: 64 })
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: varchar("sku", { length: 64 }).notNull(),
  category: text("category").notNull(),
  size: text("size").notNull().default(""),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  status: productStatusEnum("status").notNull(),
  price: integer("price").notNull(),
  inventory: integer("inventory").notNull(),
  sales: integer("sales").notNull().default(0),
  earning: integer("earning").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  shopId: varchar("shop_id", { length: 64 })
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  avatarUrl: text("avatar_url").notNull().default(""),
  totalOrders: integer("total_orders").notNull().default(0),
  lifetimeValue: integer("lifetime_value").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const shopCategories = pgTable("shop_categories", {
  id: varchar("id", { length: 64 }).primaryKey(),
  shopId: varchar("shop_id", { length: 64 })
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

import { pgTable, text, integer, numeric, bigint, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./user";

export const stock = pgTable("stock", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  location: text("location").notNull(),
  cost: numeric("cost", { precision: 12, scale: 2 }).notNull(),
  sellingPrice: numeric("selling_price", { precision: 12, scale: 2 }).notNull(),
  userId: integer("user_id").notNull().references(() => user.id),
  status: integer("status").default(1).notNull(),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
  updatedBy: integer("updated_by").references(() => user.id),
  updatedAt: bigint("updated_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull().$onUpdate(() => Math.floor(Date.now() / 1000)),
}, (table) => ({
  userIdIndex: index("stock_user_id_idx").on(table.userId),
  statusIndex: index("stock_status_idx").on(table.status),
  createdAtIndex: index("stock_created_at_idx").on(table.createdAt),
}));

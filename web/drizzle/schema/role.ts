import { pgTable, text, timestamp, integer, bigint, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./user";

export const role = pgTable("role", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(), // e.g., 'FARMER', 'ADMIN'
  status: integer("status").default(1).notNull(),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
  updatedBy: integer("updated_by").references(() => user.id),
  updatedAt: bigint("updated_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull().$onUpdate(() => Math.floor(Date.now() / 1000)),
}, (table) => ({
  statusIndex: index("role_status_idx").on(table.status),
}));

import { pgTable, text, integer, bigint, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./user";

export const worker = pgTable("worker", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => user.id).notNull().unique(), // Link to the user account
  farm: text("farm"), // Which farm they belong to
  role: text("role"), // Their specific role description
  status: integer("status").default(1).notNull(),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
  updatedBy: integer("updated_by").references(() => user.id),
  updatedAt: bigint("updated_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull().$onUpdate(() => Math.floor(Date.now() / 1000)),
}, (table) => ({
  userIdIndex: index("worker_user_id_idx").on(table.userId),
  statusIndex: index("worker_status_idx").on(table.status),
}));

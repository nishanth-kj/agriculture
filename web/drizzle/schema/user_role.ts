import { pgTable, integer, bigint, primaryKey, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./user";
import { role } from "./role";

export const userRole = pgTable("user_role", {
  userId: integer("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  roleId: integer("role_id").notNull().references(() => role.id, { onDelete: 'cascade' }),
  status: integer("status").default(1).notNull(),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
  updatedBy: integer("updated_by").references(() => user.id),
  updatedAt: bigint("updated_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull().$onUpdate(() => Math.floor(Date.now() / 1000)),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
  roleIdIndex: index("user_role_role_id_idx").on(table.roleId),
  statusIndex: index("user_role_status_idx").on(table.status),
}));

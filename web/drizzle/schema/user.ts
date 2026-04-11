import { pgTable, text, timestamp, integer, bigint, customType, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Custom bytea type for avatar
const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  avatar: bytea("avatar"),
  parentUserId: integer("parent_user_id").references((): any => user.id),
  status: integer("status").default(1).notNull(),
  createdBy: integer("created_by").references((): any => user.id),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
  updatedBy: integer("updated_by").references((): any => user.id),
  updatedAt: bigint("updated_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull().$onUpdate(() => Math.floor(Date.now() / 1000)),
}, (table) => ({
  parentUserIdIndex: index("parent_user_id_idx").on(table.parentUserId),
  statusIndex: index("user_status_idx").on(table.status),
}));

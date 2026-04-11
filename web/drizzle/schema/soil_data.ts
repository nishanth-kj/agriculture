import { pgTable, text, doublePrecision, integer, bigint, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./user";

export const soilData = pgTable("soil_data", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => user.id),
  b: doublePrecision("b").notNull(),
  cu: doublePrecision("cu").notNull(),
  ec: doublePrecision("ec").notNull(),
  fe: doublePrecision("fe").notNull(),
  k: doublePrecision("k").notNull(),
  mn: doublePrecision("mn").notNull(),
  n: doublePrecision("n").notNull(),
  oc: doublePrecision("oc").notNull(),
  p: doublePrecision("p").notNull(),
  s: doublePrecision("s").notNull(),
  zn: doublePrecision("zn").notNull(),
  confidence: doublePrecision("confidence").notNull(),
  fertilityClass: text("fertility_class").notNull(),
  ph: doublePrecision("ph").notNull(),
  status: integer("status").default(1).notNull(),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
  updatedBy: integer("updated_by").references(() => user.id),
  updatedAt: bigint("updated_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull().$onUpdate(() => Math.floor(Date.now() / 1000)),
}, (table) => ({
  userIdIndex: index("soil_data_user_id_idx").on(table.userId),
  statusIndex: index("soil_data_status_idx").on(table.status),
  createdAtIndex: index("soil_data_created_at_idx").on(table.createdAt),
}));

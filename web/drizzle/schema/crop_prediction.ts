import { pgTable, text, doublePrecision, integer, bigint, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./user";
import { soilData } from "./soil_data";

export const cropPrediction = pgTable("crop_prediction", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => user.id),
  soilDataId: integer("soil_data_id").references(() => soilData.id),
  crop: text("crop").notNull(),
  state: text("state").notNull(),
  season: text("season").notNull(),
  areaHectares: doublePrecision("area_hectares").notNull(),
  customQuestion: text("custom_question"),
  prediction: text("prediction"),
  yieldPerHectare: text("yield_per_hectare"),
  totalYield: text("total_yield"),
  profitability: text("profitability"),
  techniques: text("techniques"),
  rawAiResponse: text("raw_ai_response"),
  createdAt: bigint("created_at", { mode: "number" }).default(sql`extract(epoch from now())::bigint`).notNull(),
}, (table) => ({
  userIdIndex: index("crop_prediction_user_id_idx").on(table.userId),
  createdAtIndex: index("crop_prediction_created_at_idx").on(table.createdAt),
}));

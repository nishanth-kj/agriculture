import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Inventory Stock Model
 */
export type Stock = InferSelectModel<typeof schema.stock>;

/**
 * Input type for creating new inventory items
 */


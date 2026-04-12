import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Soil Health and Analytics Data Model
 */
export type SoilData = InferSelectModel<typeof schema.soilData>;

/**
 * Input type for registering new soil analysis records
 */


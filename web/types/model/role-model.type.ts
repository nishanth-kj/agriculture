import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Platform Role Definition Model
 */
export type Role = InferSelectModel<typeof schema.role>;

/**
 * Input type for defining new system roles
 */


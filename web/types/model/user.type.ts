import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Core User Model
 * Derived from Drizzle schema with extended role field.
 */
export type User = InferSelectModel<typeof schema.user> & { role?: string | number };

/**
 * Input type for creating new users
 */


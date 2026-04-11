import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Join Table for User-Role assignments
 */
export type UserRole = InferSelectModel<typeof schema.userRole>;

/**
 * Input type for assigning roles to users
 */


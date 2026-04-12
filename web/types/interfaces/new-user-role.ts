import { InferInsertModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
export type NewUserRole = InferInsertModel<typeof schema.userRole>;

import { InferInsertModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
export type NewRole = InferInsertModel<typeof schema.role>;

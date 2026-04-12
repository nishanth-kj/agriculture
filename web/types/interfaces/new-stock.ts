import { InferInsertModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
export type NewStock = InferInsertModel<typeof schema.stock>;

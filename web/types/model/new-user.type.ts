import { InferInsertModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
export type NewUser = InferInsertModel<typeof schema.user>;

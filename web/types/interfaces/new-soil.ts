import { InferInsertModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";
export type NewSoilData = InferInsertModel<typeof schema.soilData>;

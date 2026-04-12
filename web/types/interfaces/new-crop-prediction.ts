import { InferInsertModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Input model for generating a new AI Crop Prediction record
 */
export type NewCropPrediction = InferInsertModel<typeof schema.cropPrediction>;

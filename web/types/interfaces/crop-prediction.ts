import { InferSelectModel } from "drizzle-orm";
import * as schema from "@/drizzle/schema";

/**
 * Output model for AI Crop Prediction
 */
export type CropPrediction = InferSelectModel<typeof schema.cropPrediction>;

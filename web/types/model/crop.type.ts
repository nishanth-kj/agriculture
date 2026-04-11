/**
 * Agricultural Crop Species Metadata
 */
import { CROPS } from "@/lib";

export type Crop = typeof CROPS[keyof typeof CROPS]['value'];

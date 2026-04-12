/**
 * Output from Pest/Disease Diagnosis AI Engine
 */
export interface PestPredictionResult {
    prediction: string;
    confidenceLevel: string;
    preventionMethods?: string[];
    treatmentOptions?: string[];
    relatedPests?: string[];
}

/**
 * Standardized Response from AI Prediction Engine
 */
export interface PredictionResponse {
    response: string;
    yield_per_hectare?: string;
    total_yield?: string;
    profitability?: string;
    techniques?: string;
}

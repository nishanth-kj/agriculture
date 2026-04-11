/**
 * Form values for Pest Diagnosis AI requests
 */
export interface PestFormData {
    message: string;
    cropType: string;
    location: string;
    observedSymptoms: string;
    growthStage: string;
    weather: string;
    [key: string]: string;
}

export interface PestPredictionResponse {
  prediction: string
  confidenceLevel: string
  preventionMethods: string[]
  treatmentOptions: string[]
  relatedPests?: string[]
}

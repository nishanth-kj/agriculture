export interface PestPredictionRequest {
  message: string
  cropType: string
  location: string
  observedSymptoms?: string[]
  growthStage?: string
  weather?: string
}

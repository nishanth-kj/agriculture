export interface ChatRequest {
  message: string
  userName: string
  soilData?: Record<string, number>
  location?: string
  cropType?: string
}

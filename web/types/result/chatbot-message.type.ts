export interface ChatBotMessage {
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

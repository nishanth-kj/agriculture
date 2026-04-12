export interface WeatherData {
  location: { name: string; region: string };
  current: { temp_c: number; condition: { text: string }; time: string };
}

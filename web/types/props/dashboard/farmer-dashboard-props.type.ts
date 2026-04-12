import { WeatherData, MarketPriceEntry } from "@/types";

export interface FarmerDashboardProps {
  stats: {
    revenue: number;
    cost: number;
    profit: number;
    inventoryCount: number;
    labourCount: number;
  };
}

export interface FarmerDashboardViewProps extends FarmerDashboardProps {
  weather: WeatherData | null;
  marketPrices: MarketPriceEntry[];
  showAllPrices: boolean;
  setShowAllPrices: (val: boolean) => void;
}

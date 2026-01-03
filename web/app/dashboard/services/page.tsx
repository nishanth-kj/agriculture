"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "@/components/LoginRequired/LoginRequired";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
//import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import dayjs from "dayjs";

interface WeatherData {
  location: { name: string; region: string };
  current: { temp_c: number; condition: { text: string }; time: string };
}

interface MarketPriceEntry {
  commodity: string;
  value: number;
  state?: string;
  market?: string;
  variety?: string;
  arrival_date?: string;
}

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPriceEntry[]>([]);
  const [showAllPrices, setShowAllPrices] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClimate();
      fetchPrices();
    }
  }, [user]);

  const fetchClimate = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const data = await res.json();
          const time = data.current_weather.time;
          setWeather({
            location: { name: `Lat: ${lat.toFixed(2)}`, region: `Lon: ${lon.toFixed(2)}` },
            current: {
              temp_c: data.current_weather.temperature,
              condition: { text: `Wind: ${data.current_weather.windspeed} km/h` },
              time: dayjs(time).format('MMMM D, YYYY h:mm A')
            }
          });
        } catch {
          toast.error("Failed to fetch weather data");
        }
      });
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10");
      const data = await res.json();
      const prices: MarketPriceEntry[] = data.records.map((entry: Record<string, string>) => ({
        commodity: entry["commodity"],
        value: parseFloat(entry["modal_price"] || entry["min_price"] || "0"),
        state: entry["state"],
        market: entry["market"],
        variety: entry["variety"],
        arrival_date: entry["arrival_date"]
      }));
      setMarketPrices(prices);
    } catch {
      toast.error("Failed to fetch price data");
    }
  };

  const displayedPrices = showAllPrices ? marketPrices : marketPrices.slice(0, 5);

  if (loading) return <div />;

  return !user ? (
    <LoginRequired />
  ) : (
    <section className="relative bg-green-50 py-12">
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* WEATHER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">🌤️ Live Weather Info</h2>
          {weather ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base text-center sm:text-left max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p><strong>📍 Location:</strong></p>
                <p className="text-gray-600 truncate">{weather.location.name}, {weather.location.region}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p><strong>🌡 Temperature:</strong></p>
                <p className="text-gray-600">{weather.current.temp_c}°C</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl">
                <p><strong>💨 Condition:</strong></p>
                <p className="text-gray-600">{weather.current.condition.text}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p><strong>🕒 Time:</strong></p>
                <p className="text-gray-600 truncate">{weather.current.time}</p>
              </div>
            </div>
          ) : <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>}
        </div>

        {/* PRICE TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 whitespace-nowrap overflow-hidden text-ellipsis">Market Price Data</h2>
          <div className="overflow-x-auto -mx-6 px-6 scrollbar-hide">
            <div className="min-w-[600px] pb-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-bold">Commodity</TableHead>
                    <TableHead className="font-bold">Price</TableHead>
                    <TableHead className="font-bold">Market</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPrices.map((price: MarketPriceEntry, idx: number) => (
                    <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900">{price.commodity}</TableCell>
                      <TableCell className="text-green-600 font-bold">₹{price.value.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-600">{price.market}</TableCell>
                      <TableCell className="text-gray-500 text-sm whitespace-nowrap">{price.arrival_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {!showAllPrices && (
            <div className="text-center mt-6">
              <button
                className="inline-flex items-center px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-full hover:bg-blue-100 transition-all text-sm group"
                onClick={() => setShowAllPrices(true)}
              >
                View More Market Data
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* SMART SERVICES */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 mt-16 px-4">
          🌿 Our Smart Farming Services
        </h2>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {[
              {
                name: "Soil Health",
                icon: "🧪",
                description: "Monitor and improve soil health for sustainable farming.",
                href: "/dashboard/services/soil-health",
                bgColor: "bg-amber-50",
              },
              {
                name: "Crop Prediction",
                icon: "🌾",
                description: "Get precise predictions for crop yields and growth.",
                href: "/dashboard/services/crop-prediction",
                bgColor: "bg-amber-50",
              },
              {
                name: "Pest Prediction",
                icon: "🐛",
                description: "Identify likely pests affecting your crops and get prevention advice.",
                href: "/dashboard/services/pest-prediction",
                bgColor: "bg-amber-50",
              },
            ].map((service, index) => (
              <div key={index} className={`${service.bgColor} p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md group`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl p-3 rounded-lg bg-white shadow-sm group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <a href={service.href}
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors">
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

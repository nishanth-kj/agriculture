'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import {
    FaCloudSun, FaMapMarkerAlt, FaThermometerHalf, FaWind, FaClock,
    FaMoneyBillWave, FaChartLine, FaBox, FaShoppingBasket, FaUserTie,
    FaSeedling, FaChevronDown
} from 'react-icons/fa';

interface Stock {
    name: string;
    quantity: number;
    cost: number;
    sellingPrice: number;
    createdAt: string;
}

interface Worker {
    name: string;
    role: string;
    cost: number;
    createdAt: string;
}

interface SoilData {
    city: string;
    state: string;
    rainfall: number;
    ph: number;
}

interface WeatherData {
    location: {
        name: string;
        region: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
        };
        time: string;
    };
}

interface MarketPriceEntry {
    commodity: string;
    value: number;
    state?: string;
    market?: string;
    variety?: string;
    arrival_date?: string;
}

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [soil, setSoil] = useState<SoilData[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [marketPrices, setMarketPrices] = useState<MarketPriceEntry[]>([]);
    const [locationText, setLocationText] = useState<string>('');
    const [showAllPrices, setShowAllPrices] = useState(false);
    const [stockPage, setStockPage] = useState(1);
    const [workerPage, setWorkerPage] = useState(1);

    useEffect(() => {
        fetchData();
        fetchPrices();
        getLocationAndFetchClimate();
    }, []);

    const fetchData = async () => {
        try {
            const [stockRes, workerRes, soilRes] = await Promise.all([
                fetch('/api/stocks'),
                fetch('/api/workers'),
                fetch('/api/soildata')
            ]);

            setStocks(await stockRes.json());
            setWorkers(await workerRes.json());
            setSoil(await soilRes.json());
        } catch {
            toast.error('Failed to fetch dashboard data');
        }
    };

    const getLocationAndFetchClimate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocationText(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
                await fetchClimate(latitude, longitude);
            }, () => {
                toast.error('Location access denied');
            });
        } else {
            toast.error('Geolocation not supported');
        }
    };

    const fetchClimate = async (lat: number, lon: number) => {
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
            const data = await res.json();
            const time = data.current_weather.time;
            setWeather({
                location: {
                    name: `Lat: ${lat.toFixed(2)}`,
                    region: `Lon: ${lon.toFixed(2)}`
                },
                current: {
                    temp_c: data.current_weather.temperature,
                    condition: {
                        text: `Wind: ${data.current_weather.windspeed} km/h`
                    },
                    time: dayjs(time).format('MMMM D, YYYY h:mm A')
                }
            });
        } catch {
            toast.error('Failed to fetch climate data');
        }
    };

    const fetchPrices = async () => {
        try {
            const res = await fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=5');
            const data = await res.json();
            const prices: MarketPriceEntry[] = data.records.map((entry: Record<string, string>) => ({
                commodity: entry["commodity"],
                value: parseFloat(entry["modal_price"] || entry["min_price"] || '0'),
                state: entry["state"],
                market: entry["market"],
                variety: entry["variety"],
                arrival_date: entry["arrival_date"]
            }));
            setMarketPrices(prices);
        } catch {
            toast.error('Failed to fetch price data');
        }
    };

    const totalRevenue = stocks.reduce((acc, s) => acc + s.sellingPrice * s.quantity, 0);
    const totalCost = stocks.reduce((acc, s) => acc + s.cost * s.quantity, 0);
    const totalProfit = totalRevenue - totalCost;
    const totalLabourCost = workers.reduce((acc, w) => acc + w.cost, 0);

    const paginate = <T,>(items: T[], page: number): T[] => {
        return items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    };
    const displayedPrices = showAllPrices ? marketPrices : marketPrices.slice(0, 5);


    return (
        <div className="max-w-screen-xl mx-auto space-y-6 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 📍 Location & Weather Details Card */}
                <Card className="p-6 bg-card text-card-foreground shadow">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaCloudSun className="text-blue-500" /> Weather & Location
                    </h2>
                    {weather ? (
                        <div className="space-y-2">
                            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-600" /> <strong>Coordinates:</strong> {weather.location.name}, {weather.location.region}</p>
                            <p className="flex items-center gap-2"><FaThermometerHalf className="text-green-600" /> <strong>Temperature:</strong> {weather.current.temp_c}°C</p>
                            <p className="flex items-center gap-2"><FaWind className="text-amber-600" /> <strong>Condition:</strong> {weather.current.condition.text}</p>
                            <p className="flex items-center gap-2"><FaClock className="text-purple-600" /> <strong>Time:</strong> {weather.current.time}</p>
                        </div>
                    ) : (
                        <p>Fetching weather and location...</p>
                    )}
                </Card>

                {/* 💰 Financial Summary Card */}
                <Card className="p-6 bg-card text-card-foreground shadow">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" /> Financial Summary
                    </h2>
                    <p><strong>Total Revenue:</strong> ₹{totalRevenue.toFixed(2)}</p>
                    <p><strong>Total Cost:</strong> ₹{totalCost.toFixed(2)}</p>
                    <p className={totalProfit >= 0 ? "text-green-600 flex items-center gap-1" : "text-red-600 flex items-center gap-1"}>
                        <strong>Total Profit:</strong> ₹{totalProfit.toFixed(2)}
                    </p>
                    <p><strong>Labour Cost:</strong> ₹{totalLabourCost.toFixed(2)}</p>
                </Card>

                {/* 📦 Stock & Worker Summary Card */}
                <Card className="p-6 bg-card text-card-foreground shadow">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaBox className="text-amber-600" /> Stock & Labour Overview
                    </h2>

                    {/* Stock Details */}
                    <div className="mb-4">
                        <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                            <FaShoppingBasket className="text-orange-500" /> Stock Summary
                        </h3>
                        <p><strong>Stock Items:</strong> {stocks.length}</p>
                        <p><strong>Total Quantity:</strong> {stocks.reduce((sum, s) => sum + s.quantity, 0)}</p>
                        <p><strong>Total Cost of Stocks:</strong> ₹{stocks.reduce((sum, s) => sum + s.cost * s.quantity, 0).toFixed(2)}</p>
                        <p><strong>Total Selling Value:</strong> ₹{stocks.reduce((sum, s) => sum + s.sellingPrice * s.quantity, 0).toFixed(2)}</p>
                        <p className="text-green-600">
                            <strong>Estimated Profit:</strong> ₹{(
                                stocks.reduce((sum, s) => sum + (s.sellingPrice - s.cost) * s.quantity, 0)
                            ).toFixed(2)}
                        </p>
                    </div>

                    {/* Labour Details */}
                    <div>
                        <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                            <FaUserTie className="text-blue-500" /> Labour Summary
                        </h3>
                        <p><strong>Total Workers:</strong> {workers.length}</p>
                        <p><strong>Total Labour Cost:</strong> ₹{totalLabourCost.toFixed(2)}</p>
                    </div>
                </Card>



                {/* Market Prices */}

            </div>
            <div className="w-full">
                <h2 className="text-3xl font-bold text-center text-foreground mb-6 flex items-center justify-center gap-2">
                    <FaChartLine className="text-blue-600" /> Price History Data
                </h2>
                <div className="bg-card rounded-lg shadow p-6 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Commodity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Market</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedPrices.map((price, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{price.commodity}</TableCell>
                                    <TableCell>₹{price.value.toFixed(2)}</TableCell>
                                    <TableCell>{price.market}</TableCell>
                                    <TableCell>{price.arrival_date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="text-center mt-4">
                        <button
                            className="text-blue-600 hover:underline text-sm flex items-center justify-center mx-auto gap-1"
                            onClick={() => setShowAllPrices(prev => !prev)}
                        >
                            {showAllPrices ? 'Show Less' : 'Show More'} <FaChevronDown className={`transition-transform ${showAllPrices ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Paginated Stocks */}
            <Card className="p-6 bg-card text-card-foreground shadow">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FaBox className="text-amber-600" /> Stocks
                </h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Selling Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginate(stocks, stockPage).map((s, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>{s.quantity}</TableCell>
                                    <TableCell>{s.cost}</TableCell>
                                    <TableCell>{s.sellingPrice}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination className="mt-4 justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStockPage(prev => Math.max(prev - 1, 1));
                                }}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="text-xs text-muted-foreground px-2 whitespace-nowrap">
                                {stockPage} / {Math.ceil(stocks.length / ITEMS_PER_PAGE) || 1}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStockPage(prev => Math.min(prev + 1, Math.ceil(stocks.length / ITEMS_PER_PAGE)));
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </Card>

            {/* Paginated Workers */}
            <Card className="p-6 bg-card text-card-foreground shadow">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FaUserTie className="text-blue-500" /> Workers
                </h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginate(workers, workerPage).map((w, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{w.name}</TableCell>
                                    <TableCell>{w.role}</TableCell>
                                    <TableCell>{w.cost}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Pagination className="mt-4 justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setWorkerPage(prev => Math.max(prev - 1, 1));
                                }}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="text-xs text-muted-foreground px-2 whitespace-nowrap">
                                {workerPage} / {Math.ceil(workers.length / ITEMS_PER_PAGE) || 1}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setWorkerPage(prev => Math.min(prev + 1, Math.ceil(workers.length / ITEMS_PER_PAGE)));
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </Card>

            {/* Soil Data */}
            <Card className="p-6 bg-card text-card-foreground shadow">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FaSeedling className="text-green-600" /> Soil Data
                </h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>City</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Rainfall</TableHead>
                            <TableHead>pH</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {soil.map((s, i) => (
                            <TableRow key={i}>
                                <TableCell>{s.city}</TableCell>
                                <TableCell>{s.state}</TableCell>
                                <TableCell>{s.rainfall}</TableCell>
                                <TableCell>{s.ph}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

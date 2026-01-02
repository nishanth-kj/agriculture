"use client"
import React, { useState, useEffect } from 'react';
import Price from '@/components/Price/Price';
import Map from '@/components/Map/Map';

interface MarketData {
  price: number;
  trend: 'up' | 'down' | 'stable';
  // Add other properties as needed based on Price/Map component props
}

const Stocks = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  // Placeholder for actual data fetching
  useEffect(() => {
    // mock fetch
    setMarketData({ price: 100, trend: 'up' });
  }, []);

  return (
    <div>
      <Price data={marketData} />
      <Map />
    </div>
  );
};

export default Stocks;
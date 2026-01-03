"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InfoSection() {
    return (
        <section className="py-20 bg-white dark:bg-background">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder for a secondary image, using a solid color for now or could use the same hero img if needed, but better to be distinct */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
                            <span className="text-6xl">🌾</span>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                        Sustainable Farming for a <span className="text-green-600">Better Future</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        AgriTech connects cutting-edge technology with traditional farming wisdom.
                        By analyzing micro-climates and localized soil data, we help you reduce resource wastage and maximize crop output.
                        Our platform is designed to be your daily companion in the field.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center text-gray-700 dark:text-gray-200">
                            <span className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                            Data-driven decision making
                        </li>
                        <li className="flex items-center text-gray-700 dark:text-gray-200">
                            <span className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                            Instant pest identification
                        </li>
                        <li className="flex items-center text-gray-700 dark:text-gray-200">
                            <span className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                            Community support & expert access
                        </li>
                    </ul>
                    <div className="pt-4">
                        <Link href="/about" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-green-600/20">
                            Read Our Story
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

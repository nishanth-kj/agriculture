"use client";
import React from 'react';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function ProblemSolution() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* The Problem */}
                    <div className="lg:w-1/2 p-8 bg-white dark:bg-card border-l-4 border-red-500 shadow-sm rounded-r-xl">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 text-xl mr-4">
                                <FaExclamationTriangle />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">The Challenge</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            Modern farming faces unprecedented uncertainty. Climate change, unpredictable weather patterns, and soil degradation are making it increasingly difficult for farmers to maintain consistent yields.
                        </p>
                        <ul className="space-y-2 text-red-600/80 dark:text-red-400/80">
                            <li className="flex items-center"><span className="mr-2 text-xl">•</span> Inconsistent Rainfall</li>
                            <li className="flex items-center"><span className="mr-2 text-xl">•</span> Nutrient-Depleted Soil</li>
                            <li className="flex items-center"><span className="mr-2 text-xl">•</span> Unexpected Pest Outbreaks</li>
                        </ul>
                    </div>

                    {/* The Solution */}
                    <div className="lg:w-1/2 p-8 bg-white dark:bg-card border-l-4 border-green-500 shadow-sm rounded-r-xl">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xl mr-4">
                                <FaCheckCircle />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Solution</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            AgriTech brings certainty back to agriculture. By processing vast amounts of environmental data through advanced ML algorithms, we provide precise recommendations that adapt to changing conditions.
                        </p>
                        <ul className="space-y-2 text-green-600/80 dark:text-green-400/80">
                            <li className="flex items-center"><span className="mr-2 text-xl">✓</span> Predictive Weather Modeling</li>
                            <li className="flex items-center"><span className="mr-2 text-xl">✓</span> AI-Driven Soil Analysis</li>
                            <li className="flex items-center"><span className="mr-2 text-xl">✓</span> Early Disease Detection System</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

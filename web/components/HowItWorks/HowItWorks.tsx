"use client";
import React from 'react';
import { FaBook, FaGithub } from 'react-icons/fa';

export default function HowItWorks() {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center items-center py-24 bg-muted/30 dark:bg-gray-900/20">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground dark:text-white">How <span className="text-primary">AgriTech</span> Works</h2>
                    <p className="text-muted-foreground dark:text-gray-300 mt-2 max-w-2xl mx-auto">
                        We leverage advanced AI and machine learning to provide actionable insights for farmers, optimizing every stage of the agricultural process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-card dark:bg-card p-6 rounded-2xl shadow-sm border border-border dark:border-gray-800 hover:shadow-md transition-shadow text-center flex flex-col justify-center h-full">
                        <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 mx-auto text-green-600 dark:text-green-400 font-bold text-xl">
                            🌱
                        </div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">Smart Crop Prediction</h3>
                        <p className="text-muted-foreground dark:text-gray-400 text-sm">
                            Analyze soil data like Nitrogen, Phosphorus, Potassium, and pH levels to recommend the perfect crops for your land's specific conditions.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-card dark:bg-card p-6 rounded-2xl shadow-sm border border-border dark:border-gray-800 hover:shadow-md transition-shadow text-center flex flex-col justify-center h-full">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600 dark:text-blue-400 font-bold text-xl">
                            🔬
                        </div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">Soil Health Monitoring</h3>
                        <p className="text-muted-foreground dark:text-gray-400 text-sm">
                            Get detailed insights into your soil's health status. We assess nutrient levels and provide recommendations to maintain optimal fertility.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-card dark:bg-card p-6 rounded-2xl shadow-sm border border-border dark:border-gray-800 hover:shadow-md transition-shadow text-center flex flex-col justify-center h-full">
                        <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600 dark:text-red-400 font-bold text-xl">
                            🐞
                        </div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">Pest & Disease Detection</h3>
                        <p className="text-muted-foreground dark:text-gray-400 text-sm">
                            Upload images or describe symptoms to identify pests and diseases early. Receive instant treatment suggestions to protect your harvest.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-16">
                    <a href="/docs" className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-sm hover:shadow-md">
                        <FaBook className="mr-2" />
                        Read the Docs
                    </a>
                    <a href="https://github.com/nishanth-kj/agriculture" target="_blank" className="inline-flex items-center px-8 py-3 bg-gray-900 dark:bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md">
                        <FaGithub className="mr-2" />
                        GitHub
                    </a>
                </div>
            </div>
        </section>
    );
}

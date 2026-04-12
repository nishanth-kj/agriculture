"use client";
import React from 'react';
import { FaLeaf, FaRobot, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function Mission() {
    return (
        <section id="about" className="min-h-[60vh] flex flex-col justify-center py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-5xl mx-auto text-center mb-16 space-y-6">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">About <span className="text-green-600">AgriTech</span></h2>

                    <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed md:px-8">
                            Modern farming faces unprecedented uncertainty from climate change and soil degradation.
                            <span className="font-semibold text-green-600 dark:text-green-400"> AgriTech brings certainty back</span> by processing vast amounts of environmental data through advanced ML algorithms to provide precise recommendations that adapt to changing conditions.
                            Our mission is to democratize access to these precision farming tools, ensuring every farmer has access to data-driven insights.
                        </p>

                        <div className="mt-8 flex justify-center">
                            <a href="/about" className="group inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1">
                                Learn More About Us
                                <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="text-center p-6 bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-2xl mb-4">
                            <FaLeaf />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sustainable Growth</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Promoting eco-friendly farming practices by optimizing fertilizer usage and reducing chemical dependency through targeted pest control.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mb-4">
                            <FaRobot />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Insights</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Leveraging Random Forest and CNN models to analyze complex soil and image data, providing instant and accurate predictions.
                        </p>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl mb-4">
                            <FaUsers />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Farmer First</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Built with simplicity in mind. Our intuitive interface ensures that complex technology remains accessible and easy to use for everyone.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

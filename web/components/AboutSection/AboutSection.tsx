"use client";
import React from 'react';
import Link from 'next/link';
import { FaLeaf, FaRobot, FaUsers } from 'react-icons/fa';

export default function AboutSection() {
    return (
        <section className="py-20 bg-white dark:bg-background">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">About <span className="text-green-600">AgriTech</span></h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        AgriTech is an open-source initiative designed to bridge the gap between traditional agriculture and modern artificial intelligence.
                        Our mission is to democratize access to precision farming tools, ensuring that every farmer, regardless of their resources, has access to data-driven insights.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-2xl mb-4">
                            <FaLeaf />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sustainable Growth</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Promoting eco-friendly farming practices by optimizing fertilizer usage and reducing chemical dependency through targeted pest control.
                        </p>
                    </div>
                    <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mb-4">
                            <FaRobot />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Insights</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Leveraging Random Forest and CNN models to analyze complex soil and image data, providing instant and accurate predictions.
                        </p>
                    </div>
                    <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
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

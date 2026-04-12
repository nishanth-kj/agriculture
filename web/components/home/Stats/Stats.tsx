"use client";
import React from 'react';

export default function Stats() {
    return (
        <section className="py-12 bg-green-900 text-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-green-700">
                    <div className="p-4">
                        <h3 className="text-4xl font-bold mb-2">22</h3>
                        <p className="text-green-200 uppercase tracking-widest text-sm font-semibold">Supported Crops</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-4xl font-bold mb-2">3</h3>
                        <p className="text-green-200 uppercase tracking-widest text-sm font-semibold">AI Services</p>
                    </div>
                    <div className="p-4">
                        <h3 className="text-4xl font-bold mb-2">100%</h3>
                        <p className="text-green-200 uppercase tracking-widest text-sm font-semibold">Open Source</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

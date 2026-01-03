"use client";
import React from 'react';
import Image from "next/image";
import IMG from "@/assets/famer.png"; // Ensure this path is correct

export default function HeroPage() {
  return (
    <section className="relative bg-green-50 min-h-[calc(100vh-64px)] flex items-center">
      {/* Container with Grid Layout */}
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center justify-center py-12 lg:py-0">
        {/* Image Section */}
        <div className="flex justify-center mb-12 lg:mb-0 order-2 lg:order-1">
          <div className="relative w-full max-w-[320px] md:max-w-[400px] aspect-square">
            <Image
              src={IMG}
              alt="Agriculture Hero"
              fill
              className="rounded-3xl shadow-2xl object-cover ring-8 ring-white/50"
              priority
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center lg:text-left order-1 lg:order-2">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-green-800 leading-tight">
            Unlock the Future of{" "}
            <span className="text-blue-600">Agriculture</span>
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Empowering farmers with cutting-edge tools for crop prediction, soil
            health analysis, and pest control. Simplify your agricultural
            journey with Neuro Kodes.
          </p>
          {/* Call-to-Action Buttons */}
          <div className="mt-6 flex justify-center lg:justify-start space-x-4">
            <a
              href="/services"
              className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded hover:bg-blue-700 transition"
            >
              Get Started
            </a>
            <a
              href="/about"
              className="px-6 py-3 border border-blue-600 text-blue-600 text-lg font-medium rounded hover:bg-blue-100 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { FaPython, FaGithub, FaCode, FaTerminal, FaCodeBranch, FaInfoCircle } from 'react-icons/fa';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function DocsPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen container mx-auto px-4 lg:px-6 py-12 gap-10 dark:bg-background">
            {/* Sidebar Navigation */}
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
                <div className="sticky top-24 space-y-8">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 px-2">Getting Started</h3>
                        <nav className="space-y-1">
                            <a href="#introduction" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium">Introduction</a>
                            <a href="#installation" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium">Installation</a>
                            <a href="#contributing" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium">Contributing</a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 px-2">API Reference</h3>
                        <nav className="space-y-1">
                            <a href="#python-api" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium">Python Backend</a>
                            <a href="#inference" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium">Inference Models</a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 px-2">Resources</h3>
                        <nav className="space-y-1">
                            <Link href="https://github.com/nishanth-kj/agriculture" target="_blank" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium flex items-center">
                                <FaGithub className="mr-2" /> GitHub Repo
                            </Link>
                            <Link href="https://github.com/nishanth-kj/agriculture/issues" target="_blank" className="block px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition font-medium flex items-center">
                                <FaInfoCircle className="mr-2" /> Support / Issues
                            </Link>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full">
                <section id="introduction" className="mb-12 lg:mb-16 scroll-mt-28">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">AgriTech Documentation</h1>
                    <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        Welcome to the official documentation for AgriTech. This page provides a brief overview. For detailed architecture and setup guides, please consult the repository documentation.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-8">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                    <span className="font-bold">Need more details?</span> Check out the comprehensive <Link href="https://github.com/nishanth-kj/agriculture/tree/main/docs" target="_blank" className="underline hover:text-yellow-800 dark:hover:text-yellow-100">Project Documentation</Link> in our repository.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6 flex items-start">
                        <FaCode className="text-blue-600 dark:text-blue-400 text-xl mt-1 mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Open Source</h3>
                            <p className="text-blue-800 dark:text-blue-300 text-sm">
                                This project is fully open source. Models are pre-trained and available in the repo.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="installation" className="mb-12 lg:mb-16 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Installation & Setup</h2>

                    <div className="space-y-8">
                        {/* Docker Setup */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center"><FaTerminal className="mr-2 text-gray-500" /> Docker Setup (Recommended)</h3>
                            <p className="text-gray-600 mb-4">Run the entire stack (Frontend + Backend + DB) with a single command.</p>
                            <div className="bg-gray-900 text-gray-100 rounded-xl overflow-hidden shadow-lg">
                                <div className="bg-gray-800 px-4 py-2 flex items-center justify-center lg:justify-between">
                                    <span className="text-xs text-gray-400 font-mono">bash</span>
                                </div>
                                <div className="p-6 font-mono text-sm overflow-x-auto">
                                    <p className="mb-2"><span className="text-purple-400">git clone</span> https://github.com/nishanth-kj/agriculture.git</p>
                                    <p className="mb-2"><span className="text-purple-400">cd</span> agriculture</p>
                                    <p className="text-gray-400"># Start services</p>
                                    <p><span className="text-green-400">docker-compose up</span> --build</p>
                                </div>
                            </div>
                        </div>

                        {/* Manual Setup */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Manual Setup</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border rounded-xl p-4">
                                    <h4 className="font-bold text-green-700 mb-2">Backend (Python)</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Python 3.12+ Required</li>
                                        <li>Uses <code>uv</code> for package management</li>
                                        <li><code>cd api && uv sync</code></li>
                                        <li><code>python manage.py runserver</code></li>
                                    </ul>
                                </div>
                                <div className="border rounded-xl p-4">
                                    <h4 className="font-bold text-blue-700 mb-2">Frontend (Next.js)</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Node.js 20+ Required</li>
                                        <li><code>cd web</code></li>
                                        <li><code>npm run dev</code></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="python-api" className="mb-16 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 flex items-center">
                        <FaPython className="mr-3 text-yellow-600" /> Python Backend API
                    </h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            The backend runs on port <code>8000</code> by default.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold font-mono mr-4">POST</span>
                                    <code className="text-gray-800 dark:text-gray-200 font-mono font-medium">/api/crop-yield/</code>
                                </div>
                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Inference</span>
                            </div>
                            <div className="p-6 bg-white">
                                <p className="text-sm text-gray-600 mb-4">Predicts crop yield using Random Forest Regressor.</p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Payload</h4>
                                    <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                                        {`{
  "nitrogen": 50,
  "phosphorus": 50,
  "potassium": 50,
  "temperature": 26,
  "humidity": 80,
  "ph": 7,
  "rainfall": 200
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold font-mono mr-4">POST</span>
                                    <code className="text-gray-800 dark:text-gray-200 font-mono font-medium">/api/prediction/pest-predict/</code>
                                </div>
                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Computer Vision</span>
                            </div>
                            <div className="p-6 bg-white">
                                <p className="text-sm text-gray-600 mb-4">Uses CNN to detect pests from uploaded images.</p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Payload</h4>
                                    <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                                        {`multipart/form-data
file: <image_file>`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contributing" className="mb-16 scroll-mt-28">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 flex items-center">
                        <FaCodeBranch className="mr-3 text-green-600" /> Contributing
                    </h2>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                            We welcome contributions from the community! Whether it's fixing bugs, improving documentation, or proposing new features, your help is appreciated.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/contribution" className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md">
                                <FaCodeBranch className="mr-2" /> View Contribution Guide
                            </Link>
                            <a href="https://github.com/nishanth-kj/agriculture" target="_blank" className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <FaGithub className="mr-2" /> GitHub Repository
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

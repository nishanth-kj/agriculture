import React from 'react';
import { FaGithub, FaCode, FaBug, FaBook } from 'react-icons/fa';
import Link from 'next/link';

export default function ContributionPage() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 mb-4">Contribute to AgriTech</h1>
                <p className="text-lg text-gray-600">
                    We welcome contributions from the community! Whether you're fixing bugs, improving documentation, or adding new features, we appreciate your help.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="border p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                    <FaCode className="text-4xl text-blue-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Code Contributions</h2>
                    <p className="text-gray-600 mb-4">
                        Browse our open issues on GitHub, pick a task, and submit a PR. We value clean, well-documented code.
                    </p>
                    <Link href="https://github.com/nishanthkj/agriculture" target="_blank" className="text-blue-600 font-semibold hover:underline">
                        View GitHub Repo →
                    </Link>
                </div>

                <div className="border p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                    <FaBug className="text-4xl text-red-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Report Issues</h2>
                    <p className="text-gray-600 mb-4">
                        Found a bug or have a feature request? Let us know by opening an issue on our GitHub repository.
                    </p>
                    <Link href="https://github.com/nishanthkj/agriculture/issues" target="_blank" className="text-blue-600 font-semibold hover:underline">
                        Open an Issue →
                    </Link>
                </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Getting Started</h2>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-4">1</span>
                        <p>Fork the repository on GitHub.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-4">2</span>
                        <p>Clone your forked repository to your local machine.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-4">3</span>
                        <p>Install dependencies using <code>npm install</code>.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-4">4</span>
                        <p>Create a new branch for your feature or fix.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-4">5</span>
                        <p>Commit your changes and push to your fork.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mr-4">6</span>
                        <p>Submit a Pull Request to the main repository.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

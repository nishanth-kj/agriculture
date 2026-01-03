import React from 'react';
import { FaGithub, FaCode, FaBug, FaBook, FaCheckCircle, FaUsers, FaLightbulb } from 'react-icons/fa';
import Link from 'next/link';

export default function ContributionPage() {
    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 dark:text-green-500 mb-4">Contribute to AgriTech</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    We welcome contributions from the community! Whether you're fixing bugs, improving documentation, or adding new features, we appreciate your help in making agriculture technology more accessible.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
                    <FaCode className="text-4xl text-green-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Code Contributions</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Browse our open issues on GitHub, pick a task, and submit a PR. We value clean, well-documented code.
                    </p>
                    <Link href="https://github.com/nishanth-kj/agriculture" target="_blank" className="text-green-600 font-semibold hover:underline flex items-center">
                        <FaGithub className="mr-2" /> View GitHub Repo →
                    </Link>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
                    <FaBug className="text-4xl text-red-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Report Issues</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Found a bug or have a feature request? Let us know by opening an issue on our GitHub repository.
                    </p>
                    <Link href="https://github.com/nishanth-kj/agriculture/issues" target="_blank" className="text-green-600 font-semibold hover:underline">
                        Open an Issue →
                    </Link>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900">
                    <FaBook className="text-4xl text-blue-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Documentation</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Read our comprehensive documentation to understand the project architecture and setup instructions.
                    </p>
                    <Link href="/docs" className="text-green-600 font-semibold hover:underline flex items-center">
                        <FaBook className="mr-2" /> Read Docs →
                    </Link>
                </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl border border-gray-100 dark:border-gray-800 mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Getting Started</h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold mr-4 shrink-0">1</span>
                        <div>
                            <p className="font-semibold mb-1">Fork the Repository</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Click the "Fork" button on the GitHub repository to create your own copy.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold mr-4 shrink-0">2</span>
                        <div>
                            <p className="font-semibold mb-1">Clone Your Fork</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Clone your forked repository to your local machine using <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">git clone</code>.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold mr-4 shrink-0">3</span>
                        <div>
                            <p className="font-semibold mb-1">Create a Branch</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Create a new branch for your feature or fix using a descriptive name like <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">feature/amazing-feature</code>.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold mr-4 shrink-0">4</span>
                        <div>
                            <p className="font-semibold mb-1">Make Your Changes</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Implement your feature or fix. Make sure to follow our coding standards and write tests where applicable.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold mr-4 shrink-0">5</span>
                        <div>
                            <p className="font-semibold mb-1">Commit and Push</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Commit your changes with clear, descriptive messages and push to your fork.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold mr-4 shrink-0">6</span>
                        <div>
                            <p className="font-semibold mb-1">Submit a Pull Request</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Open a PR against our <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">main</code> branch with a clear description of your changes.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contribution Guidelines */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900">
                    <div className="flex items-center mb-4">
                        <FaCheckCircle className="text-2xl text-green-600 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Code Standards</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Write clean, readable, and well-documented code</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Follow existing code style and conventions</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Add comments for complex logic</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Use TypeScript for type safety</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Ensure code passes linting checks</span>
                        </li>
                    </ul>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900">
                    <div className="flex items-center mb-4">
                        <FaLightbulb className="text-2xl text-yellow-600 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">PR Best Practices</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Keep PRs focused on a single feature or fix</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Write clear PR descriptions explaining your changes</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Reference related issues in your PR</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Respond to review feedback promptly</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>Update documentation if needed</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Community Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center mb-4">
                    <FaUsers className="text-3xl text-green-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Join Our Community</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We believe in building a welcoming and inclusive community. All contributors are expected to follow our code of conduct and treat each other with respect.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="https://github.com/nishanth-kj/agriculture/discussions" target="_blank" className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                        <FaGithub className="mr-2" /> GitHub Discussions
                    </Link>
                    <Link href="https://github.com/nishanth-kj/agriculture/issues" target="_blank" className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        View Issues
                    </Link>
                </div>
            </div>
        </div>
    );
}

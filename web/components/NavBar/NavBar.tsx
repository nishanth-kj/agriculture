'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
    FaBars,
    FaTimes,
    FaHome,
    FaEnvelope,
    FaInfoCircle,
    FaSun,
    FaMoon,
    FaBook,
    FaGithub,
    FaCodeBranch,
} from 'react-icons/fa'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export default function ResponsiveNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const { setTheme, theme } = useTheme()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
    }

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm font-poppins transition-all duration-300 dark:bg-gray-900/80 dark:border-b dark:border-gray-800">
            <div className="container mx-auto px-6 lg:px-12 flex items-center h-16">
                {/* Left Section: Logo */}
                <div className="flex-1 md:flex-initial md:w-1/4 flex items-center">
                    <div className="text-xl font-bold text-black dark:text-white tracking-tight whitespace-nowrap">AgriTech</div>
                </div>

                {/* Center Section: Navigation Links (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <ul className="flex space-x-8 text-sm font-medium text-black dark:text-gray-200">
                        <li>
                            <Link href="/" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                <FaHome className="mr-2" /> Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/#about" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                <FaInfoCircle className="mr-2" /> About
                            </Link>
                        </li>
                        <li>
                            <Link href="/docs" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                <FaBook className="mr-2" /> Docs
                            </Link>
                        </li>
                        <li>
                            <Link href="/contribution" className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                <FaCodeBranch className="mr-2" /> Contribute
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Section: Auth/User (Desktop) + Hamburger (Mobile) */}
                <div className="flex-1 md:flex-initial md:w-1/4 flex items-center justify-end">
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="https://github.com/nishanth-kj/agriculture" target="_blank" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                            <FaGithub className="h-5 w-5" />
                        </Link>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <FaSun className="h-5 w-5 text-yellow-500 hidden dark:block" />
                            <FaMoon className="h-5 w-5 text-gray-700 dark:text-gray-300 block dark:hidden" />
                            <span className="sr-only">Toggle theme</span>
                        </button>
                        {user ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer border-2 border-transparent hover:border-green-500 transition-all">
                                        <AvatarFallback className="bg-green-100 text-green-700">
                                            {user.name ? user.name[0] : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2 mt-2" align="end">
                                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                                        <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{user.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                                    </div>
                                    <div className="p-1 space-y-1 mt-1">
                                        <button
                                            onClick={() => router.push('/profile')}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                        >
                                            Profile Settings
                                        </button>
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                        >
                                            Dashboard
                                        </button>
                                    </div>
                                    <div className="p-1 mt-1 border-t border-gray-100 dark:border-gray-700">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-full hover:bg-green-700 shadow-sm hover:shadow-md transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Right Section */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="https://github.com/nishanth-kj/agriculture" target="_blank" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                            <FaGithub className="h-5 w-5" />
                        </Link>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <FaSun className="h-5 w-5 text-yellow-500 hidden dark:block" />
                            <FaMoon className="h-5 w-5 text-gray-700 dark:text-gray-300 block dark:hidden" />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors focus:outline-none"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-100 dark:bg-gray-900 shadow-md">
                    <div className="px-6 py-6 space-y-6">
                        {/* User Profile Section in Mobile */}
                        {user && (
                            <div className="flex items-center space-x-4 p-3 border-b border-gray-300 dark:border-gray-700">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-green-600 text-white">
                                        {user.name ? user.name[0] : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-black dark:text-white truncate">{user.name}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <ul className="space-y-4 text-black dark:text-gray-200">
                            <li>
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <FaHome className="mr-3" /> Home
                                </Link>
                            </li>

                            <li>
                                <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <FaInfoCircle className="mr-3" /> About
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <FaBook className="mr-3" /> Docs
                                </Link>
                            </li>
                            <li>
                                <Link href="/contribution" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                    <FaCodeBranch className="mr-3" /> Contribute
                                </Link>
                            </li>
                        </ul>

                        {/* User Actions / Auth */}
                        <div className="pt-4 border-t border-gray-300 dark:border-gray-700 flex flex-col space-y-4">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); router.push('/profile'); }}
                                        className="w-full py-2 text-left text-black dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => { setIsMenuOpen(false); router.push('/dashboard'); }}
                                        className="w-full py-2 text-left text-black dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start p-0 h-auto text-red-600 hover:text-red-700 hover:bg-transparent"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-row gap-3 pt-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex-1 py-2 text-sm font-medium text-center border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex-1 py-2 text-sm font-medium text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

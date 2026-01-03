'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaEnvelope,
  FaInfoCircle,
  FaCogs,
} from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export default function ResponsiveNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-transparent shadow-md font-poppins">
      <div className="container mx-auto px-6 lg:px-12 flex items-center h-16">
        {/* Left Section: Logo */}
        <div className="flex-1 md:flex-initial md:w-1/4 flex items-center">
          <div className="text-xl font-bold text-black tracking-tight whitespace-nowrap">Neuro Kodes</div>
        </div>

        {/* Center Section: Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <ul className="flex space-x-8 text-sm font-medium text-black">
            <li>
              <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="flex items-center hover:text-blue-600 transition-colors">
                <FaCogs className="mr-2" /> Services
              </Link>
            </li>
            <li>
              <Link href="/managing" className="flex items-center hover:text-blue-600 transition-colors">
                <FaUsers className="mr-2" /> Managing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center hover:text-blue-600 transition-colors">
                <FaEnvelope className="mr-2" /> Contact
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center hover:text-blue-600 transition-colors">
                <FaInfoCircle className="mr-2" /> About
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Auth/User (Desktop) + Hamburger (Mobile) */}
        <div className="flex-1 md:flex-initial md:w-1/4 flex items-center justify-end">
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {user.name ? user.name[0] : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 mt-2" align="end">
                  {/* ... same popover content ... */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="font-bold text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                  <div className="p-1 space-y-1 mt-1">
                    <button
                      onClick={() => router.push('/profile')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Dashboard
                    </button>
                  </div>
                  <div className="p-1 mt-1 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100 shadow-md">
          <div className="px-6 py-6 space-y-6">
            {/* User Profile Section in Mobile */}
            {user && (
              <div className="flex items-center space-x-4 p-3 border-b border-gray-300">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user.name ? user.name[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-black truncate">{user.name}</div>
                  <div className="text-xs text-gray-600 truncate">{user.email}</div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <ul className="space-y-4 text-black">
              <li>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-blue-600 transition-colors">
                  <FaHome className="mr-3" /> Home
                </Link>
              </li>
              <li>
                <Link href="/services" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-blue-600 transition-colors">
                  <FaCogs className="mr-3" /> Services
                </Link>
              </li>
              <li>
                <Link href="/managing" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-blue-600 transition-colors">
                  <FaUsers className="mr-3" /> Managing
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-blue-600 transition-colors">
                  <FaEnvelope className="mr-3" /> Contact
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center py-2 hover:text-blue-600 transition-colors">
                  <FaInfoCircle className="mr-3" /> About
                </Link>
              </li>
            </ul>

            {/* User Actions / Auth */}
            <div className="pt-4 border-t border-gray-300 flex flex-col space-y-4">
              {user ? (
                <>
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push('/profile'); }}
                    className="w-full py-2 text-left text-black hover:text-blue-600 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push('/dashboard'); }}
                    className="w-full py-2 text-left text-black hover:text-blue-600 transition-colors"
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
                <div className="flex flex-col space-y-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2 border border-blue-600 text-blue-600 rounded text-center hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition"
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

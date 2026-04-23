"use client";

import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/store/useCartStore";
import { Search, ShoppingBag, User as UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const { user, logout } = useAuth();
  const totalItems = useCartStore((state) => state.totalItems());
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-3xl font-black text-[var(--color-primary)] tracking-tighter">
              CRAVINGS
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl px-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-full leading-5 bg-gray-50 dark:bg-white/5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-all"
                placeholder="Search 'Quick breakfast'"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[var(--color-primary)] rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="font-medium text-sm hidden sm:block">{user.name}</span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white dark:bg-[#1a1a1a] ring-1 ring-black ring-opacity-5 dark:ring-white/10"
                    >
                      {user.role === "Admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {user.role === "Sub-admin" && (
                        <Link
                          href="/sub-admin"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                        >
                          Sub-admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] px-5 py-2.5 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-white/10 rounded-full leading-5 bg-gray-50 dark:bg-white/5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-all"
              placeholder="Search 'Quick breakfast'"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

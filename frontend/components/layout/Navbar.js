'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { user, setUser } = useAuthStore();

  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
          <span className="text-2xl">🛒</span>
          ShopSphere
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Products
          </Link>
          {user && (
            <span className="text-sm text-gray-500">
              Hi, {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-gray-600 hover:text-gray-900"
            aria-label="Open cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Auth buttons */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="hidden md:block text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/auth/login" className="hidden md:block text-sm text-brand-600 hover:underline font-medium">
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Products
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left py-2 text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-brand-600 hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
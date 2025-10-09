

'use client';

import { Logo } from '@/components/ui/logo';
import { NavLink } from '@/components/ui/nav-link';
import { NAVIGATION_LINKS, EXTERNAL_LINKS } from '@/config/app.config';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-lg  ' 
            : 'bg-white'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link 
              href="/" 
              aria-label="Go to homepage"
              className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
            >
              <Logo size="md" />
            </Link>

            <nav 
              className="hidden lg:flex items-center gap-2" 
              role="navigation" 
              aria-label="Main navigation"
            >
              {NAVIGATION_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  hasDropdown={link.hasDropdown}
                />
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                href={EXTERNAL_LINKS.login}
                className="text-base font-bold text-cod-gray-800 dark:text-cod-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200 px-6 py-2.5 rounded-lg border-2 border-cod-gray-300 dark:border-cod-gray-600 hover:border-blue-700 dark:hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/20 dark:hover:to-blue-900/20 tracking-wide"
              >
                Log in
              </Link>
              
              <Link
                href={EXTERNAL_LINKS.signup}
                className="rounded-lg px-6 py-2.5 theme-btn-primary transition-all duration-200 text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 tracking-wide"
              >
                Try for free
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-cod-gray-700 dark:text-cod-gray-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/20 dark:hover:to-blue-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700/20 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              ) : (
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            className="fixed top-16 left-0 right-0 bottom-0 bg-white dark:bg-cod-gray-950 border-t border-cod-gray-200 dark:border-cod-gray-700 overflow-y-auto animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-6 space-y-6">
              <nav className="space-y-1" aria-label="Mobile navigation">
                {NAVIGATION_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 text-base font-bold text-cod-gray-800 dark:text-cod-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/20 dark:hover:to-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg transition-all duration-200 tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-cod-gray-200 dark:border-cod-gray-700" />

              <div className="space-y-3">
                <Link
                  href={EXTERNAL_LINKS.login}
                  className="block px-4 py-3 text-center text-base font-bold text-cod-gray-800 dark:text-cod-gray-200 hover:text-blue-700 dark:hover:text-blue-400 bg-cod-gray-50 dark:bg-cod-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/20 dark:hover:to-blue-900/20 rounded-lg transition-all duration-200 tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href={EXTERNAL_LINKS.signup}
                  className="block px-4 py-3 text-center text-base font-bold theme-btn-primary rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105 tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
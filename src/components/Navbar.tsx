'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { href: '/salary-calculator', key: 'salaryCalculator' },
  { href: '/calculator', key: 'getStarted' },
  { href: '/about-us', key: 'aboutUs' },
  { href: '/guides', key: 'guides' },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const { logo } = siteConfig;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#F5F5F0] border-b border-black border-opacity-10 transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105"
                onClick={closeMobileMenu}
              >
                <Image
                  src={logo.image}
                  alt={logo.linkText}
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-black hover:opacity-70 transition-all duration-300 font-normal text-xs tracking-[0.05em] uppercase relative group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {t(link.key).toUpperCase()}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              <LanguageSwitcher />
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-black hover:opacity-70 transition-opacity"
                aria-label={t('toggleMenu')}
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#F5F5F0] z-50 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="text-black hover:opacity-70 transition-all duration-300 font-normal text-xs tracking-[0.05em] uppercase border-b border-black border-opacity-10 pb-4"
                >
                  {t(link.key).toUpperCase()}
                </Link>
              ))}
              <div className="pt-2">
                <LanguageSwitcher className="w-full" />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

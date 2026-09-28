import { useState } from 'react';
import type { Page, CartItem } from '../data';

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page, productId?: string | number) => void;
  cartItems: CartItem[];
  wishlistCount: number;
}

export default function Header({ currentPage, navigate, cartItems, wishlistCount }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'About', page: 'home' },
    { label: 'Contact', page: 'home' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8D5B0]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex flex-col items-start leading-none cursor-pointer"
          >
            <span className="font-display text-2xl font-semibold tracking-widest text-[#2C1810]">
              AMÉORA
            </span>
            <span className="text-[8px] tracking-[0.35em] text-[#9E8E80] uppercase mt-0.5 font-body">
              Fine Jewellery
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, page }) => (
              <button
                key={label}
                onClick={() => navigate(page)}
                className={`text-sm tracking-widest uppercase font-body transition-colors duration-200 ${
                  currentPage === page && label !== 'About' && label !== 'Contact'
                    ? 'text-[#C9A96E]'
                    : 'text-[#5C3D2E] hover:text-[#C9A96E]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#5C3D2E] hover:text-[#C9A96E] transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('account')}
              className="relative text-[#5C3D2E] hover:text-[#C9A96E] transition-colors"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C9A96E] text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => navigate('auth')}
              className="text-[#5C3D2E] hover:text-[#C9A96E] transition-colors"
              aria-label="Account"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('cart')}
              className="relative text-[#5C3D2E] hover:text-[#C9A96E] transition-colors"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#2C1810] text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin */}
            <button
              onClick={() => navigate('admin')}
              className="hidden lg:flex text-[#5C3D2E] hover:text-[#C9A96E] transition-colors"
              aria-label="Admin"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#5C3D2E]"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Search rings, necklaces, bracelets…"
                className="w-full px-4 py-2.5 pl-10 bg-[#F0E8DC] border border-[#E8D5B0] rounded-none text-sm text-[#2C1810] placeholder:text-[#9E8E80] focus:outline-none focus:border-[#C9A96E] font-body"
                autoFocus
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-[#9E8E80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-6 border-t border-[#E8D5B0]/60 mt-2 pt-4 animate-fade-up">
            <nav className="flex flex-col gap-4">
              {navLinks.map(({ label, page }) => (
                <button
                  key={label}
                  onClick={() => { navigate(page); setMobileOpen(false); }}
                  className="text-sm tracking-widest uppercase text-[#5C3D2E] hover:text-[#C9A96E] text-left font-body transition-colors"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => { navigate('admin'); setMobileOpen(false); }}
                className="text-sm tracking-widest uppercase text-[#9E8E80] hover:text-[#C9A96E] text-left font-body transition-colors"
              >
                Admin
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


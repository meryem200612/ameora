import { useState } from 'react';
import type { Page } from '../data';
import { api } from '../lib/api';

interface FooterProps {
  navigate: (page: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="bg-[#2C1810] text-[#C8BAB0]">
      {/* Newsletter strip */}
      <div className="border-b border-[#5C3D2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl italic text-[#E8D5B0]">Stay in the world of Améora</p>
            <p className="text-sm text-[#9E8E80] mt-1">New arrivals, exclusive offers, and stories of jewellery.</p>
          </div>
          <div className="flex w-full md:w-auto gap-0">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="flex-1 md:w-72 px-4 py-3 bg-[#3D2418] border border-[#5C3D2E] text-[#E8D5B0] placeholder:text-[#8B6050] text-sm focus:outline-none focus:border-[#C9A96E] font-body"
            />
            <button onClick={() => api.newsletter(email).then(() => setSubscribed(true)).catch(() => undefined)} className="px-6 py-3 bg-[#C9A96E] text-[#2C1810] text-xs tracking-widest uppercase font-medium hover:bg-[#E8D5B0] transition-colors font-body whitespace-nowrap">
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <p className="font-display text-2xl tracking-widest text-[#E8D5B0]">AMÉORA</p>
            <p className="text-[8px] tracking-[0.35em] text-[#9E8E80] uppercase mt-0.5">Fine Jewellery</p>
          </div>
          <p className="text-sm text-[#9E8E80] leading-relaxed mt-4">
            Crafted with intention. Worn with purpose. Each piece is a quiet declaration of elegance.
          </p>
          {/* Social */}
          <div className="flex gap-4 mt-6">
            {['instagram', 'pinterest', 'facebook'].map((social) => (
              <a key={social} href="#" className="text-[#9E8E80] hover:text-[#C9A96E] transition-colors" aria-label={social}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                  {social === 'pinterest' && <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>}
                  {social === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-[#E8D5B0] mb-5 font-body">Shop</h4>
          <ul className="space-y-3">
            {['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'New Arrivals', 'Best Sellers', 'Sale'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => navigate('shop')}
                  className="text-sm text-[#9E8E80] hover:text-[#C9A96E] transition-colors font-body"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-[#E8D5B0] mb-5 font-body">Company</h4>
          <ul className="space-y-3">
            {['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers', 'Affiliates'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-[#9E8E80] hover:text-[#C9A96E] transition-colors font-body">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs tracking-widest uppercase text-[#E8D5B0] mb-5 font-body">Support</h4>
          <ul className="space-y-3">
            {['Contact Us', 'Shipping & Returns', 'Ring Size Guide', 'Care Instructions', 'FAQ', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-[#9E8E80] hover:text-[#C9A96E] transition-colors font-body">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#3D2418] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8B6050] font-body">
          <p>© 2026 Améora Fine Jewellery. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

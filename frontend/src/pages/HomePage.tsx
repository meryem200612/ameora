import { useState } from 'react';
import { products, testimonials } from '../data';
import type { Page, Product, CartItem } from '../data';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  navigate: (page: Page, productId?: string | number) => void;
  onAddToCart: (product: Product) => void;
  wishlist: (string | number)[];
  onToggleWishlist: (id: string | number) => void;
}

const categories = [
  {
    name: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=700&fit=crop&auto=format',
    count: 24,
  },
  {
    name: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=700&fit=crop&auto=format',
    count: 31,
  },
  {
    name: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=700&fit=crop&auto=format',
    count: 18,
  },
  {
    name: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=700&fit=crop&auto=format',
    count: 27,
  },
];

export default function HomePage({ navigate, onAddToCart, wishlist, onToggleWishlist }: HomePageProps) {
  const bestsellers = products.filter((p) => p.badge === 'bestseller' || p.rating >= 4.8).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="bg-[#FAF8F5]">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-[#2C1810]">
          <img
            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&h=1000&fit=crop&auto=format"
            alt="Elegant jewelry"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/80 via-[#2C1810]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-lg">
            <p className="text-[#C9A96E] text-xs tracking-[0.4em] uppercase font-body mb-6 animate-fade-up">
              New Collection — Autumn 2026
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#FAF8F5] leading-[1.08] mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Jewellery<br />
              <em className="italic text-[#C9A96E]">made to</em><br />
              last forever
            </h1>
            <p className="text-[#C8BAB0] text-base leading-relaxed mb-10 font-body animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Each piece is a quiet declaration — handcrafted with precision, designed with intention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => navigate('shop')}
                className="px-8 py-4 bg-[#C9A96E] text-[#2C1810] text-sm tracking-widest uppercase font-medium hover:bg-[#E8D5B0] transition-colors font-body"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('shop')}
                className="px-8 py-4 border border-[#C8BAB0]/60 text-[#E8D5B0] text-sm tracking-widest uppercase font-medium hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors font-body"
              >
                Discover Collection
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C8BAB0]/60">
          <span className="text-[9px] tracking-widest uppercase font-body">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#C9A96E]/60 to-transparent" />
        </div>
      </section>

      {/* ── Promise strip ─────────────────────────────────────────── */}
      <section className="border-y border-[#E8D5B0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '✦', label: 'Free shipping', sub: 'On orders over $150' },
            { icon: '◈', label: 'Authenticity', sub: 'Certified fine jewellery' },
            { icon: '◇', label: '30-day returns', sub: 'Hassle-free policy' },
            { icon: '◉', label: 'Expert support', sub: 'Available 7 days a week' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-[#C9A96E] text-lg">{icon}</span>
              <div>
                <p className="text-xs tracking-widest uppercase text-[#2C1810] font-body">{label}</p>
                <p className="text-xs text-[#9E8E80] font-body">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Browse by category</p>
          <h2 className="font-display text-4xl font-semibold text-[#2C1810]">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate('shop')}
              className="group relative overflow-hidden aspect-[3/4] bg-[#F0E8DC]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <p className="font-display text-xl text-white">{cat.name}</p>
                <p className="text-[10px] tracking-widest text-[#E8D5B0] uppercase font-body mt-1">
                  {cat.count} pieces
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────── */}
      <section className="bg-[#F0E8DC]/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Most loved</p>
              <h2 className="font-display text-4xl font-semibold text-[#2C1810]">Best Sellers</h2>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="text-xs tracking-widest uppercase text-[#5C3D2E] hover:text-[#C9A96E] transition-colors font-body border-b border-[#C9A96E] pb-0.5"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={(id) => navigate('product', id)}
                onAddToCart={onAddToCart}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          <div className="relative overflow-hidden bg-[#2C1810] min-h-[300px] lg:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&h=600&fit=crop&auto=format"
              alt="Craftsmanship"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
          <div className="flex items-center bg-[#2C1810] px-10 lg:px-16 py-16">
            <div className="max-w-md">
              <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-6">Our Promise</p>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-[#FAF8F5] leading-snug mb-6">
                Crafted with<br />
                <em className="italic text-[#C9A96E]">enduring</em><br />
                care
              </h2>
              <p className="text-[#9E8E80] text-sm leading-relaxed mb-8 font-body">
                Every Améora piece passes through the hands of master jewellers who have refined their craft over decades. We use only ethically sourced gemstones and recycled precious metals — beauty that carries no burden.
              </p>
              <button
                onClick={() => navigate('shop')}
                className="px-8 py-3.5 border border-[#C9A96E] text-[#C9A96E] text-xs tracking-widest uppercase font-body hover:bg-[#C9A96E] hover:text-[#2C1810] transition-colors"
              >
                Discover Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Just landed</p>
            <h2 className="font-display text-4xl font-semibold text-[#2C1810]">New Arrivals</h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs tracking-widest uppercase text-[#5C3D2E] hover:text-[#C9A96E] transition-colors font-body border-b border-[#C9A96E] pb-0.5"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={(id) => navigate('product', id)}
              onAddToCart={onAddToCart}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────────────── */}
      <section className="bg-[#C9A96E]/10 border-y border-[#E8D5B0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="font-display text-3xl sm:text-4xl text-[#2C1810] mb-2">
            Complimentary engraving on all rings
          </p>
          <p className="text-sm text-[#8B6050] font-body mb-6">For a limited time — make it personal.</p>
          <button
            onClick={() => navigate('shop')}
            className="px-8 py-3.5 bg-[#2C1810] text-[#E8D5B0] text-xs tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
          >
            Shop Rings
          </button>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Client stories</p>
          <h2 className="font-display text-4xl font-semibold text-[#2C1810] mb-14">Words from our clients</h2>

          <div className="relative">
            <div className="text-[#C9A96E] text-6xl font-display leading-none mb-6">"</div>
            <blockquote className="font-display text-xl sm:text-2xl italic text-[#2C1810] leading-relaxed mb-8">
              {testimonials[activeTestimonial].text}
            </blockquote>
            <div className="flex flex-col items-center gap-2">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].author}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E8D5B0]"
              />
              <p className="font-body font-medium text-[#2C1810]">{testimonials[activeTestimonial].author}</p>
              <p className="text-xs text-[#9E8E80] font-body">{testimonials[activeTestimonial].location}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeTestimonial ? 'bg-[#C9A96E]' : 'bg-[#C8BAB0]'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram-style grid ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-8">
          <p className="text-[#9E8E80] text-xs tracking-[0.3em] uppercase font-body">#AmeoraJewellery — follow us on Instagram</p>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {[
            'photo-1605100804763-247f67b3557e',
            'photo-1611652022419-a9419f74343d',
            'photo-1573408301185-9519f94816b5',
            'photo-1535632066927-ab7c9ab60908',
            'photo-1599643478518-a784e5dc4c8f',
            'photo-1524592094714-0f0654e20314',
          ].map((id, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-[#F0E8DC] group cursor-pointer">
              <img
                src={`https://images.unsplash.com/${id}?w=300&h=300&fit=crop&auto=format`}
                alt="Instagram"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


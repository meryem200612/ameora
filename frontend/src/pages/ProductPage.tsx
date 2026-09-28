import { useState } from 'react';
import { products } from '../data';
import type { Page, Product } from '../data';
import ProductCard from '../components/ProductCard';

interface ProductPageProps {
  productId: string | number;
  navigate: (page: Page, productId?: string | number) => void;
  onAddToCart: (product: Product, qty?: number) => void;
  wishlist: (string | number)[];
  onToggleWishlist: (id: string | number) => void;
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`${s} ${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const sampleReviews = [
  { author: 'Emma L.', rating: 5, date: 'Sep 2026', text: 'Absolutely stunning. The craftsmanship is exceptional — I\'ve worn it daily for a month and it looks as brilliant as the day it arrived.' },
  { author: 'Chloé M.', rating: 5, date: 'Aug 2026', text: 'The packaging was a work of art in itself. The piece is exactly as described and photographed — no surprises except how beautiful it is in person.' },
  { author: 'Natasha R.', rating: 4, date: 'Jul 2026', text: 'Elegant and refined. Shipping was fast and the ring fits perfectly. Would have loved a certificate of authenticity included.' },
];

export default function ProductPage({ productId, navigate, onAddToCart, wishlist, onToggleWishlist }: ProductPageProps) {
  const product = products.find((p) => p.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#9E8E80] font-body">
        Product not found.
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-[#9E8E80] font-body">
          <button onClick={() => navigate('home')} className="hover:text-[#C9A96E] transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('shop')} className="hover:text-[#C9A96E] transition-colors">Shop</button>
          <span>/</span>
          <span className="text-[#5C3D2E] capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[#2C1810]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square bg-[#F0E8DC] overflow-hidden">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 bg-[#F0E8DC] overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#C9A96E]' : 'border-transparent hover:border-[#E8D5B0]'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:pt-4 space-y-6">
            {/* Category + Badge */}
            <div className="flex items-center gap-3">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#9E8E80] font-body capitalize">{product.category}</p>
              {product.badge && (
                <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 font-body font-medium ${
                  product.badge === 'new' ? 'bg-[#2C1810] text-[#E8D5B0]' :
                  product.badge === 'bestseller' ? 'bg-[#C9A96E] text-[#2C1810]' :
                  'bg-[#8B6050] text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2C1810] leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} size="md" />
              <span className="text-sm text-[#2C1810] font-medium font-body">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-[#9E8E80] font-body">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-2 border-b border-[#E8D5B0]">
              <span className="font-display text-3xl text-[#2C1810]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-[#9E8E80] line-through font-body">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-sm text-[#8B6050] font-body">Save ${product.originalPrice - product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#5C3D2E] text-sm leading-relaxed font-body">{product.description}</p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] mb-1">Material</p>
                <p className="text-[#2C1810]">{product.material}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] mb-1">Stone Color</p>
                <p className="text-[#2C1810]">{product.color}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] mb-1">Availability</p>
                <p className={product.stock > 5 ? 'text-green-700' : product.stock > 0 ? 'text-amber-700' : 'text-red-700'}>
                  {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] mb-1">SKU</p>
                <p className="text-[#2C1810]">AME-{String(product.id).padStart(4, '0')}</p>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] mb-3 font-body">Quantity</p>
              <div className="flex items-center border border-[#E8D5B0] w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#5C3D2E] hover:text-[#C9A96E] hover:bg-[#F0E8DC] transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-medium text-[#2C1810] font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#5C3D2E] hover:text-[#C9A96E] hover:bg-[#F0E8DC] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 text-sm tracking-widest uppercase font-medium font-body transition-colors ${
                  addedToCart
                    ? 'bg-[#5C3D2E] text-[#E8D5B0]'
                    : 'bg-[#2C1810] text-[#E8D5B0] hover:bg-[#5C3D2E] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {addedToCart ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`py-4 px-6 border text-sm tracking-widest uppercase font-body transition-colors ${
                  isWishlisted
                    ? 'border-[#C9A96E] text-[#C9A96E]'
                    : 'border-[#E8D5B0] text-[#5C3D2E] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                }`}
              >
                {isWishlisted ? '♥ Saved' : '♡ Wishlist'}
              </button>
            </div>

            {/* Shipping perks */}
            <div className="space-y-2 pt-2 border-t border-[#E8D5B0]">
              {[
                'Free shipping on orders over $150',
                'Complimentary gift wrapping available',
                'Easy 30-day returns',
              ].map((perk) => (
                <p key={perk} className="flex items-center gap-2 text-xs text-[#8B6050] font-body">
                  <span className="text-[#C9A96E]">✦</span> {perk}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 pt-12 border-t border-[#E8D5B0]">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] font-body mb-2">Client Reviews</p>
              <h2 className="font-display text-3xl text-[#2C1810]">What our clients say</h2>
            </div>
            <div className="flex items-center gap-2">
              <Stars rating={product.rating} size="md" />
              <span className="text-sm text-[#5C3D2E] font-body">{product.rating} / 5 ({product.reviews})</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {sampleReviews.map((r, i) => (
              <div key={i} className="p-6 bg-[#F0E8DC]/50 border border-[#E8D5B0]">
                <div className="flex items-center justify-between mb-3">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-[#9E8E80] font-body">{r.date}</span>
                </div>
                <p className="text-sm text-[#5C3D2E] leading-relaxed font-body mb-3">"{r.text}"</p>
                <p className="text-xs font-medium text-[#2C1810] font-body">— {r.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8D5B0]">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] font-body mb-2">You may also love</p>
                <h2 className="font-display text-3xl text-[#2C1810]">Related Pieces</h2>
              </div>
              <button
                onClick={() => navigate('shop')}
                className="text-xs tracking-widest uppercase text-[#5C3D2E] hover:text-[#C9A96E] font-body border-b border-[#C9A96E] pb-0.5 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
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
        )}
      </div>
    </div>
  );
}


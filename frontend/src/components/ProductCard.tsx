import type { Product, CartItem } from '../data';

interface ProductCardProps {
  product: Product;
  onView: (id: string | number) => void;
  onAddToCart: (product: Product) => void;
  wishlist: (string | number)[];
  onToggleWishlist: (id: string | number) => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, onView, onAddToCart, wishlist, onToggleWishlist }: ProductCardProps) {
  const isWishlisted = wishlist.includes(product.id);

  const badgeStyle: Record<string, string> = {
    new: 'bg-[#2C1810] text-[#E8D5B0]',
    bestseller: 'bg-[#C9A96E] text-[#2C1810]',
    sale: 'bg-[#8B6050] text-white',
  };

  return (
    <div className="group relative bg-[#FAF8F5] cursor-pointer">
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#F0E8DC] aspect-square"
        onClick={() => onView(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[9px] tracking-widest uppercase px-2 py-1 font-medium font-body ${badgeStyle[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          aria-label="Wishlist"
        >
          <svg
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-[#C9A96E] fill-[#C9A96E]' : 'text-[#5C3D2E]'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full py-3 bg-[#2C1810]/90 backdrop-blur-sm text-[#E8D5B0] text-xs tracking-widest uppercase font-body hover:bg-[#2C1810] transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2" onClick={() => onView(product.id)}>
        <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-1">{product.category}</p>
        <h3 className="font-display text-base font-medium text-[#2C1810] leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-[#9E8E80] font-body">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-medium text-[#2C1810] font-body">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#9E8E80] line-through font-body">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

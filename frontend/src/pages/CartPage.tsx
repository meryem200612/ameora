import type { Page, CartItem } from '../data';

interface CartPageProps {
  cartItems: CartItem[];
  navigate: (page: Page, productId?: string | number) => void;
  onUpdateQty: (productId: string | number, qty: number) => void;
  onRemove: (productId: string | number) => void;
}

export default function CartPage({ cartItems, navigate, onUpdateQty, onRemove }: CartPageProps) {
  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#F0E8DC] border-b border-[#E8D5B0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-2">Améora</p>
          <h1 className="font-display text-4xl font-semibold text-[#2C1810]">Your Bag</h1>
          <p className="text-[#8B6050] text-sm font-body mt-1">{cartItems.length === 0 ? 'Empty' : `${cartItems.reduce((s, i) => s + i.quantity, 0)} items`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 text-[#C8BAB0]">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <p className="font-display text-2xl italic text-[#9E8E80]">Your bag is empty</p>
            <p className="text-sm text-[#C8BAB0] font-body mt-2">Discover pieces crafted for you</p>
            <button
              onClick={() => navigate('shop')}
              className="mt-8 px-8 py-4 bg-[#2C1810] text-[#E8D5B0] text-xs tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
            >
              Explore the Collection
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Items */}
            <div className="flex-1 space-y-6">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-5 pb-6 border-b border-[#E8D5B0]">
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F0E8DC] overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => navigate('product', product.id)}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] font-body capitalize">{product.category}</p>
                        <h3
                          className="font-display text-lg text-[#2C1810] cursor-pointer hover:text-[#C9A96E] transition-colors"
                          onClick={() => navigate('product', product.id)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#9E8E80] font-body mt-1">{product.material}</p>
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="text-[#C8BAB0] hover:text-[#8B6050] transition-colors shrink-0"
                        aria-label="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#E8D5B0]">
                        <button
                          onClick={() => quantity === 1 ? onRemove(product.id) : onUpdateQty(product.id, quantity - 1)}
                          className="w-9 h-9 text-[#5C3D2E] hover:text-[#C9A96E] hover:bg-[#F0E8DC] transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-sm font-body">{quantity}</span>
                        <button
                          onClick={() => onUpdateQty(product.id, quantity + 1)}
                          className="w-9 h-9 text-[#5C3D2E] hover:text-[#C9A96E] hover:bg-[#F0E8DC] transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg text-[#2C1810]">${(product.price * quantity).toFixed(2)}</p>
                        {quantity > 1 && (
                          <p className="text-xs text-[#9E8E80] font-body">${product.price} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate('shop')}
                className="text-xs tracking-widest uppercase text-[#5C3D2E] hover:text-[#C9A96E] font-body border-b border-[#C9A96E] pb-0.5 transition-colors"
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-[#F0E8DC] p-8 space-y-5">
                <h2 className="font-display text-xl text-[#2C1810]">Order Summary</h2>

                <div className="space-y-3 text-sm font-body">
                  <div className="flex justify-between text-[#5C3D2E]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#5C3D2E]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-700' : ''}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#9E8E80]">Add ${(150 - subtotal).toFixed(2)} more for free shipping</p>
                  )}
                </div>

                <div className="border-t border-[#E8D5B0] pt-4 flex justify-between font-body">
                  <span className="font-medium text-[#2C1810]">Total</span>
                  <span className="font-display text-xl text-[#2C1810]">${total.toFixed(2)}</span>
                </div>

                {/* Promo */}
                <div className="flex gap-0 border border-[#E8D5B0]">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2.5 bg-white text-sm text-[#2C1810] placeholder:text-[#C8BAB0] focus:outline-none font-body"
                  />
                  <button className="px-4 bg-[#2C1810] text-[#E8D5B0] text-xs tracking-widest font-body hover:bg-[#5C3D2E] transition-colors">Apply</button>
                </div>

                <button
                  onClick={() => navigate('checkout')}
                  className="w-full py-4 bg-[#C9A96E] text-[#2C1810] text-sm tracking-widest uppercase font-medium font-body hover:bg-[#E8D5B0] transition-colors"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-xs text-[#9E8E80] font-body">Secure checkout — SSL encrypted</p>

                <div className="flex justify-center gap-3 opacity-50">
                  {['VISA', 'MC', 'AMEX', 'PayPal'].map((brand) => (
                    <span key={brand} className="text-[9px] border border-[#C8BAB0] px-1.5 py-0.5 text-[#5C3D2E] font-body tracking-wide">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import { useState } from 'react';
import type { Page, CartItem } from '../data';

interface CheckoutPageProps {
  cartItems: CartItem[];
  navigate: (page: Page) => void;
  onOrderPlaced: () => void;
  onPlaceOrder?: (data: Record<string, unknown>) => Promise<void>;
}

type Step = 'info' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage({ cartItems, navigate, onOrderPlaced, onPlaceOrder }: CheckoutPageProps) {
  const [step, setStep] = useState<Step>('info');
  const [info, setInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'United States' });
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState({ card: '', name: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shippingCost = delivery === 'express' ? 25 : delivery === 'overnight' ? 45 : subtotal >= 150 ? 0 : 12;
  const total = subtotal + shippingCost;

  const steps: { key: Step; label: string }[] = [
    { key: 'info', label: 'Information' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
  ];

  const handlePlaceOrder = async () => {
    setError('');
    try {
      await onPlaceOrder?.({
        paymentToken: `card-form-${payment.card.slice(-4) || 'guest'}`,
        deliveryMethod: delivery,
        shippingAddress: { ...address, email: info.email, firstName: info.firstName, lastName: info.lastName, phone: info.phone },
      });
      onOrderPlaced();
      setStep('confirmation');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to place order');
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#C9A96E]/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-[#C9A96E] text-2xl">✓</span>
          </div>
          <p className="text-[#C9A96E] text-[10px] tracking-[0.4em] uppercase font-body mb-3">Order Confirmed</p>
          <h1 className="font-display text-4xl font-semibold text-[#2C1810] mb-4">Thank you, {info.firstName || 'dear client'}.</h1>
          <p className="text-[#8B6050] text-sm font-body leading-relaxed mb-2">
            Your order has been received and is being prepared with care. A confirmation email will arrive shortly at <strong>{info.email || 'your inbox'}</strong>.
          </p>
          <p className="text-[#9E8E80] text-xs font-body mb-8">Order #AME-{Math.floor(Math.random() * 90000) + 10000}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('account')}
              className="px-6 py-3 border border-[#E8D5B0] text-sm text-[#5C3D2E] hover:border-[#C9A96E] font-body tracking-widest uppercase transition-colors"
            >
              View Order
            </button>
            <button
              onClick={() => navigate('shop')}
              className="px-6 py-3 bg-[#2C1810] text-[#E8D5B0] text-sm tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <button onClick={() => navigate('home')} className="font-display text-2xl tracking-widest text-[#2C1810]">AMÉORA</button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map(({ key, label }, i) => (
            <div key={key} className="flex items-center">
              <button
                onClick={() => {
                  if (key === 'info') setStep('info');
                  if (key === 'shipping' && (step === 'payment')) setStep('shipping');
                }}
                className={`flex items-center gap-2 text-xs tracking-widest uppercase font-body transition-colors ${step === key ? 'text-[#2C1810]' : 'text-[#C8BAB0]'}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step === key ? 'border-[#C9A96E] bg-[#C9A96E] text-[#2C1810]' : steps.indexOf(steps.find(s => s.key === step)!) > i ? 'border-[#C9A96E] bg-[#C9A96E]/20 text-[#C9A96E]' : 'border-[#E8D5B0] text-[#C8BAB0]'}`}>
                  {steps.indexOf(steps.find(s => s.key === step)!) > i ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < steps.length - 1 && <div className="w-12 sm:w-20 h-px bg-[#E8D5B0] mx-3" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step: Info */}
            {step === 'info' && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-[#2C1810]">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', key: 'firstName' as const },
                    { label: 'Last Name', key: 'lastName' as const },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">{label}</label>
                      <input
                        value={info[key]}
                        onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                        className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Email Address</label>
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                  />
                </div>

                <h2 className="font-display text-2xl text-[#2C1810] pt-4">Shipping Address</h2>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Address Line 1</label>
                  <input
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="123 Avenue des Fleurs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Address Line 2 (optional)</label>
                  <input
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="Apt, Suite, Floor"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">City</label>
                    <input
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">State</label>
                    <input
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">ZIP</label>
                    <input
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                  >
                    {['United States', 'France', 'United Kingdom', 'Germany', 'Italy', 'Spain', 'Canada', 'Australia'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setStep('shipping')}
                  className="w-full py-4 bg-[#2C1810] text-[#E8D5B0] text-sm tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step: Shipping */}
            {step === 'shipping' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-[#2C1810]">Delivery Method</h2>
                <div className="space-y-3">
                  {[
                    { key: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: subtotal >= 150 ? 'Free' : '$12.00' },
                    { key: 'express', label: 'Express Delivery', sub: '2–3 business days', price: '$25.00' },
                    { key: 'overnight', label: 'Overnight Delivery', sub: 'Next business day', price: '$45.00' },
                  ].map(({ key, label, sub, price }) => (
                    <label
                      key={key}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${delivery === key ? 'border-[#C9A96E] bg-[#C9A96E]/5' : 'border-[#E8D5B0] bg-white hover:border-[#C9A96E]/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value={key}
                          checked={delivery === key}
                          onChange={() => setDelivery(key)}
                          className="accent-[#C9A96E]"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#2C1810] font-body">{label}</p>
                          <p className="text-xs text-[#9E8E80] font-body">{sub}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#2C1810] font-body">{price}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('info')} className="flex-1 py-4 border border-[#E8D5B0] text-[#5C3D2E] text-sm tracking-widest uppercase font-body hover:border-[#C9A96E] transition-colors">Back</button>
                  <button onClick={() => setStep('payment')} className="flex-1 py-4 bg-[#2C1810] text-[#E8D5B0] text-sm tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* Step: Payment */}
            {step === 'payment' && (
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-[#2C1810]">Payment Details</h2>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Card Number</label>
                  <input
                    value={payment.card}
                    onChange={(e) => setPayment({ ...payment, card: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Name on Card</label>
                  <input
                    value={payment.name}
                    onChange={(e) => setPayment({ ...payment, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="SOPHIE LAURENT"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Expiry Date</label>
                    <input
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                      placeholder="MM / YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">CVV</label>
                    <input
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                      placeholder="•••"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#9E8E80] font-body flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                  Secured with 256-bit SSL encryption
                </p>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('shipping')} className="flex-1 py-4 border border-[#E8D5B0] text-[#5C3D2E] text-sm tracking-widest uppercase font-body hover:border-[#C9A96E] transition-colors">Back</button>
                  <button onClick={handlePlaceOrder} className="flex-1 py-4 bg-[#C9A96E] text-[#2C1810] text-sm tracking-widest uppercase font-medium font-body hover:bg-[#E8D5B0] transition-colors">Place Order — ${total.toFixed(2)}</button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-[#F0E8DC] p-6 sticky top-24">
              <h3 className="font-display text-lg text-[#2C1810] mb-5">Order Summary</h3>
              <div className="space-y-4 mb-5">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-white overflow-hidden shrink-0 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2C1810] text-white text-[9px] rounded-full flex items-center justify-center">{quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2C1810] font-body truncate">{product.name}</p>
                      <p className="text-xs text-[#9E8E80] font-body">{product.material}</p>
                    </div>
                    <p className="text-sm text-[#2C1810] font-body shrink-0">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E8D5B0] pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between text-[#5C3D2E]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5C3D2E]">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-medium text-[#2C1810] pt-2 border-t border-[#E8D5B0]">
                  <span>Total</span>
                  <span className="font-display text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


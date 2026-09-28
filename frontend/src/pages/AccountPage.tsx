import { useEffect, useState } from 'react';
import { products } from '../data';
import type { Page, Product } from '../data';
import ProductCard from '../components/ProductCard';
import { api, type AccountProfile, type Address, type Order } from '../lib/api';

interface AccountPageProps {
  navigate: (page: Page, productId?: string | number) => void;
  wishlist: (string | number)[];
  onToggleWishlist: (id: string | number) => void;
  onAddToCart: (product: Product) => void;
}

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses';

const statusColor: Record<string, string> = {
  Delivered: 'text-green-700 bg-green-50',
  'In Transit': 'text-amber-700 bg-amber-50',
  Processing: 'text-blue-700 bg-blue-50',
};

export default function AccountPage({ navigate, wishlist, onToggleWishlist, onAddToCart }: AccountPageProps) {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [message, setMessage] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  useEffect(() => {
    api.account().then((data) => { setProfile(data); setAddresses(data.addresses || []); }).catch(() => undefined);
    api.orders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'profile', label: 'Profile', icon: '◉' },
    { key: 'orders', label: 'Orders', icon: '◈' },
    { key: 'wishlist', label: 'Wishlist', icon: '♡' },
    { key: 'addresses', label: 'Addresses', icon: '◇' },
  ];

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#F0E8DC] border-b border-[#E8D5B0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
              <span className="font-display text-xl text-[#C9A96E]">{profile?.firstName?.[0] || 'A'}</span>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] font-body mb-1">My Account</p>
              <h1 className="font-display text-3xl text-[#2C1810]">{profile ? `${profile.firstName} ${profile.lastName}` : 'My Account'}</h1>
              <p className="text-sm text-[#9E8E80] font-body">Member since September 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-48 shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body transition-colors ${tab === key ? 'bg-[#C9A96E]/10 text-[#C9A96E] font-medium' : 'text-[#5C3D2E] hover:text-[#C9A96E] hover:bg-[#F0E8DC]'}`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-[#8B6050] hover:text-[#C9A96E] transition-colors mt-4">
                <span>→</span> Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Profile */}
            {tab === 'profile' && (
              <div className="space-y-8">
                <h2 className="font-display text-2xl text-[#2C1810]">Profile Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                  { label: 'First Name', key: 'firstName' as const, value: profile?.firstName || '' },
                  { label: 'Last Name', key: 'lastName' as const, value: profile?.lastName || '' },
                  { label: 'Email Address', key: 'email' as const, value: profile?.email || '' },
                  { label: 'Phone', key: 'phone' as const, value: profile?.phone || '' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">{label}</label>
                      <input
                        value={value}
                        onChange={(e) => setProfile((current) => current ? { ...current, [label === 'First Name' ? 'firstName' : label === 'Last Name' ? 'lastName' : label === 'Email Address' ? 'email' : 'phone']: e.target.value } : current)}
                        className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E8D5B0]">
                  <h3 className="font-display text-lg text-[#2C1810] mb-4">Change Password</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {['Current Password', 'New Password'].map((label) => (
                      <div key={label}>
                        <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">{label}</label>
                        <input type="password" value={label === 'Current Password' ? passwords.currentPassword : passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, [label === 'Current Password' ? 'currentPassword' : 'newPassword']: e.target.value })} className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm focus:outline-none focus:border-[#C9A96E] font-body" />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={async () => { if (!profile) return; await api.updateAccount(profile); if (passwords.currentPassword && passwords.newPassword) await api.updatePassword(passwords); setMessage('Changes saved'); }} className="px-8 py-3 bg-[#2C1810] text-[#E8D5B0] text-xs tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors">
                  Save Changes
                </button>
                {message && <p className="text-xs text-green-700 font-body">{message}</p>}
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-[#2C1810]">Order History</h2>
                {orders.map((order) => (
                  <div key={order.id} className="border border-[#E8D5B0] p-5 bg-white">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-medium text-[#2C1810] font-body">{order.id}</p>
                        <p className="text-xs text-[#9E8E80] font-body">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded font-body ${statusColor[order.status] || 'text-[#5C3D2E] bg-[#F0E8DC]'}`}>
                          {order.status}
                        </span>
                        <span className="font-display text-lg text-[#2C1810]">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#5C3D2E] font-body">{order.items.map((item) => `${item.productName} × ${item.quantity}`).join(' · ')}</p>
                    <div className="flex gap-3 mt-3">
                      <button className="text-xs text-[#C9A96E] hover:text-[#A8854A] font-body tracking-wide uppercase transition-colors">View Details</button>
                      <span className="text-[#E8D5B0]">|</span>
                      <button className="text-xs text-[#9E8E80] hover:text-[#C9A96E] font-body tracking-wide uppercase transition-colors">Reorder</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist */}
            {tab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-[#2C1810]">My Wishlist</h2>
                  <span className="text-sm text-[#9E8E80] font-body">{wishlistProducts.length} saved pieces</span>
                </div>
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-display text-xl italic text-[#9E8E80]">Your wishlist is empty</p>
                    <p className="text-sm text-[#C8BAB0] font-body mt-2">Heart pieces you love while browsing the shop</p>
                    <button onClick={() => navigate('shop')} className="mt-6 text-xs tracking-widest uppercase text-[#C9A96E] font-body border-b border-[#C9A96E] pb-0.5">
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlistProducts.map((p) => (
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
                )}
              </div>
            )}

            {/* Addresses */}
            {tab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-[#2C1810]">Saved Addresses</h2>
                  <button className="text-xs tracking-widest uppercase text-[#C9A96E] font-body border-b border-[#C9A96E] pb-0.5">+ Add New</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-5 border ${addr.isDefault ? 'border-[#C9A96E]' : 'border-[#E8D5B0]'} bg-white`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] tracking-widest uppercase font-body text-[#9E8E80]">{addr.label || 'Address'}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] tracking-widest uppercase bg-[#C9A96E]/20 text-[#C9A96E] px-2 py-0.5 font-body">Default</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[#2C1810] font-body">{addr.firstName} {addr.lastName}</p>
                      <p className="text-sm text-[#5C3D2E] font-body mt-1">{addr.line1}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}</p>
                      <div className="flex gap-3 mt-3">
                        <button className="text-xs text-[#C9A96E] font-body uppercase tracking-wide">Edit</button>
                        {!addr.isDefault && <button onClick={() => api.removeAddress(addr.id).then(() => setAddresses((items) => items.filter((item) => item.id !== addr.id)))} className="text-xs text-[#8B6050] font-body uppercase tracking-wide">Remove</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

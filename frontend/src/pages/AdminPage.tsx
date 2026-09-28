import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { products, salesData } from '../data';
import type { Page } from '../data';
import { api, toProduct, type Order } from '../lib/api';

interface AdminPageProps {
  navigate: (page: Page) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories';

const recentOrders = [
  { id: 'AME-31822', customer: 'Emma Thompson', items: 3, total: 638, status: 'In Transit', date: 'Sep 12, 2026' },
  { id: 'AME-31798', customer: 'Clara Dubois', items: 1, total: 485, status: 'Processing', date: 'Sep 11, 2026' },
  { id: 'AME-31756', customer: 'Mia Andersen', items: 2, total: 515, status: 'Delivered', date: 'Sep 10, 2026' },
  { id: 'AME-31730', customer: 'Isabella Romano', items: 1, total: 275, status: 'Delivered', date: 'Sep 09, 2026' },
  { id: 'AME-31701', customer: 'Natasha Reyes', items: 4, total: 920, status: 'Processing', date: 'Sep 08, 2026' },
  { id: 'AME-31680', customer: 'Sophie Laurent', items: 1, total: 195, status: 'Delivered', date: 'Sep 07, 2026' },
];

const statusStyle: Record<string, string> = {
  Delivered: 'bg-green-50 text-green-700',
  'In Transit': 'bg-amber-50 text-amber-700',
  Processing: 'bg-blue-50 text-blue-700',
};

const kpis = [
  { label: 'Total Revenue', value: '$196,300', change: '+18.4%', up: true, icon: '◈' },
  { label: 'Total Orders', value: '1,497', change: '+11.2%', up: true, icon: '◉' },
  { label: 'Total Customers', value: '842', change: '+8.7%', up: true, icon: '✦' },
  { label: 'Products', value: String(products.length), change: '+2 this week', up: true, icon: '◇' },
];

const categories = [
  { name: 'Rings', count: 4, revenue: 68400, stock: 45 },
  { name: 'Necklaces', count: 4, revenue: 55200, stock: 62 },
  { name: 'Bracelets', count: 4, revenue: 38700, stock: 58 },
  { name: 'Earrings', count: 4, revenue: 34000, stock: 103 },
];

export default function AdminPage({ navigate }: AdminPageProps) {
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [productSearch, setProductSearch] = useState('');
  const [adminProducts, setAdminProducts] = useState(products);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminCategories, setAdminCategories] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  useEffect(() => {
    api.adminDashboard().then(setDashboard).catch(() => undefined);
    api.adminProducts().then((items) => setAdminProducts((items as any[]).map(toProduct))).catch(() => undefined);
    api.adminOrders().then((items) => setAdminOrders(items)).catch(() => undefined);
    api.adminCategories().then((items) => setAdminCategories(items)).catch(() => undefined);
  }, []);

  const filteredProducts = adminProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const lowStock = adminProducts.filter((p) => p.stock <= 5);
  const kpis = [
    { label: 'Total Revenue', value: `$${Number(dashboard?.revenue || 0).toLocaleString()}`, change: 'Live', up: true, icon: '◈' },
    { label: 'Total Orders', value: String(dashboard?.orders || adminOrders.length), change: 'Live', up: true, icon: '◉' },
    { label: 'Total Customers', value: String(dashboard?.users || 0), change: 'Live', up: true, icon: '✦' },
    { label: 'Products', value: String(dashboard?.products || adminProducts.length), change: 'Live', up: true, icon: '◇' },
  ];

  const tabs: { key: AdminTab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
    { key: 'categories', label: 'Categories' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#2C1810] hidden lg:flex flex-col">
        <div className="p-6 border-b border-[#3D2418]">
          <p className="font-display text-xl tracking-widest text-[#E8D5B0]">AMÉORA</p>
          <p className="text-[8px] tracking-[0.3em] text-[#8B6050] uppercase mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors ${tab === key ? 'bg-[#C9A96E]/20 text-[#C9A96E]' : 'text-[#9E8E80] hover:text-[#E8D5B0] hover:bg-[#3D2418]'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#3D2418]">
          <button
            onClick={() => navigate('home')}
            className="w-full text-left px-4 py-2.5 text-sm text-[#8B6050] hover:text-[#C9A96E] font-body transition-colors"
          >
            ← Back to Store
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E8D5B0] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile tab switcher */}
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as AdminTab)}
              className="lg:hidden border border-[#E8D5B0] text-sm text-[#2C1810] px-3 py-1.5 focus:outline-none font-body"
            >
              {tabs.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </select>
            <h1 className="font-display text-xl text-[#2C1810] hidden lg:block capitalize">{tab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('home')}
              className="lg:hidden text-xs text-[#C9A96E] font-body tracking-widest uppercase"
            >
              ← Store
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
                <span className="text-xs text-[#C9A96E] font-display">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-[#2C1810] font-body">Admin</p>
                <p className="text-[10px] text-[#9E8E80] font-body">admin@amelora.com</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* ── Dashboard ──────────────────────────────────────────── */}
          {tab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPIs */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map(({ label, value, change, up, icon }) => (
                  <div key={label} className="bg-white border border-[#E8D5B0] p-5">
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] font-body">{label}</p>
                      <span className="text-[#C9A96E]">{icon}</span>
                    </div>
                    <p className="font-display text-2xl text-[#2C1810]">{value}</p>
                    <p className={`text-xs mt-1 font-body ${up ? 'text-green-600' : 'text-red-500'}`}>{change} vs last month</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white border border-[#E8D5B0] p-6">
                  <h3 className="font-display text-lg text-[#2C1810] mb-6">Revenue — 2026</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DC" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9E8E80', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9E8E80', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ background: '#2C1810', border: 'none', borderRadius: 0, color: '#E8D5B0', fontFamily: 'DM Sans', fontSize: 12 }}
                        formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} fill="url(#goldGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-[#E8D5B0] p-6">
                  <h3 className="font-display text-lg text-[#2C1810] mb-6">Orders per Month</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DC" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9E8E80', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9E8E80', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#2C1810', border: 'none', borderRadius: 0, color: '#E8D5B0', fontFamily: 'DM Sans', fontSize: 12 }}
                        formatter={(v) => [Number(v), 'Orders']}
                      />
                      <Bar dataKey="orders" fill="#C9A96E" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid xl:grid-cols-3 gap-6">
                {/* Recent orders */}
                <div className="xl:col-span-2 bg-white border border-[#E8D5B0] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg text-[#2C1810]">Recent Orders</h3>
                    <button onClick={() => setTab('orders')} className="text-xs tracking-widest uppercase text-[#C9A96E] font-body border-b border-[#C9A96E] pb-0.5">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E8D5B0]">
                          {['Order', 'Customer', 'Items', 'Total', 'Status'].map((h) => (
                            <th key={h} className="pb-3 text-left text-[10px] tracking-widest uppercase text-[#9E8E80] font-body font-normal">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E8DC]">
                        {recentOrders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-3 font-medium text-[#2C1810] font-body">{o.id}</td>
                            <td className="py-3 text-[#5C3D2E] font-body">{o.customer}</td>
                            <td className="py-3 text-[#9E8E80] font-body">{o.items}</td>
                            <td className="py-3 font-medium text-[#2C1810] font-body">${o.total}</td>
                            <td className="py-3">
                              <span className={`text-[10px] px-2 py-1 rounded font-body ${statusStyle[o.status]}`}>{o.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low stock */}
                <div className="bg-white border border-[#E8D5B0] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg text-[#2C1810]">Low Stock</h3>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 font-body">{lowStock.length} items</span>
                  </div>
                  <div className="space-y-4">
                    {lowStock.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F0E8DC] overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2C1810] font-body truncate">{p.name}</p>
                          <p className="text-xs text-[#9E8E80] font-body capitalize">{p.category}</p>
                        </div>
                        <span className={`text-xs font-medium font-body shrink-0 ${p.stock <= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                          {p.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Products ───────────────────────────────────────────── */}
          {tab === 'products' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products…"
                    className="w-full px-4 py-2.5 pl-9 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                  />
                  <svg className="absolute left-3 top-3 w-3.5 h-3.5 text-[#9E8E80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <button className="px-5 py-2.5 bg-[#C9A96E] text-[#2C1810] text-xs tracking-widest uppercase font-body hover:bg-[#E8D5B0] transition-colors whitespace-nowrap">
                  + Add Product
                </button>
              </div>

              <div className="bg-white border border-[#E8D5B0] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F0E8DC]">
                    <tr>
                      {['Product', 'Category', 'Price', 'Stock', 'Status', 'Rating', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-[#9E8E80] font-body font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DC]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#F0E8DC] overflow-hidden shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium text-[#2C1810] font-body whitespace-nowrap">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-[#5C3D2E] font-body">{p.category}</td>
                        <td className="px-4 py-3 font-medium text-[#2C1810] font-body">${p.price}</td>
                        <td className="px-4 py-3">
                          <span className={`font-body ${p.stock <= 3 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-green-700'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.badge ? (
                            <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 font-body ${
                              p.badge === 'new' ? 'bg-[#2C1810]/10 text-[#2C1810]' :
                              p.badge === 'bestseller' ? 'bg-[#C9A96E]/20 text-[#C9A96E]' :
                              'bg-[#8B6050]/10 text-[#8B6050]'
                            }`}>{p.badge}</span>
                          ) : (
                            <span className="text-[#9E8E80] font-body">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#2C1810] font-body">{p.rating} ★</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-xs text-[#C9A96E] hover:text-[#A8854A] font-body uppercase tracking-wide transition-colors">Edit</button>
                            <button className="text-xs text-[#8B6050] hover:text-red-600 font-body uppercase tracking-wide transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Orders ─────────────────────────────────────────────── */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                {['All', 'Processing', 'In Transit', 'Delivered'].map((f) => (
                  <button
                    key={f}
                    className="px-4 py-2 border border-[#E8D5B0] text-xs tracking-widest uppercase font-body text-[#5C3D2E] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors bg-white"
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="bg-white border border-[#E8D5B0] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F0E8DC]">
                    <tr>
                      {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-[#9E8E80] font-body font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DC]">
                    {adminOrders.slice(0, 6).map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#2C1810] font-body">{o.id}</td>
                        <td className="px-4 py-3 text-[#5C3D2E] font-body">{o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'}</td>
                        <td className="px-4 py-3 text-[#9E8E80] font-body">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-[#5C3D2E] font-body">{o.items.length}</td>
                        <td className="px-4 py-3 font-medium text-[#2C1810] font-body">${Number(o.total).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-1 rounded font-body ${statusStyle[o.status] || 'bg-[#F0E8DC] text-[#5C3D2E]'}`}>{o.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-xs text-[#C9A96E] font-body uppercase tracking-wide">View</button>
                            <button onClick={() => api.updateAdminOrder(o.id, 'PROCESSING').then(() => setAdminOrders((items) => items.map((item) => item.id === o.id ? { ...item, status: 'PROCESSING' } : item)))} className="text-xs text-[#9E8E80] font-body uppercase tracking-wide">Update</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Categories ─────────────────────────────────────────── */}
          {tab === 'categories' && (
            <div className="space-y-5">
              <button className="px-5 py-2.5 bg-[#C9A96E] text-[#2C1810] text-xs tracking-widest uppercase font-body hover:bg-[#E8D5B0] transition-colors">
                + Add Category
              </button>
              <div className="grid sm:grid-cols-2 gap-5">
                {adminCategories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-[#E8D5B0] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl text-[#2C1810]">{cat.name}</h3>
                        <p className="text-xs text-[#9E8E80] font-body">{cat._count?.products || 0} products</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-[#C9A96E] font-body uppercase">Edit</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-1">Revenue</p>
                        <p className="font-display text-lg text-[#2C1810]">Live</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-1">Total Stock</p>
                        <p className="font-display text-lg text-[#2C1810]">—</p>
                      </div>
                    </div>
                    {/* Stock bar */}
                    <div className="mt-4">
                      <div className="w-full h-1 bg-[#F0E8DC] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C9A96E] rounded-full"
                          style={{ width: '35%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


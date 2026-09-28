import type { Product } from '../data';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const TOKEN_KEY = 'ameora_token';
const GUEST_KEY = 'ameora_guest_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getGuestToken = () => {
  let token = localStorage.getItem(GUEST_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(GUEST_KEY, token);
  }
  return token;
};
export const setToken = (token: string | null) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', 'Bearer ' + token);
  const guest = getGuestToken();
  if (!token) headers.set('x-guest-token', guest);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export type ProductListResponse = { items: BackendProduct[]; total: number; page: number; limit: number; pages: number };
export type AccountProfile = { id: string; email: string; firstName: string; lastName: string; phone?: string | null; addresses?: Address[] };
export type Address = { id: string; label?: string | null; firstName?: string | null; lastName?: string | null; line1: string; line2?: string | null; city: string; state: string; postalCode: string; country: string; isDefault: boolean };
export type Order = { id: string; createdAt: string; status: string; total: number | string; items: { productName: string; quantity: number; unitPrice: number | string }[]; user?: { email: string; firstName: string; lastName: string } | null };
export type BackendProduct = {
  id: string; name: string; slug?: string; price: number | string; compareAtPrice?: number | string | null;
  description?: string; stock: number; rating?: number | string; reviewsCount?: number;
  material?: string; color?: string; badge?: 'new' | 'bestseller' | 'sale'; isNew?: boolean;
  category?: { slug?: string; name?: string } | string; imageUrl?: string | null; images?: { url: string }[];
};

export function toProduct(p: BackendProduct): Product {
  const remoteImages = p.images?.map((i) => i.url).filter(Boolean) ?? [];
  const images = remoteImages.length > 0 ? remoteImages : (p.imageUrl ? [p.imageUrl] : []);
  const category = typeof p.category === 'string' ? p.category : p.category?.slug || 'rings';
  return {
    id: p.id, name: p.name, price: Number(p.price), originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    category: category as Product['category'], material: p.material || '', color: p.color || '', rating: Number(p.rating || 0),
    reviews: p.reviewsCount || 0, image: images[0] || '', images, description: p.description || '', stock: p.stock,
    badge: p.badge, isNew: p.isNew,
  };
}

export const api = {
  products: (query = '') => request<ProductListResponse>(`/products${query}`),
  product: (id: string | number) => request<BackendProduct>(`/products/${id}`),
  cart: () => request<{ items: { product: BackendProduct; quantity: number }[] } | null>('/cart'),
  addCartItem: (productId: string | number, quantity: number) => request('/cart/items', { method: 'POST', body: JSON.stringify({ productId: String(productId), quantity, guestToken: getGuestToken() }) }),
  updateCartItem: (productId: string | number, quantity: number) => request(`/cart/items/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (productId: string | number) => request(`/cart/items/${productId}`, { method: 'DELETE' }),
  login: (data: { email: string; password: string }) => request<{ token: string; user: unknown }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => request<{ token: string; user: unknown }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email: string) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  checkout: (data: Record<string, unknown>) => request('/checkout', { method: 'POST', body: JSON.stringify({ ...data, guestToken: getGuestToken() }) }),
  wishlist: () => request<{ product: BackendProduct }[]>('/wishlist'),
  addWishlist: (id: string | number) => request(`/wishlist/${id}`, { method: 'POST' }),
  removeWishlist: (id: string | number) => request(`/wishlist/${id}`, { method: 'DELETE' }),
  account: () => request<AccountProfile>('/account'),
  updateAccount: (data: Partial<Pick<AccountProfile, 'firstName' | 'lastName' | 'email' | 'phone'>>) => request<AccountProfile>('/account', { method: 'PATCH', body: JSON.stringify(data) }),
  updatePassword: (data: { currentPassword: string; newPassword: string }) => request('/account/password', { method: 'POST', body: JSON.stringify(data) }),
  addAddress: (data: Omit<Address, 'id'>) => request<Address>('/account/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id: string, data: Partial<Address>) => request<Address>(`/account/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  removeAddress: (id: string) => request(`/account/addresses/${id}`, { method: 'DELETE' }),
  orders: () => request<Order[]>('/checkout'),
  newsletter: (email: string) => request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
  adminDashboard: () => request('/admin/dashboard'),
  adminProducts: (query = '') => request<BackendProduct[]>(`/admin/products${query}`),
  createAdminProduct: (data: Record<string, unknown>) => request<BackendProduct>('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminProduct: (id: string, data: Record<string, unknown>) => request<BackendProduct>(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAdminProduct: (id: string) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  adminOrders: () => request<Order[]>('/admin/orders'),
  adminCategories: () => request<{ id: string; name: string; _count?: { products: number } }[]>('/admin/categories'),
  createAdminCategory: (data: { name: string; slug: string; imageUrl?: string }) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminOrder: (id: string, status: string) => request(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

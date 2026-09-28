import { useState, useCallback, useEffect } from 'react';
import { setProducts, products } from './data';
import type { Page, Product, CartItem } from './data';
import { api, toProduct, setToken } from './lib/api';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [productId, setProductId] = useState<string | number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
  const [, refreshCatalog] = useState(0);

  useEffect(() => {
    api.products('?limit=100').then((result) => { setProducts(result.items.map(toProduct)); refreshCatalog((value) => value + 1); }).catch(() => undefined);
    api.cart().then((cart) => {
      if (cart?.items) setCartItems(cart.items.map((item) => ({ product: toProduct(item.product), quantity: item.quantity })));
    }).catch(() => undefined);
    api.wishlist().then((items) => setWishlist(items.map((item) => item.product.id as never))).catch(() => undefined);
  }, []);

  const navigate = useCallback((target: Page, id?: string | number) => {
    if (id !== undefined) setProductId(id);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToCart = useCallback((product: Product, qty: number = 1) => {
    api.addCartItem(product.id, qty).catch(() => undefined);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const updateQty = useCallback((productId: string | number, qty: number) => {
    api.updateCartItem(productId, qty).catch(() => undefined);
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const removeFromCart = useCallback((productId: string | number) => {
    api.removeCartItem(productId).catch(() => undefined);
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const toggleWishlist = useCallback((id: string | number) => {
    const exists = wishlist.includes(id);
    (exists ? api.removeWishlist(id) : api.addWishlist(id)).catch(() => undefined);
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);
  const placeOrder = useCallback(async (data: Record<string, unknown>) => {
    await api.checkout(data);
    clearCart();
  }, [clearCart]);

  const noLayoutPages: Page[] = ['auth', 'admin'];
  const showLayout = !noLayoutPages.includes(page);

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-body">
      {showLayout && (
        <Header
          currentPage={page}
          navigate={navigate}
          cartItems={cartItems}
          wishlistCount={wishlist.length}
        />
      )}

      <main>
        {page === 'home' && (
          <HomePage
            navigate={navigate}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        )}
        {page === 'shop' && (
          <ShopPage
            navigate={navigate}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        )}
        {page === 'product' && (
          <ProductPage
            productId={productId}
            navigate={navigate}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        )}
        {page === 'cart' && (
          <CartPage
            cartItems={cartItems}
            navigate={navigate}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
          />
        )}
        {page === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            navigate={navigate}
            onOrderPlaced={clearCart}
            onPlaceOrder={placeOrder}
          />
        )}
        {page === 'auth' && (
          <AuthPage navigate={navigate} onAuthenticated={() => navigate('account')} />
        )}
        {page === 'account' && (
          <AccountPage
            navigate={navigate}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}
        {page === 'admin' && (
          <AdminPage navigate={navigate} />
        )}
      </main>

      {showLayout && <Footer navigate={navigate} />}
    </div>
  );
}

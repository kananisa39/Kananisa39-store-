import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ShieldCheck, Truck, Clock, Phone, Send, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, User, ShoppingBag
} from 'lucide-react';
import { Product, CartItem, Order, UserProfile, StoreSettings, OrderStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_USER, INITIAL_ORDERS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { BankAccountsBanner } from './components/BankAccountsBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { UserAccountModal } from './components/UserAccountModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { StoreManagerModal } from './components/StoreManagerModal';
import { WallpaperModal } from './components/WallpaperModal';

export default function App() {
  // Store Settings State with localStorage persistence
  const [settings, setSettings] = useState<StoreSettings & { telebirr?: string }>(() => {
    const saved = localStorage.getItem('kananisa_store_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // User Profile State (persisted)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kananisa_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kananisa_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kananisa_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kananisa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals visibility
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string | undefined>();
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<Order | null>(null);

  // Catalog Filtering & Searching
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kananisa_store_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kananisa_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kananisa_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kananisa_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kananisa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kananisa_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Actions
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
  };

  const handleInstantBuy = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    handleAddToCart(product, quantity, selectedColor, selectedSize);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart(prev => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setRecentOrderSuccess(newOrder);
  };

  // Order Status update from Store Manager
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Product Stock & Price update from Store Manager
  const handleUpdateProductStock = (productId: string, newStock: number, newPrice?: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              stockCount: newStock,
              inStock: newStock > 0,
              price: newPrice !== undefined ? newPrice : p.price,
            }
          : p
      )
    );
  };

  const handleAddNewProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  // Total cart count
  const totalCartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Orders belonging to currentUser
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(
      o =>
        (o.userId && o.userId === currentUser.id) ||
        o.customerPhone.replace(/\s+/g, '') === currentUser.phone.replace(/\s+/g, '')
    );
  }, [orders, currentUser]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory =
          activeCategory === 'all' || p.category === activeCategory;
        const matchesQuery =
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return 0;
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 selection:bg-amber-600 selection:text-white">
      {/* Navigation Bar adhering to Top Bar Contract */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderId(undefined);
          setIsTrackerOpen(true);
        }}
        onOpenManager={() => setIsManagerOpen(true)}
        onOpenWallpaper={() => setIsWallpaperOpen(true)}
        phone={settings.phone}
      />

      <main className="flex-1">
        {/* HERO SECTION: Split Campaign Showcase with 16:9 Photography */}
        <section className="relative overflow-hidden bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Brand Prose & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>Kananisa Store · Addis Ababa</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-300 px-3 py-1.5 rounded-md">
                    <span>Quality Products · Best Price, Your Satisfaction</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 font-display leading-[1.15] text-balance">
                  Fashion, Groceries, Home Needs & Premium Accessories
                </h1>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                  Shop genuine flagship smartphones, studio wireless audio, handwoven Habesha Kemis, and fine calfskin leather. Pay seamlessly with direct{' '}
                  <strong className="text-stone-900 font-semibold">CBE (1000523635593)</strong>,{' '}
                  <strong className="text-stone-900 font-semibold">Siinqee Bank (1105530900114)</strong>, or{' '}
                  <strong className="text-stone-900 font-semibold">Telebirr (0939086430)</strong>.
                </p>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#catalog"
                    className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </a>

                  <button
                    onClick={() => setIsWallpaperOpen(true)}
                    className="px-5 py-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Official Wallpapers</span>
                  </button>

                  <a
                    href="#bank-accounts"
                    className="px-5 py-3.5 border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl transition-all shrink-0"
                  >
                    Bank Accounts
                  </a>

                  <button
                    onClick={() => setIsAccountOpen(true)}
                    className="px-4 py-3.5 text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1.5"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentUser ? 'My Profile' : 'Sign In'}</span>
                  </button>
                </div>

                {/* 4 Brand Pillars directly from Poster */}
                <div className="pt-6 border-t border-stone-200 grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-stone-50 border border-stone-200 p-2 rounded-lg text-center">
                    <span className="block font-bold text-stone-900 uppercase text-[11px]">Fashion</span>
                    <span className="text-stone-500 text-[10px]">Habesha & Modern</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-2 rounded-lg text-center">
                    <span className="block font-bold text-stone-900 uppercase text-[11px]">Groceries</span>
                    <span className="text-stone-500 text-[10px]">Daily Essentials</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-2 rounded-lg text-center">
                    <span className="block font-bold text-stone-900 uppercase text-[11px]">Home Needs</span>
                    <span className="text-stone-500 text-[10px]">Living & Decor</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-2 rounded-lg text-center">
                    <span className="block font-bold text-stone-900 uppercase text-[11px]">Accessories</span>
                    <span className="text-stone-500 text-[10px]">Tech & Scents</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Cinematic Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-lg aspect-[16/10] bg-stone-100">
                  <img
                    src="/src/assets/images/hero_kananisa_storefront_1792189094841.jpg"
                    alt="Kananisa Store Showroom"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        Official Store Experience
                      </div>
                      <div className="text-lg font-bold font-display">
                        Addis Ababa Flagship Showroom & Delivery Network
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BANK ACCOUNTS & TELEBIRR COMPONENT */}
        <BankAccountsBanner settings={settings} />

        {/* PRODUCT CATALOG SECTION */}
        <section id="catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                Kananisa Store Inventory
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                Featured Store Collection
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Authentic electronics, fashion, and lifestyle essentials with immediate delivery across Ethiopia.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search smartphone, dress, watch..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              />
            </div>
          </div>

          {/* Interactive Filter Controls: Section 1.A DO compliant functional tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                All Items ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('electronics')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'electronics'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Phones & Tech
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('audio_wearables')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'audio_wearables'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Audio & Smartwatches
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('habesha_fashion')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'habesha_fashion'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Habesha Fashion
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('footwear')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'footwear'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Leather Footwear
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('perfumes')}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === 'perfumes'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Fragrances
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs text-stone-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-800"
              >
                <option value="featured">Featured First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid: 3 columns on desktop */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">No products matched your search</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try searching with a different keyword or switch to another category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={prod => setSelectedProduct(prod)}
                />
              ))}
            </div>
          )}
        </section>

        {/* CRAFTSMANSHIP & USER ACCOUNT BENEFITS SECTION */}
        <section className="py-14 bg-stone-100 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Integrated User Account System
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Register and link your Commercial Bank of Ethiopia (CBE) and Siinqee Bank accounts to your profile for automatic payment verification, saved shipping addresses, and full order history tracking.
                  </p>
                </div>
                <button
                  onClick={() => setIsAccountOpen(true)}
                  className="mt-4 text-xs font-bold text-purple-900 hover:text-purple-950 flex items-center gap-1"
                >
                  <span>{currentUser ? 'Manage Your Profile' : 'Register Profile Now'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Rapid Delivery & Live Tracking
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Same-day doorstep delivery across all subcities of Addis Ababa (Bole, CMC, Piassa, Kazanchis, Megenagna) and rapid cargo dispatch to Hawassa, Adama, Dire Dawa, and Jimma.
                  </p>
                </div>
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>Track Existing Package</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Direct Support with Store Owner
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Speak directly with Kananisa Gabre on 0939086430 for custom bulk orders, special requests, size customization on Habesha dresses, or payment verification.
                  </p>
                </div>
                <a
                  href={`tel:${settings.phone}`}
                  className="mt-4 text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Call 0939086430</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
            <div>
              <div className="text-white font-bold text-base font-display mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-600 inline-block" />
                <span>Kananisa Store</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Your premier destination in Ethiopia for authentic smartphones, studio audio, handwoven Habesha fashion, and luxury fragrances.
              </p>
              <div className="mt-3 text-stone-300 font-mono-nums">
                Phone: <a href={`tel:${settings.phone}`} className="text-amber-400 hover:underline">{settings.phone}</a>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold mb-3">Official Accounts</div>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <span className="text-stone-400">CBE Account:</span>{' '}
                  <span className="font-mono-nums text-white font-semibold">{settings.cbeAccount}</span>
                </li>
                <li>
                  <span className="text-stone-400">Siinqee Bank:</span>{' '}
                  <span className="font-mono-nums text-white font-semibold">{settings.siinqeeAccount}</span>
                </li>
                <li>
                  <span className="text-stone-400">Telebirr Wallet:</span>{' '}
                  <span className="font-mono-nums text-white font-semibold">{settings.telebirr || settings.phone}</span>
                </li>
                <li>
                  <span className="text-stone-400">Telegram Chat:</span>{' '}
                  <a
                    href={`https://t.me/${settings.telegramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-nums text-sky-400 hover:underline font-semibold"
                  >
                    @{settings.telegramHandle.replace('@', '')}
                  </a>
                </li>
                <li>
                  <span className="text-stone-400">Telegram Channel:</span>{' '}
                  <a
                    href="https://t.me/luv390"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-nums text-amber-400 hover:underline font-semibold"
                  >
                    @luv390
                  </a>
                </li>
                <li>
                  <span className="text-stone-400">Account Holder:</span>{' '}
                  <span className="text-white">{settings.ownerName}</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-3">Customer Services</div>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a
                    href={`https://t.me/${settings.telegramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                  >
                    <Send className="w-3 h-3" />
                    <span>Telegram Chat: @{settings.telegramHandle.replace('@', '')}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/luv390"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <Send className="w-3 h-3" />
                    <span>Telegram Channel: @luv390</span>
                  </a>
                </li>
                <li>
                  <button onClick={() => setIsAccountOpen(true)} className="hover:text-white">
                    User Profile & Saved Addresses
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsTrackerOpen(true)} className="hover:text-white">
                    Track Shipment Status
                  </button>
                </li>
                <li>
                  <a href="#bank-accounts" className="hover:text-white">
                    Bank Transfer Details
                  </a>
                </li>
                <li>
                  <button onClick={() => setIsManagerOpen(true)} className="hover:text-amber-300">
                    Store Manager Console
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-3">Showroom & Delivery</div>
              <p className="text-[11px] leading-relaxed text-stone-400">
                {settings.address}
              </p>
              <div className="mt-3 text-[11px] text-stone-500">
                Email: {settings.email}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
            <div>
              © {new Date().getFullYear()} Kananisa Store. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Commercial Bank of Ethiopia</span>
              <span aria-hidden="true">·</span>
              <span>Siinqee Bank S.C.</span>
              <span aria-hidden="true">·</span>
              <span>Telebirr</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. User Account Modal (Register, Login, Saved Addresses, Linked Bank Accounts, Order History) */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogin={user => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        onUpdateUser={updated => setCurrentUser(updated)}
        userOrders={userOrders}
        onOpenOrderTracking={orderId => {
          setIsAccountOpen(false);
          setTrackerOrderId(orderId);
          setIsTrackerOpen(true);
        }}
      />

      {/* 2. Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
      />

      {/* 3. Shopping Bag & Direct Bank Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOpenAccount={() => {
          setIsCartOpen(false);
          setIsAccountOpen(true);
        }}
        settings={settings}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 4. Order Placed Confirmation Modal */}
      <OrderSuccessModal
        order={recentOrderSuccess}
        onClose={() => setRecentOrderSuccess(null)}
        onOpenAccount={() => {
          setRecentOrderSuccess(null);
          setIsAccountOpen(true);
        }}
        settings={settings}
      />

      {/* 5. Order Tracking Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        prefilledOrderId={trackerOrderId}
        storePhone={settings.phone}
      />

      {/* 6. Store Manager Console for Kananisa */}
      <StoreManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        products={products}
        onUpdateProductStock={handleUpdateProductStock}
        onAddNewProduct={handleAddNewProduct}
        settings={settings}
        onUpdateSettings={newS => setSettings(newS)}
      />

      {/* 7. Official Wallpapers Modal */}
      <WallpaperModal
        isOpen={isWallpaperOpen}
        onClose={() => setIsWallpaperOpen(false)}
        settings={settings}
      />
    </div>
  );
}

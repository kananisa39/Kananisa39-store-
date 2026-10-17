import React, { useState } from 'react';
import { 
  X, Shield, Package, ShoppingBag, Settings, Check, Clock, Truck, 
  Building2, CreditCard, Smartphone, Eye, Plus, Edit2, Phone
} from 'lucide-react';
import { Order, Product, StoreSettings, OrderStatus } from '../types';

interface StoreManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  products: Product[];
  onUpdateProductStock: (productId: string, newStock: number, newPrice?: number) => void;
  onAddNewProduct: (product: Product) => void;
  settings: StoreSettings & { telebirr?: string };
  onUpdateSettings: (newSettings: StoreSettings & { telebirr?: string }) => void;
}

export const StoreManagerModal: React.FC<StoreManagerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  products,
  onUpdateProductStock,
  onAddNewProduct,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'accounts'>('orders');
  const [previewSlip, setPreviewSlip] = useState<string | null>(null);

  // Settings form
  const [cbeInput, setCbeInput] = useState(settings.cbeAccount);
  const [siinqeeInput, setSiinqeeInput] = useState(settings.siinqeeAccount);
  const [telebirrInput, setTelebirrInput] = useState(settings.telebirr || '0939086430');
  const [telegramInput, setTelegramInput] = useState(settings.telegramHandle || 'kanoman3908');
  const [telegramChannelInput, setTelegramChannelInput] = useState(settings.telegramChannel || 'luv390');
  const [phoneInput, setPhoneInput] = useState(settings.phone);
  const [ownerInput, setOwnerInput] = useState(settings.ownerName);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('electronics');
  const [newProdPrice, setNewProdPrice] = useState('2500');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('/src/assets/images/product_flagship_smartphone_1792189095495.jpg');

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      cbeAccount: cbeInput,
      siinqeeAccount: siinqeeInput,
      telebirr: telebirrInput,
      telegramHandle: telegramInput.replace('@', ''),
      telegramChannel: telegramChannelInput.replace('@', ''),
      phone: phoneInput,
      ownerName: ownerInput,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProdName,
      category: newProdCategory,
      categoryLabel:
        newProdCategory === 'electronics'
          ? 'Electronics & Gadgets'
          : newProdCategory === 'audio_wearables'
          ? 'Audio & Wearables'
          : newProdCategory === 'habesha_fashion'
          ? 'Habesha Fashion'
          : newProdCategory === 'footwear'
          ? 'Footwear & Shoes'
          : 'Fragrance & Scent',
      price: parseFloat(newProdPrice) || 1000,
      image: newProdImage,
      inStock: true,
      stockCount: parseInt(newProdStock, 10) || 5,
      description: newProdDesc || 'Genuine product available at Kananisa Store.',
      features: ['Official Kananisa Store Verified', 'Quality Inspected', 'Express Delivery'],
    };
    onAddNewProduct(created);
    setShowAddProduct(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">Kananisa Store Owner Console</h2>
              <p className="text-xs text-stone-400">
                Order fulfillment, inventory control, and bank account settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close Store Manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'orders'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'inventory'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory ({products.length} Items)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'accounts'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>CBE, Siinqee & Store Settings</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Manage incoming customer orders, review payment slips, and trigger delivery updates.
                </span>
                <span className="text-xs font-mono-nums font-semibold text-stone-800">
                  {orders.length} Total Orders
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">No orders recorded yet.</div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-100 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-nums font-bold text-sm text-stone-900">
                            {order.id}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'shipped'
                                ? 'bg-sky-100 text-sky-800'
                                : order.status === 'payment_confirmed'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-xs text-stone-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Customer & Payment Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[11px]">Customer</span>
                          <span className="font-semibold text-stone-800">{order.customerName}</span>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="block font-mono-nums text-amber-700 hover:underline"
                          >
                            {order.customerPhone}
                          </a>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Delivery Location</span>
                          <span className="text-stone-800">{order.deliveryCity}</span>
                          <span className="block text-stone-500 text-[11px] truncate">
                            {order.deliveryAddress}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Payment Method & Amount</span>
                          <span className="font-bold uppercase text-stone-900">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                          <div className="font-mono-nums text-emerald-700 font-bold">
                            {order.total.toLocaleString()} ETB
                          </div>
                          {order.bankTransactionRef && (
                            <span className="block text-stone-500 text-[10px] font-mono-nums">
                              Ref: {order.bankTransactionRef}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2.5 bg-stone-50 rounded-lg text-xs space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-stone-700">
                            <span>
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="font-mono-nums">
                              {(it.product.price * it.quantity).toLocaleString()} ETB
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                        {order.slipImagePreview ? (
                          <button
                            type="button"
                            onClick={() => setPreviewSlip(order.slipImagePreview || null)}
                            className="px-2.5 py-1 text-xs rounded border border-purple-200 bg-purple-50 text-purple-900 font-medium inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Payment Slip Screenshot</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-400">No image slip attached</span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-stone-500 mr-1">Update Status:</span>
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, 'payment_confirmed')}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold rounded transition-colors"
                          >
                            Confirm Bank Transfer
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                            className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 text-[11px] font-semibold rounded transition-colors"
                          >
                            Mark Shipped
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-semibold rounded transition-colors"
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Inventory */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Update product stock count and prices in real time.
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddProduct ? 'Cancel' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3"
                >
                  <div className="text-xs font-bold text-stone-900">Add New Store Catalog Item</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={e => setNewProdName(e.target.value)}
                        placeholder="e.g. Samsung Galaxy S25 or Designer Watch"
                        className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={e => setNewProdCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 bg-white"
                      >
                        <option value="electronics">Electronics & Phones</option>
                        <option value="audio_wearables">Audio & Wearables</option>
                        <option value="habesha_fashion">Habesha Fashion</option>
                        <option value="footwear">Footwear & Shoes</option>
                        <option value="perfumes">Fragrance & Scent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Price (ETB) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={e => setNewProdPrice(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono-nums rounded border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        Available Stock Units *
                      </label>
                      <input
                        type="number"
                        required
                        value={newProdStock}
                        onChange={e => setNewProdStock(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono-nums rounded border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={newProdDesc}
                      onChange={e => setNewProdDesc(e.target.value)}
                      placeholder="High quality genuine item with local warranty..."
                      className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg"
                  >
                    Add Product to Catalog
                  </button>
                </form>
              )}

              {/* Product list */}
              <div className="divide-y divide-stone-200">
                {products.map(prod => (
                  <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded object-cover bg-stone-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">{prod.name}</div>
                        <div className="text-[11px] text-stone-500">{prod.categoryLabel}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Price (ETB)</span>
                        <input
                          type="number"
                          value={prod.price}
                          onChange={e =>
                            onUpdateProductStock(prod.id, prod.stockCount, parseFloat(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 text-xs font-mono-nums font-bold border border-stone-200 rounded"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-400 block">Stock Count</span>
                        <input
                          type="number"
                          value={prod.stockCount}
                          onChange={e =>
                            onUpdateProductStock(
                              prod.id,
                              parseInt(e.target.value, 10) || 0,
                              prod.price
                            )
                          }
                          className="w-16 px-2 py-1 text-xs font-mono-nums font-bold border border-stone-200 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Accounts & Settings */}
          {activeTab === 'accounts' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
              {settingsSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Store payment accounts updated!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Store Owner Name
                </label>
                <input
                  type="text"
                  required
                  value={ownerInput}
                  onChange={e => setOwnerInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Official Phone / Customer Hotline
                </label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono-nums rounded-lg border border-stone-300"
                />
              </div>

              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                  <Building2 className="w-4 h-4 text-purple-800" />
                  <span>Commercial Bank of Ethiopia (CBE) Official Account</span>
                </div>
                <input
                  type="text"
                  required
                  value={cbeInput}
                  onChange={e => setCbeInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-nums font-bold rounded-lg border border-stone-300 bg-white"
                />
                <span className="text-[11px] text-stone-500">Provided: 1000523635593</span>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <CreditCard className="w-4 h-4 text-amber-800" />
                  <span>Siinqee Bank S.C. Official Account</span>
                </div>
                <input
                  type="text"
                  required
                  value={siinqeeInput}
                  onChange={e => setSiinqeeInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-nums font-bold rounded-lg border border-stone-300 bg-white"
                />
                <span className="text-[11px] text-stone-500">Provided: 1105530900114</span>
              </div>

              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-950">
                  <Smartphone className="w-4 h-4 text-teal-800" />
                  <span>Telebirr Official Account Phone</span>
                </div>
                <input
                  type="tel"
                  required
                  value={telebirrInput}
                  onChange={e => setTelebirrInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-nums font-bold rounded-lg border border-stone-300 bg-white"
                />
                <span className="text-[11px] text-stone-500">Provided: 0939086430</span>
              </div>

              <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
                  <Smartphone className="w-4 h-4 text-sky-800" />
                  <span>Official Telegram Username</span>
                </div>
                <input
                  type="text"
                  required
                  value={telegramInput}
                  onChange={e => setTelegramInput(e.target.value)}
                  placeholder="@kanoman3908"
                  className="w-full px-3 py-2 text-xs font-mono-nums font-bold rounded-lg border border-stone-300 bg-white"
                />
                <span className="text-[11px] text-stone-500">Configured: @kanoman3908 (Direct order hotline)</span>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Smartphone className="w-4 h-4 text-amber-800" />
                  <span>Official Telegram Channel Link / Username</span>
                </div>
                <input
                  type="text"
                  required
                  value={telegramChannelInput}
                  onChange={e => setTelegramChannelInput(e.target.value)}
                  placeholder="@luv390"
                  className="w-full px-3 py-2 text-xs font-mono-nums font-bold rounded-lg border border-stone-300 bg-white"
                />
                <span className="text-[11px] text-stone-500">Configured: https://t.me/luv390 (@luv390)</span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Save Store Settings
              </button>
            </form>
          )}
        </div>

        {/* Modal for viewing slip screenshot */}
        {previewSlip && (
          <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-4 relative">
              <button
                onClick={() => setPreviewSlip(null)}
                className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="text-xs font-bold text-stone-900 mb-2">Customer Payment Proof</h4>
              <img
                src={previewSlip}
                alt="Payment Slip"
                className="w-full rounded-lg border border-stone-200 max-h-[70vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

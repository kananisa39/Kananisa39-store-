import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Building2, CreditCard, 
  Smartphone, Copy, Check, UploadCloud, MapPin, User, ChevronLeft, Phone
} from 'lucide-react';
import { CartItem, UserProfile, PaymentMethod, Order, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  currentUser: UserProfile | null;
  onOpenAccount: () => void;
  settings: StoreSettings & { telebirr?: string };
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onOpenAccount,
  settings,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Checkout form fields
  const defaultAddr = currentUser?.addresses.find(a => a.isDefault) || currentUser?.addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '');
  
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryCity, setDeliveryCity] = useState(defaultAddr?.city || 'Addis Ababa');
  const [deliveryAddress, setDeliveryAddress] = useState(
    defaultAddr ? `${defaultAddr.subcityOrArea}, ${defaultAddr.streetDetails}` : ''
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    currentUser?.paymentProfile?.preferredMethod || 'cbe_bank'
  );
  const [txnRef, setTxnRef] = useState('');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Copy helper
  const copyText = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold || subtotal === 0 ? 0 : 200;
  const grandTotal = subtotal + deliveryFee;

  // Handle address selection change
  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    const found = currentUser?.addresses.find(a => a.id === addrId);
    if (found) {
      setCustomerName(found.recipientName);
      setCustomerPhone(found.phone);
      setDeliveryCity(found.city);
      setDeliveryAddress(`${found.subcityOrArea}, ${found.streetDetails}`);
    }
  };

  // Handle file slip upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Complete Order
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const newOrderId = `KS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newOrderId,
      userId: currentUser?.id,
      createdAt: new Date().toISOString(),
      customerName: customerName || (currentUser ? currentUser.fullName : 'Valued Customer'),
      customerPhone: customerPhone || '0939086430',
      deliveryCity,
      deliveryAddress: deliveryAddress || 'Addis Ababa Doorstep Delivery',
      items: [...items],
      subtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      bankTransactionRef: txnRef || (paymentMethod === 'cash_on_delivery' ? 'COD-PENDING' : 'PENDING-VERIFY'),
      slipImagePreview: slipImage || undefined,
      status: paymentMethod === 'cash_on_delivery' ? 'processing' : 'payment_confirmed',
      notes: orderNotes,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClearCart();
      setStep('cart');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="p-1.5 -ml-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/50"
                aria-label="Back to Cart"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>{step === 'cart' ? 'Your Shopping Bag' : 'Direct Bank Checkout'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-nums font-semibold text-stone-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800">Your bag is empty</h3>
              <p className="mt-1 text-xs text-stone-500 max-w-xs">
                Browse our curated electronics, traditional Habesha wear, and accessories to add items.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg"
              >
                Explore Catalog
              </button>
            </div>
          ) : step === 'cart' ? (
            /* CART VIEW */
            <div className="space-y-4">
              {/* Promotion pill-less notice */}
              {subtotal < settings.freeDeliveryThreshold ? (
                <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
                  <span>Add {(settings.freeDeliveryThreshold - subtotal).toLocaleString()} ETB more for Free Addis Delivery</span>
                  <span className="font-bold text-[11px] font-mono-nums">200 ETB</span>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Free Addis Ababa Express Delivery Qualified!</span>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {items.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex gap-3.5 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-lg bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                        {item.selectedSize && <span>· Size: {item.selectedSize}</span>}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-mono-nums font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold font-mono-nums text-stone-900">
                            {(item.product.price * item.quantity).toLocaleString()} ETB
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(idx)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Bank Preview */}
              <div className="pt-3 border-t border-stone-100">
                <div className="p-3 bg-stone-900 text-stone-100 rounded-xl text-xs space-y-1.5">
                  <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                    Supported Payment Accounts
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-300">CBE Account:</span>
                    <span className="font-mono-nums font-bold text-white">1000523635593</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-300">Siinqee Bank:</span>
                    <span className="font-mono-nums font-bold text-white">1105530900114</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-300">Telebirr / Phone:</span>
                    <span className="font-mono-nums font-bold text-teal-300">0939086430</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CHECKOUT STEP */
            <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-5">
              {/* User session banner */}
              {currentUser ? (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-stone-700" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">{currentUser.fullName}</div>
                      <div className="text-[11px] text-stone-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAccount}
                    className="text-[11px] font-semibold text-amber-700 hover:underline"
                  >
                    Manage Profile
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-amber-900">Have a Kananisa Account?</span>
                  <button
                    type="button"
                    onClick={onOpenAccount}
                    className="text-xs font-bold text-amber-800 underline"
                  >
                    Sign In for 1-Click Fill
                  </button>
                </div>
              )}

              {/* Saved Address Selection if User has addresses */}
              {currentUser && currentUser.addresses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    Select Delivery Destination
                  </label>
                  <div className="space-y-1.5">
                    {currentUser.addresses.map(addr => (
                      <label
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr.id)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? 'border-stone-900 bg-stone-50 font-medium'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleSelectAddress(addr.id)}
                          className="mt-0.5 text-stone-900 focus:ring-stone-900"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-stone-900">{addr.label}</span>
                          <span className="text-stone-500 ml-1">({addr.recipientName} · {addr.phone})</span>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            {addr.streetDetails}, {addr.subcityOrArea}, {addr.city}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Details Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Kananisa Gabre"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="0939086430"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Delivery City / Region *</label>
                  <select
                    value={deliveryCity}
                    onChange={e => setDeliveryCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Addis Ababa">Addis Ababa (Express Courier)</option>
                    <option value="Adama (Nazret)">Adama (Nazret)</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Bahir Dar">Bahir Dar</option>
                    <option value="Jimma">Jimma</option>
                    <option value="Bishoftu">Bishoftu</option>
                    <option value="Regional Bus Cargo Delivery">Other Regional Station / Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Specific Delivery Address & Landmarks *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Bole Medhanialem, House 204 near Edna Mall"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2">
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* CBE */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cbe_bank')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'cbe_bank'
                        ? 'border-purple-800 bg-purple-50/60 ring-2 ring-purple-800/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-purple-950">CBE Transfer</span>
                      <Building2 className="w-4 h-4 text-purple-800" />
                    </div>
                    <span className="text-[10px] text-purple-700 mt-1 font-mono-nums">1000523635593</span>
                  </button>

                  {/* Siinqee Bank */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('siinqee_bank')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'siinqee_bank'
                        ? 'border-amber-700 bg-amber-50/60 ring-2 ring-amber-700/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-amber-950">Siinqee Bank</span>
                      <CreditCard className="w-4 h-4 text-amber-800" />
                    </div>
                    <span className="text-[10px] text-amber-800 mt-1 font-mono-nums">1105530900114</span>
                  </button>

                  {/* Telebirr */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('telebirr')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'telebirr'
                        ? 'border-teal-700 bg-teal-50/60 ring-2 ring-teal-700/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-teal-950">Telebirr Wallet</span>
                      <Smartphone className="w-4 h-4 text-teal-700" />
                    </div>
                    <span className="text-[10px] text-teal-700 mt-1 font-mono-nums">0939086430</span>
                  </button>

                  {/* Cash On Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-stone-900">Cash On Delivery</span>
                      <ShieldCheck className="w-4 h-4 text-stone-700" />
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1">Addis Ababa Only</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Bank Transfer Details Box with One-Click Copy */}
              {paymentMethod !== 'cash_on_delivery' && (
                <div className="p-3.5 bg-stone-900 text-stone-100 rounded-xl space-y-2 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                      Transfer To Verified Account
                    </span>
                    <span className="text-[11px] text-stone-400">Total: {grandTotal.toLocaleString()} ETB</span>
                  </div>

                  {paymentMethod === 'cbe_bank' && (
                    <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <div>
                        <div className="text-[10px] text-purple-300 uppercase">Commercial Bank of Ethiopia (CBE)</div>
                        <div className="text-sm font-bold font-mono-nums text-white">1000523635593</div>
                        <div className="text-[10px] text-stone-400">Beneficiary: Kananisa Gabre</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText('1000523635593', 'cbe-chk')}
                        className="px-2.5 py-1.5 rounded bg-purple-900/80 hover:bg-purple-800 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === 'cbe-chk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'cbe-chk' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'siinqee_bank' && (
                    <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <div>
                        <div className="text-[10px] text-amber-400 uppercase">Siinqee Bank S.C.</div>
                        <div className="text-sm font-bold font-mono-nums text-white">1105530900114</div>
                        <div className="text-[10px] text-stone-400">Beneficiary: Kananisa Gabre</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText('1105530900114', 'siinqee-chk')}
                        className="px-2.5 py-1.5 rounded bg-amber-900/80 hover:bg-amber-800 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === 'siinqee-chk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'siinqee-chk' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'telebirr' && (
                    <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <div>
                        <div className="text-[10px] text-teal-300 uppercase">Telebirr Wallet</div>
                        <div className="text-sm font-bold font-mono-nums text-white">0939086430</div>
                        <div className="text-[10px] text-stone-400">Beneficiary: Kananisa Gabre</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText('0939086430', 'telebirr-chk')}
                        className="px-2.5 py-1.5 rounded bg-teal-900/80 hover:bg-teal-800 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedKey === 'telebirr-chk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'telebirr-chk' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  <div className="pt-1">
                    <label className="block text-[11px] font-medium text-stone-300 mb-1">
                      Transaction Reference Number / SMS Code
                    </label>
                    <input
                      type="text"
                      value={txnRef}
                      onChange={e => setTxnRef(e.target.value)}
                      placeholder="e.g. FT26288CBE994 or Telebirr Txn ID"
                      className="w-full px-3 py-1.5 text-xs font-mono-nums bg-stone-950 border border-stone-700 text-white rounded-lg"
                    />
                  </div>

                  {/* Payment slip upload */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-medium text-stone-300 mb-1">
                      Payment Slip or Screenshot (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-1.5 px-3 border border-dashed border-stone-700 rounded-lg text-center cursor-pointer hover:border-stone-500 text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{slipImage ? 'Slip Attached (Change)' : 'Upload Receipt Screenshot'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {slipImage && (
                        <button
                          type="button"
                          onClick={() => setSlipImage(null)}
                          className="p-1.5 text-stone-400 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Notes or Special Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call 0939086430 upon arrival at gate"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary & Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono-nums font-semibold">{subtotal.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span className="font-mono-nums font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `${deliveryFee} ETB`}
                </span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="font-mono-nums text-base">{grandTotal.toLocaleString()} ETB</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : (
              <button
                form="checkout-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Place Order ({grandTotal.toLocaleString()} ETB)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

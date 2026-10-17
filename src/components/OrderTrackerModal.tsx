import React, { useState, useEffect } from 'react';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock, Phone, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  prefilledOrderId?: string;
  storePhone: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  prefilledOrderId,
  storePhone,
}) => {
  const [query, setQuery] = useState(prefilledOrderId || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (prefilledOrderId) {
      setQuery(prefilledOrderId);
      const found = orders.find(
        o => o.id.toLowerCase() === prefilledOrderId.toLowerCase()
      );
      if (found) {
        setMatchedOrder(found);
      }
      setHasSearched(true);
    }
  }, [prefilledOrderId, orders]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const found = orders.find(
      o =>
        o.id.toLowerCase() === clean ||
        o.customerPhone.replace(/\s+/g, '').includes(clean)
    );
    setMatchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending_verification':
        return 0;
      case 'payment_confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">Live Order Tracker</h3>
              <p className="text-xs text-stone-500">Track your delivery in Addis Ababa or regional transit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            aria-label="Close Order Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                required
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. KS-8192) or Phone Number"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Result view */}
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Order quick overview */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-nums font-bold text-stone-900 text-base">
                      {matchedOrder.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {matchedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Recipient: {matchedOrder.customerName} ({matchedOrder.customerPhone})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono-nums text-stone-900">
                    {matchedOrder.total.toLocaleString()} ETB
                  </div>
                  <div className="text-[11px] text-stone-500 uppercase">
                    Paid via {matchedOrder.paymentMethod.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
                  Delivery Progress Status
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {/* Step 1 */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-6 border-2 ${
                        getStepIndex(matchedOrder.status) >= 0
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Order Placed & Registered</div>
                      <p className="text-[11px] text-stone-500">
                        Order registered in Kananisa Store system on{' '}
                        {new Date(matchedOrder.createdAt).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-6 border-2 ${
                        getStepIndex(matchedOrder.status) >= 1
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Bank Payment Verified</div>
                      <p className="text-[11px] text-stone-500">
                        Transfer to CBE (1000523635593) / Siinqee Bank (1105530900114) confirmed.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-6 border-2 ${
                        getStepIndex(matchedOrder.status) >= 3
                          ? 'bg-sky-600 border-sky-600 text-white'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      <Truck className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Dispatched & Out for Delivery</div>
                      <p className="text-[11px] text-stone-500">
                        Packaged and dispatched to destination: {matchedOrder.deliveryCity} (
                        {matchedOrder.deliveryAddress}).
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 -ml-6 border-2 ${
                        getStepIndex(matchedOrder.status) >= 4
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      <PackageCheck className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Delivered & Completed</div>
                      <p className="text-[11px] text-stone-500">
                        Handed over to customer with official receipt and warranty paperwork.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items in this order */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-xs font-bold text-stone-800 mb-2">Package Contents</div>
                <div className="space-y-1.5 text-xs text-stone-600">
                  {matchedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.product.name}</span>
                      <span className="font-mono-nums">{(it.product.price * it.quantity).toLocaleString()} ETB</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier hotline */}
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <span className="text-amber-900 font-medium">Need instant assistance regarding your package?</span>
                <a
                  href={`tel:${storePhone}`}
                  className="font-bold text-amber-800 flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call {storePhone}</span>
                </a>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-8 text-stone-500">
              <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-stone-800">No Matching Order Found</div>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Please check the Order ID (e.g. KS-8192) or contact Kananisa Store directly at {storePhone}.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400">
              <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">
                Enter your order ID from your receipt or your checkout phone number to see real-time updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

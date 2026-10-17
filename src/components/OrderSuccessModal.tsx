import React from 'react';
import { CheckCircle2, Phone, Send, Eye, Printer, X, ShieldCheck } from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenAccount: () => void;
  settings: StoreSettings & { telebirr?: string };
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onOpenAccount,
  settings,
}) => {
  if (!order) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Kananisa Store, I just placed order ${order.id} for ${order.total.toLocaleString()} ETB via ${order.paymentMethod.replace('_', ' ')}. My name is ${order.customerName} (Phone: ${order.customerPhone}).`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700"
          aria-label="Close Confirmation Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Order Successfully Placed!
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            Thank you for shopping with Kananisa Store. Your order is being processed.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200 text-left space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="text-xs text-stone-500">Order Reference</span>
              <span className="font-mono-nums font-bold text-sm text-stone-900">{order.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Customer Name:</span>
              <span className="font-semibold text-stone-800">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Delivery Contact:</span>
              <span className="font-mono-nums text-stone-800">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Delivery Destination:</span>
              <span className="text-stone-800 text-right max-w-xs truncate">{order.deliveryCity} ({order.deliveryAddress})</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Payment Channel:</span>
              <span className="font-semibold uppercase text-stone-800">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
            {order.bankTransactionRef && (
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Transaction ID:</span>
                <span className="font-mono-nums font-bold text-stone-900">{order.bankTransactionRef}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-bold text-stone-900 text-sm">
              <span>Total Amount</span>
              <span className="font-mono-nums">{order.total.toLocaleString()} ETB</span>
            </div>
          </div>

          {/* Quick receipt verification note */}
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <span>
              If you transferred via CBE (1000523635593) or Siinqee Bank (1105530900114), you can also share your slip screenshot directly with Kananisa via Telegram or WhatsApp for expedited priority dispatch.
            </span>
          </div>

          {/* Direct channels */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a
              href={`https://t.me/${settings.telegramHandle.replace('@', '')}?start=${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>@{settings.telegramHandle.replace('@', '')}</span>
            </a>

            <a
              href="https://t.me/luv390"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Channel @luv390</span>
            </a>

            <a
              href={`https://wa.me/251939086430?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAccount();
              }}
              className="flex-1 py-2.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View in Order History</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-3 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

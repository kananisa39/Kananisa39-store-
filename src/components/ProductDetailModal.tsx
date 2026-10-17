import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  onInstantBuy: (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuy = () => {
    onInstantBuy(product, quantity, selectedColor, selectedSize);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden relative max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-stone-700 hover:bg-stone-100 shadow-sm transition-colors"
          aria-label="Close Product Details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Left Side */}
        <div className="w-full md:w-1/2 bg-stone-100 flex flex-col justify-center relative aspect-square md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center max-h-[460px]"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 text-xs font-semibold text-stone-900 bg-white/95 backdrop-blur-md px-3 py-1 rounded shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Contiguous Purchase Module / Right Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[480px] md:max-h-[580px]">
          <div>
            {/* Category and stock */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-semibold text-stone-700">
                {product.categoryLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className={product.inStock ? 'text-emerald-700 font-medium' : 'text-stone-400'}>
                {product.inStock ? `${product.stockCount} units available` : 'Out of stock'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display leading-tight">
              {product.name}
            </h2>

            {/* Price block */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold font-mono-nums text-stone-900">
                {product.price.toLocaleString()} <span className="text-sm font-sans font-medium text-stone-500">ETB</span>
              </span>
              {product.originalPrice && (
                <span className="text-sm font-mono-nums text-stone-400 line-through">
                  {product.originalPrice.toLocaleString()} ETB
                </span>
              )}
            </div>

            <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Select Color: <span className="font-normal text-stone-500">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedColor === col
                          ? 'border-stone-900 bg-stone-900 text-white font-medium'
                          : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Select Size: <span className="font-normal text-stone-500">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'border-stone-900 bg-stone-900 text-white font-medium'
                          : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-xs font-semibold text-stone-800">Quantity:</label>
              <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono-nums font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Features preview */}
            <div className="mt-5 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Highlights & Specifications
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {product.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-900 hover:bg-stone-50 text-stone-900 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuy}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Authentic</span>
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-600" />
                <span>Express Delivery</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

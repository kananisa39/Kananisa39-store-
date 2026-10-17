import React, { useState } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-stone-300"
    >
      {/* Product Image Slot: 65% - 75% height */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400 bg-stone-100">
            <ShoppingBag className="w-8 h-8 mb-2 text-stone-400" />
            <span className="text-xs font-medium text-stone-500">{product.name}</span>
          </div>
        )}

        {/* Subtle non-pill single badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold text-stone-900 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded shadow-xs tracking-wide">
            {product.badge}
          </span>
        )}

        {/* Quick View overlay button */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-3.5 py-2 rounded-lg bg-white/95 text-stone-900 text-xs font-semibold shadow-md hover:bg-white transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata: Category · Stock */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[11px] text-stone-600">
              {product.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className={product.inStock ? 'text-emerald-700' : 'text-stone-400'}>
              {product.inStock ? `${product.stockCount} in stock` : 'Out of Stock'}
            </span>
          </div>

          <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-mono-nums text-stone-900">
              {product.price.toLocaleString()} <span className="text-xs font-sans font-medium text-stone-500">ETB</span>
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono-nums text-stone-400 line-through">
                {product.originalPrice.toLocaleString()} ETB
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

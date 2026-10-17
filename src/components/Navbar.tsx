import React from 'react';
import { ShoppingBag, User, Phone, ShieldCheck, Search, Send, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: UserProfile | null;
  onOpenAccount: () => void;
  onOpenTracker: () => void;
  onOpenManager: () => void;
  onOpenWallpaper: () => void;
  phone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAccount,
  onOpenTracker,
  onOpenManager,
  onOpenWallpaper,
  phone,
}) => {
  return (
    <>
      {/* Top micro-announcement bar (<= 40px, non-intrusive) */}
      <div className="bg-stone-950 text-stone-300 text-[11px] py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-amber-400">Direct Bank Transfer:</span>
            <span>CBE (1000523635593) · Siinqee (1105530900114) · Telebirr (0939086430)</span>
          </div>
          <div className="hidden sm:flex items-center gap-3.5 shrink-0 text-stone-400">
            <button
              onClick={onOpenWallpaper}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Wallpapers</span>
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="https://t.me/kanoman3908"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-300 text-stone-300 transition-colors flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>@kanoman3908</span>
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://t.me/luv390"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-300 text-amber-300 transition-colors flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-amber-400" />
              <span>Channel @luv390</span>
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenTracker}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenManager}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Store Manager
            </button>
            <span aria-hidden="true">·</span>
            <a href={`tel:${phone}`} className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar: Strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-600 inline-block" />
            <span>Kananisa Store</span>
          </a>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a
              href="#catalog"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Collection
            </a>
            <a
              href="#bank-accounts"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Bank Accounts
            </a>
            <button
              onClick={onOpenWallpaper}
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 text-stone-600 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Wallpapers</span>
            </button>
            <button
              onClick={onOpenTracker}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-stone-600"
            >
              Track Order
            </button>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* User Account Button */}
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-800 transition-all whitespace-nowrap shrink-0"
              title="Account & Profile"
            >
              <User className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline max-w-[120px] truncate">
                {currentUser ? currentUser.fullName.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="font-mono-nums font-bold">
                {cartCount > 0 ? `${cartCount} items` : 'Bag'}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

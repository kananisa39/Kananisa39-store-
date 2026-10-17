import React, { useState } from 'react';
import { X, Download, Smartphone, Monitor, Eye, Check, Sparkles, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings & { telebirr?: string };
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const wallpapers = [
    {
      id: 'desktop-showroom',
      title: 'Kananisa Store Luxury Showroom',
      subtitle: 'Modern Addis Ababa Flagship Boutique',
      type: 'desktop' as const,
      aspect: '16:9 Ultra HD (3840 x 2160)',
      image: '/src/assets/images/wallpaper_kananisa_desktop_1792191344252.jpg',
      badge: 'Official Showroom',
    },
    {
      id: 'mobile-lifestyle',
      title: 'Kananisa Gold & Noir Mobile Edition',
      subtitle: 'Fashion, Gadgets & Lifestyle Lockscreen',
      type: 'mobile' as const,
      aspect: '9:16 Vertical Phone (1080 x 1920)',
      image: '/src/assets/images/wallpaper_kananisa_mobile_1792191345212.jpg',
      badge: 'Phone Lockscreen',
    },
    {
      id: 'desktop-storefront',
      title: 'Kananisa Store Architectural Ambient',
      subtitle: 'Evening Illumination & Modern Timber Shelves',
      type: 'desktop' as const,
      aspect: '16:9 Widescreen (2560 x 1440)',
      image: '/src/assets/images/hero_kananisa_storefront_1792189094841.jpg',
      badge: 'Architectural',
    },
  ];

  const filteredWallpapers = wallpapers.filter(w =>
    selectedFormat === 'all' ? true : w.type === selectedFormat
  );

  const handleDownload = (imgUrl: string, title: string, id: string) => {
    setDownloadingId(id);
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_wallpaper.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">
                Official Kananisa Store Wallpapers
              </h2>
              <p className="text-xs text-amber-300">
                Quality Products · Best Price · Your Satisfaction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close Wallpaper Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Poster Badge */}
        <div className="p-4 sm:px-6 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedFormat('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedFormat === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              All Wallpapers
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('desktop')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                selectedFormat === 'desktop'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop 16:9</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat('mobile')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                selectedFormat === 'mobile'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile 9:16</span>
            </button>
          </div>

          <div className="text-xs text-stone-600 flex items-center gap-2">
            <span className="font-semibold text-stone-900">Official Brand Helpline:</span>
            <a
              href={`tel:${settings.phone}`}
              className="font-mono-nums font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Brand Signature Poster Card (Reflecting user's uploaded poster) */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 bg-stone-950 text-white p-6 sm:p-8 shadow-md">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Kananisa Store Brand Identity</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display uppercase tracking-tight">
                  KANANISA STORE
                </h3>
                
                <p className="text-stone-300 text-xs sm:text-sm font-medium italic">
                  "Quality Products · Best Price, Your Satisfaction"
                </p>

                {/* 4 Pillars from the poster */}
                <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-lg text-center">
                    <span className="text-amber-400 font-bold block text-sm">FASHION</span>
                    <span className="text-[10px] text-stone-400">Habesha & Modern</span>
                  </div>
                  <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-lg text-center">
                    <span className="text-amber-400 font-bold block text-sm">GROCERIES</span>
                    <span className="text-[10px] text-stone-400">Daily Essentials</span>
                  </div>
                  <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-lg text-center">
                    <span className="text-amber-400 font-bold block text-sm">HOME NEEDS</span>
                    <span className="text-[10px] text-stone-400">Living & Comfort</span>
                  </div>
                  <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-lg text-center">
                    <span className="text-amber-400 font-bold block text-sm">ACCESSORIES</span>
                    <span className="text-[10px] text-stone-400">Tech & Fragrance</span>
                  </div>
                </div>
              </div>

              {/* Phone Order Badge */}
              <div className="bg-amber-400 text-stone-950 rounded-xl p-5 text-center flex flex-col items-center justify-center shrink-0 w-full md:w-auto shadow-lg">
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1">
                  Direct Store Orders
                </div>
                <div className="text-2xl font-black font-mono-nums flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>0939086430</span>
                </div>
                <div className="text-[11px] font-semibold mt-1">
                  Telegram: @kanoman3908 · Channel: @luv390
                </div>
              </div>
            </div>
          </div>

          {/* Wallpapers Grid */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
              Select & Download High Resolution Wallpapers
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWallpapers.map(wall => (
                <div
                  key={wall.id}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative overflow-hidden bg-stone-900 flex items-center justify-center">
                    <img
                      src={wall.image}
                      alt={wall.title}
                      referrerPolicy="no-referrer"
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-102 ${
                        wall.type === 'mobile' ? 'max-h-[380px] object-top' : 'aspect-video'
                      }`}
                    />
                    <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded bg-stone-950/80 text-amber-400 backdrop-blur-md">
                      {wall.badge}
                    </span>
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono-nums px-2 py-0.5 rounded bg-black/70 text-stone-200">
                      {wall.aspect}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h5 className="text-sm font-bold text-stone-900 font-display">
                        {wall.title}
                      </h5>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {wall.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <a
                        href={wall.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Fullscreen</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDownload(wall.image, wall.title, wall.id)}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        {downloadingId === wall.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Downloaded</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>Download High-Res</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Official brand assets of Kananisa Store · Addis Ababa</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

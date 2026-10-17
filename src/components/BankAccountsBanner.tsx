import React, { useState } from 'react';
import { Copy, Check, Phone, Send, ShieldCheck, CreditCard, Building2, Smartphone } from 'lucide-react';
import { StoreSettings } from '../types';

interface BankAccountsBannerProps {
  settings: StoreSettings & { telebirr?: string };
}

export const BankAccountsBanner: React.FC<BankAccountsBannerProps> = ({ settings }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  return (
    <section id="bank-accounts" className="py-12 bg-stone-900 text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-stone-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Verified Payment Channels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Direct Bank Transfer & Telebirr Accounts
            </h2>
            <p className="mt-1 text-sm text-stone-400 max-w-2xl">
              Pay securely via Commercial Bank of Ethiopia (CBE), Siinqee Bank, or Telebirr. All accounts registered under store owner <span className="text-white font-medium">Kananisa Gabre</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg border border-stone-700 transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call: {settings.phone}</span>
            </a>
            <a
              href={`https://t.me/${settings.telegramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-sky-700 hover:bg-sky-600 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chat @{settings.telegramHandle.replace('@', '')}</span>
            </a>
            <a
              href="https://t.me/luv390"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Channel @luv390</span>
            </a>
          </div>
        </div>

        {/* 3 Main Payment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Commercial Bank of Ethiopia (CBE) */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 relative group hover:border-purple-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-900/60 border border-purple-700/60 flex items-center justify-center text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">Commercial Bank of Ethiopia</h3>
                    <span className="text-xs text-purple-300">CBE Birr & Mobile Banking</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
                  CBE
                </span>
              </div>

              <div className="bg-stone-900/90 rounded-lg p-3.5 border border-stone-800 my-4">
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-1">Account Number</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono-nums font-semibold text-white tracking-wide">
                    {settings.cbeAccount}
                  </span>
                  <button
                    onClick={() => copyToClipboard(settings.cbeAccount, 'cbe')}
                    className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                    title="Copy Account Number"
                    aria-label="Copy CBE Account Number"
                  >
                    {copiedKey === 'cbe' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <Check className="w-4 h-4" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-400">
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-500">Account Name:</span>
                  <span className="text-stone-200 font-medium">{settings.ownerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-500">Verification:</span>
                  <span className="text-emerald-400 font-medium">Active & Instant Confirmation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(settings.cbeAccount, 'cbe-btn')}
              className="mt-5 w-full py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-purple-900/50 border border-stone-700 hover:border-purple-600 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              {copiedKey === 'cbe-btn' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Account Number Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy CBE Account (1000523635593)</span>
                </>
              )}
            </button>
          </div>

          {/* Siinqee Bank */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 relative group hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">Siinqee Bank S.C.</h3>
                    <span className="text-xs text-amber-300">Siinqee Mobile & Branch</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
                  Siinqee
                </span>
              </div>

              <div className="bg-stone-900/90 rounded-lg p-3.5 border border-stone-800 my-4">
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-1">Account Number</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono-nums font-semibold text-white tracking-wide">
                    {settings.siinqeeAccount}
                  </span>
                  <button
                    onClick={() => copyToClipboard(settings.siinqeeAccount, 'siinqee')}
                    className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                    title="Copy Account Number"
                    aria-label="Copy Siinqee Account Number"
                  >
                    {copiedKey === 'siinqee' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <Check className="w-4 h-4" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-400">
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-500">Account Name:</span>
                  <span className="text-stone-200 font-medium">{settings.ownerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-500">Verification:</span>
                  <span className="text-emerald-400 font-medium">Active & Instant Confirmation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(settings.siinqeeAccount, 'siinqee-btn')}
              className="mt-5 w-full py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-amber-950/60 border border-stone-700 hover:border-amber-600 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              {copiedKey === 'siinqee-btn' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Account Number Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Siinqee (1105530900114)</span>
                </>
              )}
            </button>
          </div>

          {/* Telebirr & Direct Phone */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 relative group hover:border-teal-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-700/60 flex items-center justify-center text-teal-300">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">Telebirr & Phone Order</h3>
                    <span className="text-xs text-teal-300">Instant Mobile Transfer & Support</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-950/80 border border-teal-800 text-teal-300">
                  Telebirr
                </span>
              </div>

              <div className="bg-stone-900/90 rounded-lg p-3.5 border border-stone-800 my-4">
                <div className="text-[11px] text-stone-400 uppercase tracking-wider mb-1">Telebirr / Phone Number</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono-nums font-semibold text-white tracking-wide">
                    {settings.telebirr || settings.phone}
                  </span>
                  <button
                    onClick={() => copyToClipboard(settings.telebirr || settings.phone, 'telebirr')}
                    className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
                    title="Copy Phone Number"
                    aria-label="Copy Telebirr Number"
                  >
                    {copiedKey === 'telebirr' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <Check className="w-4 h-4" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-400">
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-500">Beneficiary Name:</span>
                  <span className="text-stone-200 font-medium">{settings.ownerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800/60">
                  <span className="text-stone-500">Order Dispatch:</span>
                  <span className="text-teal-300 font-medium">Within 2 Hours in Addis</span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Now</span>
              </a>
              <button
                onClick={() => copyToClipboard(settings.telebirr || settings.phone, 'telebirr-btn')}
                className="py-2 px-3 rounded-lg bg-teal-900/40 hover:bg-teal-900/60 border border-teal-700/60 text-xs font-semibold text-teal-200 transition-all flex items-center justify-center gap-1.5"
              >
                {copiedKey === 'telebirr-btn' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Telebirr</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step How It Works Guide */}
        <div className="mt-8 pt-6 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-amber-400 font-bold text-sm">01.</span>
            <div>
              <div className="font-semibold text-stone-200">Select Items</div>
              <p className="text-stone-400 text-[11px] mt-0.5">Add products to your cart and proceed to checkout.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-amber-400 font-bold text-sm">02.</span>
            <div>
              <div className="font-semibold text-stone-200">Transfer Funds</div>
              <p className="text-stone-400 text-[11px] mt-0.5">Transfer total to CBE, Siinqee, or Telebirr above.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-amber-400 font-bold text-sm">03.</span>
            <div>
              <div className="font-semibold text-stone-200">Provide Ref or Slip</div>
              <p className="text-stone-400 text-[11px] mt-0.5">Enter transaction ID or screenshot slip during checkout.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-amber-400 font-bold text-sm">04.</span>
            <div>
              <div className="font-semibold text-stone-200">Fast Delivery</div>
              <p className="text-stone-400 text-[11px] mt-0.5">Order confirmed and dispatched directly to your doorstep.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

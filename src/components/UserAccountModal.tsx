import React, { useState } from 'react';
import { 
  X, User, MapPin, CreditCard, Clock, LogOut, Plus, Trash2, Edit3, 
  Check, Building2, Smartphone, ShieldCheck, ShoppingBag, Eye, Printer, ChevronRight
} from 'lucide-react';
import { UserProfile, SavedAddress, Order, PaymentMethod } from '../types';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  userOrders: Order[];
  onOpenOrderTracking: (orderId: string) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateUser,
  userOrders,
  onOpenOrderTracking,
}) => {
  // Navigation tabs when logged in
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'orders'>('profile');
  
  // Auth mode if not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('kananisagabre738@gmail.com');
  const [loginPassword, setLoginPassword] = useState('kananisa123');

  // Register form state
  const [regName, setRegName] = useState('Kananisa Gabre');
  const [regPhone, setRegPhone] = useState('0939086430');
  const [regEmail, setRegEmail] = useState('kananisagabre738@gmail.com');
  const [regPassword, setRegPassword] = useState('');
  const [regCbe, setRegCbe] = useState('1000523635593');
  const [regSiinqee, setRegSiinqee] = useState('1105530900114');
  const [regTelebirr, setRegTelebirr] = useState('0939086430');

  // Edit Profile state
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Edit Payment Accounts state
  const [editCbe, setEditCbe] = useState(currentUser?.paymentProfile?.cbeAccount || '1000523635593');
  const [editSiinqee, setEditSiinqee] = useState(currentUser?.paymentProfile?.siinqeeAccount || '1105530900114');
  const [editTelebirr, setEditTelebirr] = useState(currentUser?.paymentProfile?.telebirrNumber || '0939086430');
  const [editPreferredMethod, setEditPreferredMethod] = useState<PaymentMethod>(
    currentUser?.paymentProfile?.preferredMethod || 'cbe_bank'
  );
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);

  // Address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState(currentUser?.fullName || '');
  const [addrPhone, setAddrPhone] = useState(currentUser?.phone || '');
  const [addrCity, setAddrCity] = useState('Addis Ababa');
  const [addrSubcity, setAddrSubcity] = useState('Bole Medhanialem');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Selected order for detailed view
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Handle Login
  const handlePerformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      fullName: loginEmailOrPhone.includes('kananisa') ? 'Kananisa Gabre' : 'Customer Account',
      email: loginEmailOrPhone.includes('@') ? loginEmailOrPhone : `${loginEmailOrPhone}@kananisa.et`,
      phone: loginEmailOrPhone.startsWith('09') ? loginEmailOrPhone : '0939086430',
      registeredAt: new Date().toISOString(),
      addresses: [
        {
          id: 'addr-' + Date.now(),
          label: 'Default Address',
          recipientName: 'Kananisa Gabre',
          phone: '0939086430',
          city: 'Addis Ababa',
          subcityOrArea: 'Bole Medhanialem',
          streetDetails: 'Near Morning Star Mall',
          isDefault: true,
        },
      ],
      paymentProfile: {
        cbeAccount: '1000523635593',
        siinqeeAccount: '1105530900114',
        telebirrNumber: '0939086430',
        preferredMethod: 'cbe_bank',
      },
    };
    onLogin(newUser);
  };

  // Handle Quick Demo Login
  const handleQuickDemoLogin = () => {
    const demoUser: UserProfile = {
      id: 'usr-kananisa-01',
      fullName: 'Kananisa Gabre',
      email: 'kananisagabre738@gmail.com',
      phone: '0939086430',
      registeredAt: '2026-10-10T09:00:00Z',
      addresses: [
        {
          id: 'addr-01',
          label: 'Residence',
          recipientName: 'Kananisa Gabre',
          phone: '0939086430',
          city: 'Addis Ababa',
          subcityOrArea: 'Bole Medhanialem',
          streetDetails: 'Near Morning Star Mall, House 214',
          isDefault: true,
        },
        {
          id: 'addr-02',
          label: 'Shop / Commerce Hub',
          recipientName: 'Kananisa Gabre',
          phone: '0939086430',
          city: 'Addis Ababa',
          subcityOrArea: 'Piassa Hub',
          streetDetails: 'Churchill Road, Commerce Tower',
          isDefault: false,
        },
      ],
      paymentProfile: {
        cbeAccount: '1000523635593',
        siinqeeAccount: '1105530900114',
        telebirrNumber: '0939086430',
        preferredMethod: 'cbe_bank',
      },
    };
    onLogin(demoUser);
    setEditName(demoUser.fullName);
    setEditPhone(demoUser.phone);
    setEditEmail(demoUser.email);
  };

  // Handle Register
  const handlePerformRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      fullName: regName || 'Kananisa Customer',
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      registeredAt: new Date().toISOString(),
      addresses: [
        {
          id: 'addr-' + Date.now(),
          label: 'Primary Address',
          recipientName: regName || 'Kananisa Customer',
          phone: regPhone,
          city: 'Addis Ababa',
          subcityOrArea: 'Bole',
          streetDetails: 'Addis Ababa, Ethiopia',
          isDefault: true,
        },
      ],
      paymentProfile: {
        cbeAccount: regCbe || '1000523635593',
        siinqeeAccount: regSiinqee || '1105530900114',
        telebirrNumber: regTelebirr || '0939086430',
        preferredMethod: 'cbe_bank',
      },
    };
    onLogin(newUser);
  };

  // Save updated profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      fullName: editName,
      phone: editPhone,
      email: editEmail,
    };
    onUpdateUser(updated);
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 2500);
  };

  // Save payment accounts
  const handleSavePayments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      paymentProfile: {
        cbeAccount: editCbe,
        siinqeeAccount: editSiinqee,
        telebirrNumber: editTelebirr,
        preferredMethod: editPreferredMethod,
      },
    };
    onUpdateUser(updated);
    setPaymentSuccessMsg(true);
    setTimeout(() => setPaymentSuccessMsg(false), 2500);
  };

  // Save Address (Add or Edit)
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    let updatedAddresses = [...currentUser.addresses];

    if (addrIsDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddressId) {
      updatedAddresses = updatedAddresses.map(a =>
        a.id === editingAddressId
          ? {
              ...a,
              label: addrLabel,
              recipientName: addrRecipient,
              phone: addrPhone,
              city: addrCity,
              subcityOrArea: addrSubcity,
              streetDetails: addrStreet,
              isDefault: addrIsDefault || a.isDefault,
            }
          : a
      );
    } else {
      const newAddr: SavedAddress = {
        id: 'addr-' + Date.now(),
        label: addrLabel,
        recipientName: addrRecipient,
        phone: addrPhone,
        city: addrCity,
        subcityOrArea: addrSubcity,
        streetDetails: addrStreet,
        isDefault: addrIsDefault || updatedAddresses.length === 0,
      };
      updatedAddresses.push(newAddr);
    }

    onUpdateUser({
      ...currentUser,
      addresses: updatedAddresses,
    });

    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddrStreet('');
  };

  // Delete address
  const handleDeleteAddress = (id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    onUpdateUser({
      ...currentUser,
      addresses: updated,
    });
  };

  // Set default address
  const handleSetDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    onUpdateUser({
      ...currentUser,
      addresses: updated,
    });
  };

  // Open edit address
  const handleStartEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrRecipient(addr.recipientName);
    setAddrPhone(addr.phone);
    setAddrCity(addr.city);
    setAddrSubcity(addr.subcityOrArea);
    setAddrStreet(addr.streetDetails);
    setAddrIsDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                {currentUser ? currentUser.fullName : 'Account Center'}
              </h2>
              <p className="text-xs text-stone-500">
                {currentUser ? currentUser.email : 'Sign in to access your profile, addresses & orders'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            aria-label="Close Account Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In View */}
        {!currentUser ? (
          <div className="p-6 overflow-y-auto">
            {/* Quick Demo Login Banner */}
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Store Owner & VIP Demo Account
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  Sign in instantly with Kananisa Gabre (CBE 1000523635593, Siinqee 1105530900114, Telebirr 0939086430)
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm shrink-0"
              >
                Sign In As Kananisa
              </button>
            </div>

            {/* Auth Mode Switcher */}
            <div className="flex border-b border-stone-200 mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                  authMode === 'login'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                  authMode === 'register'
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Create New Profile
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handlePerformLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address or Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={loginEmailOrPhone}
                    onChange={e => setLoginEmailOrPhone(e.target.value)}
                    placeholder="e.g. 0939086430 or kananisagabre738@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handlePerformRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Kananisa Gabre"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="0939086430"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="kananisagabre738@gmail.com"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                {/* Pre-fill / Associate Bank Accounts */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Associate Payment Accounts (For Instant Checkout & Refunds)</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Commercial Bank of Ethiopia (CBE) Account
                    </label>
                    <input
                      type="text"
                      value={regCbe}
                      onChange={e => setRegCbe(e.target.value)}
                      placeholder="1000523635593"
                      className="w-full px-3 py-1.5 text-xs font-mono-nums rounded-lg border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Siinqee Bank Account
                    </label>
                    <input
                      type="text"
                      value={regSiinqee}
                      onChange={e => setRegSiinqee(e.target.value)}
                      placeholder="1105530900114"
                      className="w-full px-3 py-1.5 text-xs font-mono-nums rounded-lg border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Telebirr Registered Number
                    </label>
                    <input
                      type="text"
                      value={regTelebirr}
                      onChange={e => setRegTelebirr(e.target.value)}
                      placeholder="0939086430"
                      className="w-full px-3 py-1.5 text-xs font-mono-nums rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
                >
                  Create Account & Save Profile
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Logged In View */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-stone-200 px-6 bg-stone-50/50 gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => { setActiveTab('profile'); setShowAddressForm(false); }}
                className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Info</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('addresses'); setShowAddressForm(false); }}
                className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'addresses'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Saved Addresses ({currentUser.addresses.length})</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('payments'); setShowAddressForm(false); }}
                className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'payments'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Bank & Payments</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('orders'); setShowAddressForm(false); }}
                className={`py-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-stone-900 text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Order History ({userOrders.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* TAB 1: Profile Info */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  {profileSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Save Profile Changes
                    </button>

                    <button
                      type="button"
                      onClick={onLogout}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium py-2 px-3 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Saved Shipping Addresses */}
              {activeTab === 'addresses' && (
                <div>
                  {!showAddressForm ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-stone-500">
                          Manage your Addis Ababa and regional delivery destinations for fast 1-click checkout.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddrLabel('Home');
                            setAddrRecipient(currentUser.fullName);
                            setAddrPhone(currentUser.phone);
                            setAddrCity('Addis Ababa');
                            setAddrSubcity('Bole');
                            setAddrStreet('');
                            setAddrIsDefault(currentUser.addresses.length === 0);
                            setShowAddressForm(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Address</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {currentUser.addresses.map(addr => (
                          <div
                            key={addr.id}
                            className={`p-4 rounded-xl border transition-all ${
                              addr.isDefault
                                ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                                : 'bg-white border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-stone-900">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditAddress(addr)}
                                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded"
                                  title="Edit Address"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {currentUser.addresses.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                    title="Delete Address"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 text-xs text-stone-600 space-y-0.5">
                              <div className="font-medium text-stone-800">
                                {addr.recipientName} · {addr.phone}
                              </div>
                              <div>{addr.streetDetails}</div>
                              <div className="text-stone-500">
                                {addr.subcityOrArea}, {addr.city}, Ethiopia
                              </div>
                            </div>

                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="mt-3 text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
                              >
                                Set as default shipping address
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Address Form */
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <h3 className="text-sm font-bold text-stone-900">
                          {editingAddressId ? 'Edit Address' : 'Add New Shipping Address'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="text-xs text-stone-500 hover:text-stone-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Address Label (e.g. Home, Office)
                          </label>
                          <input
                            type="text"
                            required
                            value={addrLabel}
                            onChange={e => setAddrLabel(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Recipient Name
                          </label>
                          <input
                            type="text"
                            required
                            value={addrRecipient}
                            onChange={e => setAddrRecipient(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Delivery Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={addrPhone}
                            onChange={e => setAddrPhone(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            City / Region
                          </label>
                          <select
                            value={addrCity}
                            onChange={e => setAddrCity(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
                          >
                            <option value="Addis Ababa">Addis Ababa</option>
                            <option value="Adama (Nazret)">Adama (Nazret)</option>
                            <option value="Hawassa">Hawassa</option>
                            <option value="Dire Dawa">Dire Dawa</option>
                            <option value="Bahir Dar">Bahir Dar</option>
                            <option value="Jimma">Jimma</option>
                            <option value="Bishoftu (Debre Zeyit)">Bishoftu</option>
                            <option value="Other Regional City">Other Regional City</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Subcity or Area (e.g. Bole, CMC, Piassa, Kazanchis)
                        </label>
                        <input
                          type="text"
                          required
                          value={addrSubcity}
                          onChange={e => setAddrSubcity(e.target.value)}
                          placeholder="e.g. Bole Medhanialem or CMC Michael"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Street Details & Landmarks (House #, building, specific spot)
                        </label>
                        <input
                          type="text"
                          required
                          value={addrStreet}
                          onChange={e => setAddrStreet(e.target.value)}
                          placeholder="e.g. Behind Edna Mall, Next to Alem Cinema, House 412"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="isDefaultCheckbox"
                          checked={addrIsDefault}
                          onChange={e => setAddrIsDefault(e.target.checked)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="isDefaultCheckbox" className="text-xs text-stone-700 cursor-pointer">
                          Make this my default shipping address
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: Bank & Payment Accounts */}
              {activeTab === 'payments' && (
                <form onSubmit={handleSavePayments} className="space-y-5 max-w-lg">
                  {paymentSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Bank payment details updated successfully!</span>
                    </div>
                  )}

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Associated Payment Credentials</span>
                    </div>
                    These bank accounts are linked to your profile for seamless transfer reconciliation, instant verification, and automatic refunds if required.
                  </div>

                  {/* CBE Account */}
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded bg-purple-900 text-amber-400 flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Commercial Bank of Ethiopia (CBE)</div>
                        <div className="text-[11px] text-purple-700">CBE Birr & Mobile Account</div>
                      </div>
                    </div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Your Linked CBE Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editCbe}
                      onChange={e => setEditCbe(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-nums font-semibold bg-white rounded-lg border border-stone-300"
                    />
                    <div className="text-[11px] text-stone-500 mt-1">Default: 1000523635593</div>
                  </div>

                  {/* Siinqee Bank */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded bg-amber-700 text-white flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Siinqee Bank S.C.</div>
                        <div className="text-[11px] text-amber-800">Siinqee Mobile & Branch Transfer</div>
                      </div>
                    </div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Your Linked Siinqee Bank Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editSiinqee}
                      onChange={e => setEditSiinqee(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-nums font-semibold bg-white rounded-lg border border-stone-300"
                    />
                    <div className="text-[11px] text-stone-500 mt-1">Default: 1105530900114</div>
                  </div>

                  {/* Telebirr */}
                  <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded bg-teal-800 text-teal-200 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">Telebirr Mobile Payment</div>
                        <div className="text-[11px] text-teal-800">Direct Telebirr Wallet Phone</div>
                      </div>
                    </div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Your Telebirr Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={editTelebirr}
                      onChange={e => setEditTelebirr(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-nums font-semibold bg-white rounded-lg border border-stone-300"
                    />
                    <div className="text-[11px] text-stone-500 mt-1">Default: 0939086430</div>
                  </div>

                  {/* Preferred payment selection */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Default Checkout Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditPreferredMethod('cbe_bank')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                          editPreferredMethod === 'cbe_bank'
                            ? 'bg-purple-900 text-white border-purple-900'
                            : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        CBE Bank
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditPreferredMethod('siinqee_bank')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                          editPreferredMethod === 'siinqee_bank'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        Siinqee Bank
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditPreferredMethod('telebirr')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                          editPreferredMethod === 'telebirr'
                            ? 'bg-teal-800 text-white border-teal-800'
                            : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        Telebirr
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Save Payment Accounts
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: Order History */}
              {activeTab === 'orders' && (
                <div>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-stone-800">No Orders Placed Yet</h3>
                      <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                        Your completed orders, bank transfer references, and delivery status will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map(order => (
                        <div
                          key={order.id}
                          className="bg-white border border-stone-200 rounded-xl p-4.5 hover:shadow-sm transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono-nums font-bold text-stone-900 text-sm">
                                  {order.id}
                                </span>
                                <span
                                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
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
                              <span className="text-[11px] text-stone-400">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-bold font-mono-nums text-stone-900">
                                {order.total.toLocaleString()} ETB
                              </span>
                              <div className="text-[11px] text-stone-500 uppercase">
                                via {order.paymentMethod.replace('_', ' ')}
                              </div>
                            </div>
                          </div>

                          {/* Order items */}
                          <div className="py-3 space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono-nums text-stone-400">{item.quantity}x</span>
                                  <span className="font-medium text-stone-800 truncate max-w-xs">
                                    {item.product.name}
                                  </span>
                                  {item.selectedColor && (
                                    <span className="text-stone-400">({item.selectedColor})</span>
                                  )}
                                </div>
                                <span className="font-mono-nums text-stone-700">
                                  {(item.product.price * item.quantity).toLocaleString()} ETB
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Footer with actions */}
                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                            <div className="text-[11px] text-stone-500">
                              <span className="font-medium text-stone-700">Delivery:</span> {order.deliveryCity}
                              {order.bankTransactionRef && (
                                <span className="ml-2 font-mono-nums">
                                  · Ref: {order.bankTransactionRef}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenOrderTracking(order.id)}
                                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 inline-flex items-center gap-1 transition-colors"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                                <span>Track</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setViewingOrder(order)}
                                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium inline-flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Receipt</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Receipt Viewer */}
        {viewingOrder && (
          <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setViewingOrder(null)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-4 border-b border-stone-200">
                <h3 className="font-display font-bold text-lg text-stone-900">Kananisa Store</h3>
                <div className="text-xs text-stone-500">Official Purchase Invoice & Receipt</div>
                <div className="mt-1 font-mono-nums font-bold text-stone-800 text-sm">{viewingOrder.id}</div>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer:</span>
                  <span className="font-medium text-stone-800">{viewingOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-mono-nums text-stone-800">{viewingOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Address:</span>
                  <span className="text-stone-800 text-right">{viewingOrder.deliveryAddress}, {viewingOrder.deliveryCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Channel:</span>
                  <span className="font-semibold text-stone-900 uppercase">{viewingOrder.paymentMethod.replace('_', ' ')}</span>
                </div>
                {viewingOrder.bankTransactionRef && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Transaction Ref:</span>
                    <span className="font-mono-nums font-bold text-stone-900">{viewingOrder.bankTransactionRef}</span>
                  </div>
                )}
              </div>

              <div className="py-3 border-y border-stone-200 space-y-1.5 text-xs">
                {viewingOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantity}x {it.product.name}</span>
                    <span className="font-mono-nums">{(it.product.price * it.quantity).toLocaleString()} ETB</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100 text-sm">
                  <span>Total Amount</span>
                  <span className="font-mono-nums">{viewingOrder.total.toLocaleString()} ETB</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="flex-1 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export interface Product {
  id: string;
  name: string;
  category: 'electronics' | 'audio_wearables' | 'habesha_fashion' | 'footwear' | 'perfumes';
  categoryLabel: string;
  price: number; // in ETB (Ethiopian Birr)
  originalPrice?: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type PaymentMethod = 'cbe_bank' | 'siinqee_bank' | 'telebirr' | 'cash_on_delivery';

export type OrderStatus = 'pending_verification' | 'payment_confirmed' | 'processing' | 'shipped' | 'delivered';

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  recipientName: string;
  phone: string;
  city: string; // e.g. "Addis Ababa"
  subcityOrArea: string; // e.g. "Bole Medhanialem", "CMC", "Piassa"
  streetDetails: string; // e.g. "House 402, Near Edna Mall"
  isDefault: boolean;
}

export interface UserPaymentProfile {
  cbeAccount: string;
  siinqeeAccount: string;
  telebirrNumber: string;
  preferredMethod: PaymentMethod;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  registeredAt: string;
  addresses: SavedAddress[];
  paymentProfile: UserPaymentProfile;
}

export interface Order {
  id: string; // e.g. KS-9412
  userId?: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  bankTransactionRef?: string;
  slipImagePreview?: string;
  status: OrderStatus;
  notes?: string;
}

export interface BankAccountInfo {
  bankName: string;
  bankShortCode: 'CBE' | 'Siinqee';
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  colorTheme: string;
  logoBg: string;
  accentBorder: string;
  instruction: string;
}

export interface StoreSettings {
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  cbeAccount: string;
  siinqeeAccount: string;
  telegramHandle: string;
  telegramChannel?: string;
  address: string;
  freeDeliveryThreshold: number;
}

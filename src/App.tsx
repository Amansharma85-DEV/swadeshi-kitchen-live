import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Minus,
  Moon,
  Phone,
  Plus,
  QrCode,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  UserRound,
  WalletCards,
  X
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { readLocalOrders, storeOrder, type StoredOrder } from './lib/firebase';

type MenuItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag: string;
};

type CartLine = MenuItem & {
  quantity: number;
};

type Customer = {
  name: string;
  phone: string;
  address: string;
  note: string;
};

const phoneNumber = '+919310575998';
const whatsAppOrderNumber = '919599749976';
const displayPhoneNumber = '+91 93105 75998';
const businessEmail = 'swadeshikitchen0@gmail.com';
const businessAddress = '53-A Arjun Park, Najafgarh, New Delhi 110043';
const zomatoUrl = 'https://zomato.onelink.me/xqzv/gv2aw1bn';
const instagramUrl = 'https://www.instagram.com/swade_shikitchen?igsh=MTI2MDk2ejc3OHF1aw==';
const upiId = '9310575998@ybl';
const brand = 'Swadeshi Kitchen';

const formatCurrency = (amount: number) => `Rs ${amount.toLocaleString('en-IN')}`;

function ZomatoLogo() {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-md bg-white text-[11px] font-black lowercase text-[#e23744] shadow-sm">
      zomato
    </span>
  );
}

const menu: MenuItem[] = [
  {
    id: 1,
    name: 'Veg Thali',
    category: 'Daily Thali',
    description: 'Rice, dal or curry of the day, seasonal sabzi, boondi raita, salad and 3 tawa roti.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    tag: 'Daily'
  },
  {
    id: 2,
    name: 'Gobhi Paratha',
    category: 'Parathas',
    description: 'Served with curd and pickle. Choose 1 piece or order more for a fuller meal.',
    price: 79,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    tag: 'Homestyle'
  },
  {
    id: 3,
    name: 'Paneer Paratha',
    category: 'Parathas',
    description: 'Stuffed paneer paratha served hot with curd and pickle.',
    price: 119,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular'
  },
  {
    id: 4,
    name: 'Mooli Paratha',
    category: 'Parathas',
    description: 'Fresh mooli stuffing, home masala, curd and pickle.',
    price: 99,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    tag: 'Fresh'
  },
  {
    id: 5,
    name: 'Aloo Paratha',
    category: 'Parathas',
    description: 'Classic aloo paratha served with curd and pickle.',
    price: 79,
    image: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?auto=format&fit=crop&w=900&q=80',
    tag: 'Classic'
  },
  {
    id: 6,
    name: 'Aloo Pyaz Paratha',
    category: 'Parathas',
    description: 'Aloo and onion stuffing, served with curd and pickle.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80',
    tag: 'Value'
  },
  {
    id: 7,
    name: 'Ajwain Paratha',
    category: 'Parathas',
    description: '2 pieces served with aloo jeera, curd and pickle.',
    price: 139,
    image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=900&q=80',
    tag: 'Meal'
  },
  {
    id: 8,
    name: 'Luxurious Paratha',
    category: 'Parathas',
    description: 'Stuffed with aloo, mooli, gobhi, paneer and moong, served with pickle, curd and butter.',
    price: 139,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80',
    tag: 'Loaded'
  },
  {
    id: 9,
    name: 'Aloo Poori',
    category: 'Poori',
    description: '5 pooris served with curd and pickle.',
    price: 119,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=80',
    tag: 'Comfort'
  }
];

const dailyThalis = [
  ['Monday & Thursday', 'Rice, Yellow Dal, Aloo Jeera, Boondi Raita, Salad, 3 Tawa Roti'],
  ['Tuesday', 'Rice, Channa Masala, Mix Veg, Boondi Raita, Salad, 3 Roti'],
  ['Wednesday & Friday', 'Rice, Black Dal Tadka, Aloo Bhaji, Boondi Raita, Salad, 3 Roti'],
  ['Saturday', 'Rice, Rajma, Mix Veg, Boondi Raita, Salad, 3 Roti'],
  ['Sunday', 'Rice, Kadhi Pakora, Aloo Mutter, 3 Roti']
];

const parathaMenu = [
  ['Gobhi Paratha', '1 piece Rs 79', '2 pieces Rs 139'],
  ['Paneer Paratha', '1 piece Rs 119', '2 pieces Rs 189'],
  ['Mooli Paratha', '1 piece Rs 99', '2 pieces Rs 169'],
  ['Aloo Paratha', '1 piece Rs 79', '2 pieces Rs 139'],
  ['Aloo Pyaz Paratha', '1 piece Rs 89', '2 pieces Rs 159'],
  ['Ajwain Paratha', '2 pieces Rs 139', 'Aloo jeera, curd, pickle'],
  ['Luxurious Paratha', '1 piece Rs 139', '2 pieces Rs 199'],
  ['Aloo Poori', '5 pooris Rs 119', 'Curd and pickle']
];

const extraItems = [
  ['Dal', 'Half Rs 60', 'Full Rs 110'],
  ['Sabzi', 'Half Rs 60', 'Full Rs 110'],
  ['Rice', 'Half Rs 50', 'Full Rs 100'],
  ['Plain Tawa Roti', '1 pc Rs 12', '10 pcs Rs 100'],
  ['Ghee Tawa Roti', '1 pc Rs 15', '10 pcs Rs 130'],
  ['Butter Tawa Roti', '1 pc Rs 15', '10 pcs Rs 150']
];

const categories = ['All', ...Array.from(new Set(menu.map((item) => item.category)))];
const paymentMethods = ['PhonePe', 'Google Pay', 'UPI QR', 'Cash on Delivery'];
const deliveryMethods = ['Self delivery', 'Local delivery boys', 'Porter / Dunzo'];
const coupons = {
  SWADESHI10: { label: '10% off food bill', type: 'percent', value: 10 },
  FREEDEL: { label: 'Free delivery', type: 'delivery', value: 39 }
} as const;
const orderStages = ['Order placed', 'Cooking', 'Packed', 'Out for delivery', 'Delivered'];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('PhonePe');
  const [selectedDelivery, setSelectedDelivery] = useState('Self delivery');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [activeOrder, setActiveOrder] = useState<StoredOrder | null>(null);
  const [orderStep, setOrderStep] = useState(0);
  const [orders, setOrders] = useState<StoredOrder[]>(() => readLocalOrders());
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: phoneNumber,
    address: '',
    note: ''
  });

  const filteredMenu = selectedCategory === 'All'
    ? menu
    : menu.filter((item) => item.category === selectedCategory);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const baseDelivery = subtotal > 499 || subtotal === 0 ? 0 : 39;
    const coupon = coupons[appliedCoupon as keyof typeof coupons];
    const discount = coupon?.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : 0;
    const delivery = coupon?.type === 'delivery' ? 0 : baseDelivery;
    const taxes = Math.round((subtotal - discount) * 0.05);
    return {
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      delivery,
      taxes,
      grandTotal: Math.max(0, subtotal - discount + delivery + taxes)
    };
  }, [cart, appliedCoupon]);

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(brand)}&am=${totals.grandTotal}&cu=INR&tn=${encodeURIComponent('Swadeshi Kitchen order')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  const addToCart = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) {
        return current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line);
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, nextQuantity: number) => {
    setCart((current) => {
      if (nextQuantity <= 0) {
        return current.filter((line) => line.id !== id);
      }
      return current.map((line) => line.id === id ? { ...line, quantity: nextQuantity } : line);
    });
  };

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      setCouponMessage('Enter SWADESHI10 or FREEDEL.');
      return;
    }
    if (!coupons[normalized as keyof typeof coupons]) {
      setAppliedCoupon('');
      setCouponMessage('Coupon not valid.');
      return;
    }
    setAppliedCoupon(normalized);
    setCouponMessage(`${normalized} applied.`);
  };

  const createWhatsAppMessage = (order: StoredOrder) => {
    const lines = order.items.map((item) => `${item.quantity} x ${item.name} - ${formatCurrency(item.price * item.quantity)}`);
    return [
      '🍽️ *New Order Received*',
      '━━━━━━━━━━━━━━━━',
      '',
      '👤 *Customer Name*',
      order.customer.name,
      '',
      '📞 *Phone*',
      order.customer.phone,
      '',
      '📍 *Delivery Address*',
      order.customer.address,
      '',
      '🛒 *Order Items*',
      ...lines,
      '',
      '━━━━━━━━━━━━━━━━',
      `💰 *Total: ${formatCurrency(order.totals.grandTotal)}*`,
      `💳 *Payment Method: ${order.paymentMethod}*`,
      `📝 *Notes: ${order.customer.note || 'None'}*`,
      '',
      'Thank you for your order! ❤️'
    ].join('\n');
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!cart.length || !customer.name || !customer.address || !customer.phone) {
      setCouponMessage('Add items and fill customer details before placing an order.');
      return;
    }

    const order: StoredOrder = {
      id: `SK-${Date.now().toString().slice(-6)}`,
      customer,
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      totals,
      paymentMethod: selectedPayment,
      deliveryMethod: selectedDelivery,
      couponCode: appliedCoupon || 'None',
      status: orderStages[0],
      createdAt: new Date().toISOString()
    };

    const stored = await storeOrder(order);
    const savedOrder = { ...order, id: stored.id || order.id };
    setActiveOrder(savedOrder);
    setOrders([savedOrder, ...orders]);
    setOrderStep(0);
    setCouponMessage(`Order saved to ${stored.mode === 'firebase' ? 'Firebase' : 'local storage'}.`);

    const whatsappUrl = `https://wa.me/${whatsAppOrderNumber}?text=${encodeURIComponent(createWhatsAppMessage(savedOrder))}`;
    // Same-tab navigation is reliable on mobile browsers, which can block pop-up windows.
    window.location.assign(whatsappUrl);
  };

  const bulkOrderMessage = `Bulk order enquiry for ${brand}%0AName:%0AEvent date:%0AGuests:%0AAddress:%0ARequirements:`;
  const navItems = [
    { label: 'Daily Menu', id: 'daily-menu' },
    { label: 'Menu', id: 'menu' },
    { label: 'Bulk Orders', id: 'bulk-orders' },
    { label: 'Tracking', id: 'tracking' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#fffaf3] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <header className="sticky top-0 z-40 border-b border-orange-100 bg-[#fffaf3]/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="section-shell flex h-20 items-center justify-between">
            <a href="#" className="flex items-center gap-3 font-black" aria-label="Swadeshi Kitchen home">
              <img src="./logo.svg" alt="Swadeshi Kitchen logo" className="h-14 w-14 rounded-full object-contain shadow-sm" />
              <span className="text-lg leading-tight">
                Swadeshi
                <span className="block text-sm font-semibold text-orange-700 dark:text-orange-300">Kitchen</span>
              </span>
            </a>

            <nav className="hidden items-center gap-8 text-sm font-bold text-slate-700 dark:text-slate-200 md:flex">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="hover:text-orange-700">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" aria-label="Toggle dark mode">
                {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button type="button" onClick={() => setIsCartOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white text-orange-700 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <ShoppingBag size={21} />
                {totals.count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-slate-950 px-1 text-xs font-black text-white dark:bg-orange-500">
                    {totals.count}
                  </span>
                )}
              </button>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white md:hidden dark:border-slate-700 dark:bg-slate-900" onClick={() => setIsMenuOpen((value) => !value)} aria-label="Toggle menu">
                {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="section-shell flex flex-col gap-3 pb-5 text-sm font-bold md:hidden">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </header>

        <main>
          <section className="section-shell grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-orange-700 shadow-sm dark:bg-slate-900 dark:text-orange-300">
                <Sparkles size={16} />
                Homemade, healthy, heartfelt
              </p>
              <h1 className="text-5xl font-black leading-[1.02] text-slate-950 dark:text-white sm:text-6xl">
                Swadeshi Kitchen
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Homemade daily thalis and stuffed parathas for Dwarka, Delhi. Freshly made, pocket friendly, and ready for lunch, dinner, bulk orders and self pick-up.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#daily-menu" className="btn-primary inline-flex items-center gap-2">
                  <ShoppingBag size={18} />
                  View menu
                </a>
                <a href={`tel:${phoneNumber}`} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <Phone size={18} />
                  {displayPhoneNumber}
                </a>
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-5 py-3 font-black text-pink-700 dark:border-slate-700 dark:bg-slate-900 dark:text-pink-300">
                  <Instagram size={18} />
                  Instagram
                </a>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-center">
                {[
                  ['Rs 149', 'Veg Thali'],
                  ['12 PM', 'Opening'],
                  ['20%', 'Self pickup']
                ].map(([value, label]) => (
                  <motion.div whileHover={{ y: -4 }} key={label} className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
                    <div className="text-2xl font-black">{value}</div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-slate-950 shadow-soft">
              <img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85" alt="Swadeshi Kitchen meals" className="absolute inset-0 h-full w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-0 p-7 text-white">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <Star className="fill-orange-400 text-orange-400" size={18} />
                  Today's special
                </p>
                <h2 className="text-3xl font-black">Veg thali and stuffed parathas</h2>
                <p className="mt-2 max-w-md text-white/80">
                  Order direct, on Zomato, or message us for daily deals and bulk meal boxes.
                </p>
              </div>
            </motion.div>
          </section>

          <section id="daily-menu" className="bg-[#193d1d] py-16 text-white">
            <div className="section-shell">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-amber-200">Menu page</p>
                  <h2 className="mt-2 text-4xl font-black">Homemade taste. Pocket friendly. Fresh daily.</h2>
                  <p className="mt-4 max-w-xl text-white/80">
                    Veg thali changes through the week, so regular customers get familiar food without the same plate every day.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-sm font-bold text-amber-100">Veg Thali</p>
                      <p className="mt-1 text-3xl font-black">Rs 149</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-sm font-bold text-amber-100">Timings</p>
                      <p className="mt-1 text-2xl font-black">12 PM - 12 AM</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4">
                      <p className="text-sm font-bold text-amber-100">Self pick-up</p>
                      <p className="mt-1 text-3xl font-black">20% off</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={zomatoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-[#e23744] px-5 py-3 font-black text-white">
                      <ZomatoLogo />
                      Order on Zomato
                    </a>
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-[#193d1d]">
                      <Instagram size={18} />
                      Follow menu updates
                    </a>
                  </div>
                </div>

                <div className="rounded-lg bg-[#fff8e8] p-5 text-slate-950 shadow-soft">
                  <div className="flex items-center justify-between gap-4 border-b border-amber-200 pb-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wide text-orange-700">Day menu</p>
                      <h3 className="text-2xl font-black">Veg thali options</h3>
                    </div>
                    <span className="rounded-full bg-[#193d1d] px-4 py-2 text-xl font-black text-white">Rs 149</span>
                  </div>
                  <div className="mt-4 divide-y divide-amber-200">
                    {dailyThalis.map(([day, details]) => (
                      <div key={day} className="grid gap-2 py-4 md:grid-cols-[160px_1fr] md:items-start">
                        <p className="font-black text-[#193d1d]">{day}</p>
                        <p className="text-sm font-semibold leading-6 text-slate-700">{details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-lg bg-white p-5 text-slate-950 shadow-soft">
                  <p className="text-sm font-black uppercase tracking-wide text-purple-700">Paratha menu</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {parathaMenu.map(([name, one, two]) => (
                      <div key={name} className="rounded-lg border border-purple-100 bg-[#fffaf3] p-4">
                        <p className="font-black text-purple-800">{name}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-slate-700">
                          <span className="rounded-full bg-white px-3 py-1">{one}</span>
                          <span className="rounded-full bg-white px-3 py-1">{two}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-white p-5 text-slate-950 shadow-soft">
                  <p className="text-sm font-black uppercase tracking-wide text-orange-700">Extra items</p>
                  <div className="mt-4 divide-y divide-orange-100">
                    {extraItems.map(([item, half, full]) => (
                      <div key={item} className="grid grid-cols-[1fr_auto_auto] gap-3 py-3 text-sm">
                        <p className="font-black">{item}</p>
                        <p className="font-bold text-slate-600">{half}</p>
                        <p className="font-bold text-slate-600">{full}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-[#193d1d] p-4 text-white">
                    <p className="text-2xl font-black">Bulk orders and daily deals</p>
                    <p className="mt-2 text-sm font-semibold text-white/80">Call one day before for bulk orders and special discounts on daily orders.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="menu" className="bg-white py-16 dark:bg-slate-900">
            <div className="section-shell">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Fresh menu</p>
                  <h2 className="mt-2 text-4xl font-black">Made for delivery, plated like dine-in.</h2>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${selectedCategory === category ? 'bg-slate-950 text-white dark:bg-orange-500' : 'bg-orange-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMenu.map((item, index) => (
                  <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} key={item.id} className="overflow-hidden rounded-lg border border-orange-100 bg-[#fffaf3] shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-orange-700">
                        {item.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-black">{item.name}</h3>
                        <span className="font-black text-orange-700 dark:text-orange-300">{formatCurrency(item.price)}</span>
                      </div>
                      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      <button type="button" onClick={() => addToCart(item)} className="btn-primary mt-5 w-full">
                        Add to cart
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section id="tracking" className="section-shell py-16">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Live tracking</p>
                <h2 className="mt-2 text-4xl font-black">Follow every order stage.</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300">After checkout, the latest order appears here. The admin panel can advance the visible order stage.</p>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
                <p className="font-black">{activeOrder ? `Order ${activeOrder.id}` : 'No active order yet'}</p>
                <div className="mt-5 space-y-4">
                  {orderStages.map((stage, index) => (
                    <div key={stage} className="flex items-center gap-3">
                      <span className={`grid h-9 w-9 place-items-center rounded-full ${index <= orderStep ? 'bg-orange-600 text-white' : 'bg-orange-50 text-slate-500 dark:bg-slate-800'}`}>
                        {index <= orderStep ? <CheckCircle2 size={18} /> : index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-black">{stage}</p>
                        <div className="mt-2 h-2 rounded-full bg-orange-50 dark:bg-slate-800">
                          <div className="h-2 rounded-full bg-orange-600 transition-all" style={{ width: index <= orderStep ? '100%' : '0%' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="bulk-orders" className="section-shell py-16">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Bulk orders</p>
                <h2 className="mt-2 text-4xl font-black">Separate catering and party order desk.</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                  For office lunches, family functions, birthday parties, society events and custom meal boxes.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`https://wa.me/${phoneNumber.replace('+', '')}?text=${bulkOrderMessage}`} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
                    <ClipboardList size={18} />
                    Enquire on WhatsApp
                  </a>
                  <a href={`mailto:${businessEmail}?subject=Bulk order enquiry - Swadeshi Kitchen`} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                    <Mail size={18} />
                    Email bulk order
                  </a>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['Corporate Meals', 'Packed lunch boxes, regular office meals and team orders.'],
                  ['Family Functions', 'Custom menu planning for small and medium gatherings.'],
                  ['Party Combos', 'Snacks, drinks, bowls and desserts in bulk quantities.'],
                  ['Custom Menu', 'Tell us your budget, date, guests and preferred dishes.']
                ].map(([title, copy]) => (
                  <motion.div whileHover={{ y: -4 }} key={title} className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-900">
                    <p className="font-black text-orange-700 dark:text-orange-300">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <section id="contact" className="section-shell grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Contact</p>
              <h2 className="mt-2 text-4xl font-black">Order direct from Swadeshi Kitchen.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={`tel:${phoneNumber}`} className="rounded-lg bg-white p-5 font-black shadow-sm dark:bg-slate-900">
                <Phone className="mb-3 text-orange-700" />
                {displayPhoneNumber}
              </a>
              <a href={`mailto:${businessEmail}`} className="rounded-lg bg-white p-5 font-black shadow-sm dark:bg-slate-900">
                <Mail className="mb-3 text-orange-700" />
                {businessEmail}
              </a>
              <div className="rounded-lg bg-white p-5 font-black shadow-sm dark:bg-slate-900 sm:col-span-2">
                <MapPin className="mb-3 text-orange-700" />
                {businessAddress}
              </div>
              <a href={zomatoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg bg-[#e23744] p-5 font-black text-white shadow-sm transition hover:bg-[#c91f2e] sm:col-span-2" aria-label="Order Swadeshi Kitchen on Zomato">
                <ZomatoLogo />
                <span>
                  <span className="block text-lg leading-tight">Order on Zomato</span>
                  <span className="block text-sm font-semibold text-white/85">Swadeshi Kitchen</span>
                </span>
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-pink-600 to-orange-500 p-5 font-black text-white shadow-sm sm:col-span-2" aria-label="Follow Swadeshi Kitchen on Instagram">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-white/15">
                  <Instagram size={28} />
                </span>
                <span>
                  <span className="block text-lg leading-tight">Follow on Instagram</span>
                  <span className="block text-sm font-semibold text-white/85">@swade_shikitchen</span>
                </span>
              </a>
            </div>
          </section>
        </main>

        <footer className="border-t border-orange-100 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="section-shell flex flex-col justify-between gap-3 text-sm font-semibold text-slate-500 md:flex-row">
            <p>Swadeshi Kitchen</p>
            <p>{businessEmail} | {businessAddress}</p>
          </div>
        </footer>

        <AnimatePresence>
          {isCartOpen && (
            <motion.aside className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button type="button" className="absolute inset-0 bg-slate-950/50" onClick={() => setIsCartOpen(false)} aria-label="Close cart" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 260 }} className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-soft dark:bg-slate-950">
                <div className="flex items-center justify-between border-b border-orange-100 p-5 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-orange-700 dark:text-orange-300">Modern checkout</p>
                    <h2 className="text-2xl font-black">Cart and payment</h2>
                  </div>
                  <button type="button" onClick={() => setIsCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-orange-50 dark:bg-slate-800">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={submitOrder} className="flex-1 overflow-y-auto p-5">
                  <div className="space-y-4">
                    {cart.length === 0 ? (
                      <div className="grid rounded-lg border border-dashed border-orange-200 p-8 text-center dark:border-slate-700">
                        <ShoppingBag className="mx-auto text-orange-600" size={42} />
                        <p className="mt-4 font-black">Your cart is empty.</p>
                        <p className="mt-2 text-sm text-slate-500">Add a chef-made meal to start checkout.</p>
                      </div>
                    ) : (
                      cart.map((line) => (
                        <div key={line.id} className="flex gap-4 rounded-lg border border-orange-100 p-3 dark:border-slate-800">
                          <img src={line.image} alt={line.name} className="h-20 w-20 rounded-md object-cover" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-black leading-tight">{line.name}</h3>
                            <p className="mt-1 text-sm font-bold text-orange-700 dark:text-orange-300">
                              {formatCurrency(line.price)} x {line.quantity} = {formatCurrency(line.price * line.quantity)}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <button type="button" onClick={() => updateQuantity(line.id, line.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 dark:bg-slate-800">
                                <Minus size={15} />
                              </button>
                              <span className="w-7 text-center font-black">{line.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(line.id, line.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 dark:bg-slate-800">
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    <div className="rounded-lg bg-orange-50 p-4 dark:bg-slate-900">
                      <p className="mb-3 flex items-center gap-2 font-black">
                        <UserRound size={18} />
                        Customer details
                      </p>
                      <div className="grid gap-3">
                        <input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Full name" className="rounded-lg border border-orange-100 bg-white px-4 py-3 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
                        <input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Mobile number" className="rounded-lg border border-orange-100 bg-white px-4 py-3 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
                        <textarea value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="Delivery address" rows={3} className="rounded-lg border border-orange-100 bg-white px-4 py-3 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
                        <input value={customer.note} onChange={(event) => setCustomer({ ...customer, note: event.target.value })} placeholder="Cooking note or landmark" className="rounded-lg border border-orange-100 bg-white px-4 py-3 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
                      </div>
                    </div>

                    <div className="rounded-lg border border-orange-100 p-4 dark:border-slate-800">
                      <p className="mb-3 flex items-center gap-2 font-black">
                        <Search size={18} />
                        Coupon
                      </p>
                      <div className="flex gap-2">
                        <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="SWADESHI10 or FREEDEL" className="min-w-0 flex-1 rounded-lg border border-orange-100 px-4 py-3 uppercase outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" />
                        <button type="button" onClick={applyCoupon} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white dark:bg-orange-600">
                          Apply
                        </button>
                      </div>
                      {couponMessage && <p className="mt-2 text-xs font-semibold text-orange-700 dark:text-orange-300">{couponMessage}</p>}
                    </div>


                    <div className="rounded-lg border border-orange-100 p-4 dark:border-slate-800">
                      <p className="mb-3 flex items-center gap-2 font-black">
                        <Truck size={18} />
                        Delivery system
                      </p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {deliveryMethods.map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedDelivery(method)}
                            className={`rounded-lg border px-3 py-3 text-sm font-black ${
                              selectedDelivery === method
                                ? 'border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-600 dark:text-white'
                                : 'border-orange-100 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-semibold text-slate-500">
                        Selected delivery partner: {selectedDelivery}
                      </p>
                    </div>
                    <div className="rounded-lg border border-orange-100 p-4 dark:border-slate-800">
                      <p className="mb-3 flex items-center gap-2 font-black">
                        <WalletCards size={18} />
                        PhonePe / Google Pay
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {paymentMethods.map((method) => (
                          <button key={method} type="button" onClick={() => setSelectedPayment(method)} className={`rounded-lg border px-3 py-3 text-sm font-black ${selectedPayment === method ? 'border-orange-600 bg-orange-50 text-orange-700 dark:bg-orange-600 dark:text-white' : 'border-orange-100 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'}`}>
                            {method}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-4 rounded-lg bg-[#fffaf3] p-4 dark:bg-slate-900 sm:grid-cols-[auto_1fr]">
                        <img src={qrUrl} alt="UPI QR code for Swadeshi Kitchen payment" className="h-36 w-36 rounded-lg bg-white p-2" />
                        <div>
                          <p className="flex items-center gap-2 font-black">
                            <QrCode size={18} />
                            Scan and pay
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">UPI ID: {upiId}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Amount: {formatCurrency(totals.grandTotal)}</p>
                          <a href={upiUrl} className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white dark:bg-orange-600">
                            Open UPI app
                            <ChevronRight size={16} />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-orange-100 p-4 text-sm font-semibold dark:border-slate-800">
                      <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                      <div className="mt-2 flex justify-between"><span>Discount</span><span>- {formatCurrency(totals.discount)}</span></div>
                      <div className="mt-2 flex justify-between"><span>Delivery</span><span>{totals.delivery === 0 ? 'Free' : formatCurrency(totals.delivery)}</span></div>
                      <div className="mt-2 flex justify-between"><span>Taxes</span><span>{formatCurrency(totals.taxes)}</span></div>
                      <div className="mt-3 flex justify-between border-t border-orange-100 pt-3 text-lg font-black dark:border-slate-800"><span>Total</span><span>{formatCurrency(totals.grandTotal)}</span></div>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary mt-5 flex w-full items-center justify-center gap-2" disabled={cart.length === 0}>
                    <Truck size={18} />
                    Place order and confirm on WhatsApp
                  </button>
                </form>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;






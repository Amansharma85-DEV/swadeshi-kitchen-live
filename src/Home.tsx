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
  MessageCircle,
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
import { FormEvent, useMemo, useState, useEffect } from 'react';
import { getMenu, getPricing, getOffers, getGallery, getSettings, getTestimonials, type MenuItem as StoreMenuItem, type PricingSection, type Offer, type GalleryImage, type GlobalSettings, type Testimonial } from './lib/store';
import { readLocalOrders, storeOrder, type StoredOrder } from './lib/firebase';
import { defaultMenu } from './lib/store';

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

const brand = 'Swadeshi Kitchen';
const formatCurrency = (amount: number) => `Rs ${amount.toLocaleString('en-IN')}`;

function ZomatoLogo() {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-md bg-white text-[11px] font-black lowercase text-[#e23744] shadow-sm">
      zomato
    </span>
  );
}

// Static menus removed to use dynamic store

// categories is computed dynamically inside the App component
const paymentMethods = ['PhonePe', 'Google Pay', 'UPI QR', 'Cash on Delivery'];
const deliveryMethods = ['Self delivery', 'Local delivery boys', 'Porter / Dunzo'];
// Coupons are loaded dynamically from the offers store
const orderStages = ['Order placed', 'Cooking', 'Packed', 'Out for delivery', 'Delivered'];

const mapStatusToStep = (status: string): number => {
  switch (status) {
    case 'Pending':
    case 'Order placed':
      return 0;
    case 'Preparing':
    case 'Cooking':
      return 1;
    case 'Packed':
      return 2;
    case 'Out for Delivery':
    case 'Out for delivery':
      return 3;
    case 'Delivered':
      return 4;
    case 'Cancelled':
      return -1;
    default:
      return 0;
  }
};

function App() {

  // Always start with defaultMenu so the grid is never blank
  const [menuStore, setMenuStore] = useState<StoreMenuItem[]>(() => {
    const stored = getMenu();
    return stored.length > 0 ? stored : defaultMenu;
  });
  const [pricing, setPricing] = useState<PricingSection[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const stored = getMenu();
    setMenuStore(stored.length > 0 ? stored : defaultMenu);
    setPricing(getPricing());
    setOffers(getOffers());
    setGallery(getGallery());
    setSettings(getSettings());
    setTestimonials(getTestimonials());

    const handleScroll = () => {
      const sections = ['daily-menu', 'menu', 'gallery', 'bulk-orders', 'tracking', 'contact'];
      const scrollPosition = window.scrollY + 200; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const businessEmail = settings?.contact?.email || 'swadeshikitchen0@gmail.com';
  const phoneNumber = settings?.contact?.phone || '+919599749976';
  const displayPhoneNumber = settings?.contact?.phone || '+91 95997 49976';
  const businessAddress = settings?.contact?.address || '53-A Arjun Park, Najafgarh, New Delhi 110043';
  
  const zomatoUrl = 'https://zomato.onelink.me/xqzv/89ovd91e';
  const instagramUrl = 'https://www.instagram.com/swade_shikitchen?igsh=MTI2MDk2ejc3OHF1aw==';
  const upiId = '9958033982@ptsbi';
  const whatsAppOrderNumber = settings?.whatsapp?.number || '919599749976';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('daily-menu');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuCardOpen, setIsMenuCardOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('PhonePe');
  const [selectedDelivery, setSelectedDelivery] = useState('Self delivery');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [activeOrder, setActiveOrder] = useState<StoredOrder | null>(() => {
    const list = readLocalOrders();
    return list.length > 0 ? list[0] : null;
  });
  const [orderStep, setOrderStep] = useState(() => {
    const list = readLocalOrders();
    return list.length > 0 ? mapStatusToStep(list[0].status) : 0;
  });
  const [orders, setOrders] = useState<StoredOrder[]>(() => readLocalOrders());

  // Poll for active order status updates
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      const allOrders = readLocalOrders();
      const current = allOrders.find(o => o.id === activeOrder.id);
      if (current && current.status !== activeOrder.status) {
        setActiveOrder(current);
        const step = mapStatusToStep(current.status);
        if (step !== -1) {
          setOrderStep(step);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeOrder]);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: phoneNumber,
    address: '',
    note: ''
  });

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(menuStore.map((item) => item.category)))];
  }, [menuStore]);

  const filteredMenu = useMemo(() => {
    let result = selectedCategory === 'All'
      ? menuStore
      : menuStore.filter((item) => item.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [menuStore, selectedCategory, searchQuery]);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const baseDelivery = subtotal > 499 || subtotal === 0 ? 0 : 39;
    
    const foundOffer = offers.find(o => o.title.toUpperCase() === appliedCoupon.toUpperCase() && o.active);
    let discount = 0;
    let delivery = baseDelivery;
    
    if (foundOffer) {
      const desc = foundOffer.description.toLowerCase();
      if (desc.includes('free delivery')) {
        delivery = 0;
      } else {
        const match = desc.match(/\b\d+\b/);
        const value = match ? parseInt(match[0], 10) : 0;
        discount = Math.round((subtotal * value) / 100);
      }
    }
    
    const taxes = Math.round((subtotal - discount) * 0.05);
    return {
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      delivery,
      taxes,
      grandTotal: Math.max(0, subtotal - discount + delivery + taxes)
    };
  }, [cart, appliedCoupon, offers]);

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
      const activeCodes = offers.filter(o => o.active).map(o => o.title).join(' or ');
      setCouponMessage(activeCodes ? `Enter ${activeCodes}.` : 'No coupons available.');
      return;
    }
    const foundOffer = offers.find(o => o.title.toUpperCase() === normalized && o.active);
    if (!foundOffer) {
      setAppliedCoupon('');
      setCouponMessage('Coupon not valid.');
      return;
    }
    setAppliedCoupon(normalized);
    setCouponMessage(`${normalized} applied.`);
  };

  const createWhatsAppMessage = (order: StoredOrder) => {
    const lines = order.items.map((item) => `- ${item.quantity} x ${item.name} (${formatCurrency(item.price * item.quantity)})`);
    return [
      '====================================',
      '       *SWADESHI KITCHEN ORDER*     ',
      '====================================',
      '',
      `*Customer:* ${order.customer.name}`,
      `*Phone:* ${order.customer.phone}`,
      `*Address:* ${order.customer.address}`,
      '',
      '*Items:*',
      ...lines,
      '',
      '------------------------------------',
      `*Total:* ${formatCurrency(order.totals.grandTotal)}`,
      `*Payment:* ${order.paymentMethod}`,
      `*Notes:* ${order.customer.note || 'None'}`,
      '====================================',
      'Thank you for ordering with us!'
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bulkOrderMessage = `Bulk order enquiry for ${brand}%0AName:%0AEvent date:%0AGuests:%0AAddress:%0ARequirements:`;
  const navItems = [
    { label: 'Daily Menu', id: 'daily-menu' },
    { label: 'Menu', id: 'menu' },
    { label: 'Gallery', id: 'gallery' },
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
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Swadeshi Kitchen logo" className="h-14 w-14 rounded-full object-contain shadow-sm" />
              <span className="text-lg leading-tight">
                Swadeshi
                <span className="block text-sm font-semibold text-orange-700 dark:text-orange-300">Kitchen</span>
              </span>
            </a>

            <nav className="hidden items-center gap-8 text-sm font-bold md:flex">
              {navItems.map((item) => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`transition-colors duration-200 ${activeSection === item.id ? 'text-orange-600 dark:text-orange-400 font-extrabold' : 'text-slate-700 hover:text-orange-700 dark:text-slate-200'}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white transition-all hover:scale-105 active:scale-95" aria-label="Toggle dark mode">
                {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button type="button" onClick={() => setIsCartOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white text-orange-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 transition-all hover:scale-105 active:scale-95">
                <ShoppingBag size={21} />
                {totals.count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-slate-950 px-1 text-xs font-black text-white dark:bg-orange-500">
                    {totals.count}
                  </span>
                )}
              </button>
              <a 
                href="#menu" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('menu');
                }}
                className="hidden md:inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Order Now
              </a>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-orange-200 bg-white md:hidden dark:border-slate-700 dark:bg-slate-900" onClick={() => setIsMenuOpen((value) => !value)} aria-label="Toggle menu">
                {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black md:hidden"
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 right-0 top-0 z-50 w-72 bg-[#fffaf3] p-6 shadow-xl dark:bg-slate-900 md:hidden flex flex-col"
              >
                <div className="flex justify-between items-center pb-6 border-b border-orange-100 dark:border-slate-800">
                  <span className="font-black text-lg">Menu Navigation</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-orange-50 rounded-full dark:hover:bg-slate-800">
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex flex-col gap-6 mt-8 text-lg font-bold">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        scrollToSection(item.id);
                      }}
                      className={`flex items-center gap-3 transition-colors ${
                        activeSection === item.id ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-slate-700 dark:text-slate-200 hover:text-orange-600'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </header>

        <main>
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="section-shell grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
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
                {/* View Menu */}
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('menu');
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-black text-white shadow-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag size={18} />
                  View Menu
                </a>

                {/* Menu Card popup */}
                <button
                  type="button"
                  onClick={() => setIsMenuCardOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-6 py-3 font-black text-white shadow-lg hover:bg-amber-800 transition-all hover:scale-105 active:scale-95"
                >
                  <QrCode size={18} />
                  Menu Card
                </button>

                {/* Phone */}
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-orange-300 bg-white px-6 py-3 font-black text-slate-900 shadow hover:bg-orange-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                >
                  <Phone size={18} />
                  {displayPhoneNumber}
                </a>

                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-pink-300 bg-white px-6 py-3 font-black text-pink-700 shadow hover:bg-pink-50 dark:border-slate-600 dark:bg-slate-900 dark:text-pink-300 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                >
                  <Instagram size={18} />
                  Instagram
                </a>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-center">
                {[
                  ['Rs 149', 'Veg Thali'],
                  [settings?.contact?.openingHours?.match(/\b\d+(?::\d+)?\s*(?:AM|PM)\b/i)?.[0] || '8 AM', 'Opening'],
                  ['20%', 'Self pickup']
                ].map(([value, label]) => (
                  <motion.div whileHover={{ y: -4 }} key={label} className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
                    <div className="text-2xl font-black">{value}</div>
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-slate-950 shadow-soft">
              <img src={settings?.hero?.backgroundImage || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85"} alt={settings?.brand?.name} className="absolute inset-0 h-full w-full object-cover opacity-85" />
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
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="daily-menu" className="bg-[#193d1d] py-16 text-white">
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
                      <p className="mt-1 text-2xl font-black">
                        {settings?.contact?.openingHours?.replace(/^[A-Za-z0-9-:]+\s*/, '').trim() || '8:00 AM - 11:00 PM'}
                      </p>
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
                    {(pricing[0]?.items || []).map((item, i) => (
                      <div key={i} className="grid gap-2 py-4 md:grid-cols-[160px_1fr] md:items-start">
                        <p className="font-black text-[#193d1d]">{item.name}</p>
                        <p className="text-sm font-semibold leading-6 text-slate-700">{item.subText || item.priceText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-lg bg-white p-5 text-slate-950 shadow-soft">
                  <p className="text-sm font-black uppercase tracking-wide text-purple-700">Paratha menu</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {(pricing[1]?.items || []).map((item, i) => (
                      <div key={i} className="rounded-lg border border-purple-100 bg-[#fffaf3] p-4">
                        <p className="font-black text-purple-800">{item.name}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-slate-700">
                          {item.subText && <span className="rounded-full bg-white px-3 py-1">{item.subText}</span>}
                          <span className="rounded-full bg-white px-3 py-1">{item.priceText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-white p-5 text-slate-950 shadow-soft">
                  <p className="text-sm font-black uppercase tracking-wide text-orange-700">Extra items</p>
                  <div className="mt-4 divide-y divide-orange-100">
                    {(pricing[2]?.items || []).map((item, i) => (
                      <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 py-3 text-sm">
                        <p className="font-black">{item.name}</p>
                        <p className="font-bold text-slate-600">{item.priceText}</p>
                        <p className="font-bold text-slate-600">{item.subText || ''}</p>
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
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="menu" className="bg-white py-16 dark:bg-slate-900">
            <div className="section-shell">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Fresh menu</p>
                  <h2 className="mt-2 text-4xl font-black">Made for delivery, plated like dine-in.</h2>
                </div>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search dishes..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-orange-100 rounded-full text-sm bg-[#fffaf3] dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
                    />
                  </div>

                  {/* Categories Filter */}
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map((category) => (
                      <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${selectedCategory === category ? 'bg-slate-950 text-white dark:bg-orange-500' : 'bg-orange-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMenu.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-2xl font-black text-slate-400">No dishes found</p>
                    <p className="mt-2 text-slate-400">Try a different search or category</p>
                  </div>
                )}
                {filteredMenu.map((item, index) => (
                  <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} key={item.id} className="flex flex-col overflow-hidden rounded-lg border border-orange-100 bg-[#fffaf3] shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" loading="lazy" />
                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-orange-700">
                        {item.tag}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-black">{item.name}</h3>
                        <span className="font-black text-orange-700 dark:text-orange-300">{formatCurrency(item.price)}</span>
                      </div>
                      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      <button type="button" onClick={() => addToCart(item)} className="btn-primary mt-auto w-full">
                        Add to cart
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="gallery" className="bg-slate-50 py-16 dark:bg-slate-950/50">
            <div className="section-shell">
              <div className="text-center mb-10">
                <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Gallery</p>
                <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">See what's cooking</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map(img => (
                  <div key={img.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <img src={img.url} className="w-full h-full object-cover transition duration-300 hover:scale-105" alt="Gallery" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* TESTIMONIALS */}
          {testimonials.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="bg-white dark:bg-slate-900 py-16">
              <div className="section-shell">
                <div className="text-center mb-10">
                  <p className="text-sm font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">Reviews</p>
                  <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">What our customers say</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
                      <div className="flex text-yellow-500 mb-4">
                        {Array.from({length: t.rating}).map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium italic mb-4">"{t.review}"</p>
                      <p className="font-black text-slate-900 dark:text-white">- {t.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="tracking" className="section-shell py-16">
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
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="bulk-orders" className="section-shell py-16">
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
                  <a href={`mailto:${settings?.contact?.email}?subject=Bulk order enquiry`} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
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
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} id="contact" className="section-shell grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]">
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
          </motion.section>
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
        {/* Sticky Bottom Navigation for Mobile */}
        <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-between gap-3 md:hidden">
          <a
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('menu');
            }}
            className="flex-1 shadow-lg bg-orange-600 hover:bg-orange-700 text-white py-3.5 px-6 rounded-full font-black text-center flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ShoppingBag size={18} />
            Order Dishes
          </a>
          <a
            href={`https://wa.me/${whatsAppOrderNumber}`}
            target="_blank"
            rel="noreferrer"
            className="shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full transition-all active:scale-95 flex items-center justify-center"
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle size={22} />
          </a>
        </div>

        {/* Menu Card Modal */}
        <AnimatePresence>
          {isMenuCardOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuCardOpen(false)}
                className="fixed inset-0 bg-slate-950"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-10 max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900"
              >
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Official Menu Card</h3>
                  <button
                    type="button"
                    onClick={() => setIsMenuCardOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
                  <img
                    src={`${import.meta.env.BASE_URL}menu_card.jpg`}
                    alt="Swadeshi Kitchen Menu Flyer"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;






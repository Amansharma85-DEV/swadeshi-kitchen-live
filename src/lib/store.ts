export type MenuItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  status?: string;
  inStock?: boolean;
};

export const defaultMenu: MenuItem[] = [
  {
    id: 1,
    name: 'Paneer Parantha - 2 pcs',
    category: 'Our Special Paranthas',
    description: 'Made with whole wheat atta.',
    price: 189,
    image: `${import.meta.env.BASE_URL}stuffed_paratha.png`,
    tag: 'Special'
  },
  {
    id: 2,
    name: 'Aloo Parantha - 2 pcs',
    category: 'Our Special Paranthas',
    description: 'Made with whole wheat atta.',
    price: 139,
    image: `${import.meta.env.BASE_URL}stuffed_paratha.png`,
    tag: 'Classic'
  },
  {
    id: 3,
    name: 'Aloo Pyaaz Parantha - 2 pcs',
    category: 'Our Special Paranthas',
    description: 'Made with whole wheat atta.',
    price: 159,
    image: `${import.meta.env.BASE_URL}stuffed_paratha.png`,
    tag: 'Popular'
  },
  {
    id: 4,
    name: 'Ajwain Parantha',
    category: 'Our Special Paranthas',
    description: 'Served with Aloo Zeera. Made with whole wheat atta.',
    price: 139,
    image: `${import.meta.env.BASE_URL}stuffed_paratha.png`,
    tag: 'Unique'
  },
  {
    id: 5,
    name: 'Luxurious Parantha - 2 pcs',
    category: 'Our Special Paranthas',
    description: 'Made with whole wheat atta.',
    price: 199,
    image: `${import.meta.env.BASE_URL}stuffed_paratha.png`,
    tag: 'Loaded'
  },
  {
    id: 6,
    name: 'Aloo Puri - 5 Puris',
    category: 'Our Special Paranthas',
    description: '5 Puris served hot.',
    price: 119,
    image: `${import.meta.env.BASE_URL}aloo_poori.png`,
    tag: 'Comfort'
  },
  {
    id: 7,
    name: 'Pink Sauce Pasta 400gm',
    category: 'Snacks',
    description: 'Delicious creamy pink sauce pasta.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1621996346565-e13b85f03e0f?auto=format&fit=crop&w=900&q=80',
    tag: 'New'
  },
  {
    id: 8,
    name: 'White Sauce Pasta 400gm',
    category: 'Snacks',
    description: 'Creamy and cheesy white sauce pasta.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular'
  },
  {
    id: 9,
    name: 'Chili Garlic Maggi - Full',
    category: 'Snacks',
    description: 'Spicy chili garlic flavored Maggi noodles.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80',
    tag: 'Spicy'
  },
  {
    id: 10,
    name: 'Corn & Cheese Maggi - Full',
    category: 'Snacks',
    description: 'Maggi noodles loaded with sweet corn and cheese.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80',
    tag: 'Cheesy'
  },
  {
    id: 11,
    name: 'Crispy Potato Fries',
    category: 'Snacks',
    description: 'Classic salted crispy french fries.',
    price: 109,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=900&q=80',
    tag: 'Sides'
  },
  {
    id: 12,
    name: 'Peri Peri Fries',
    category: 'Snacks',
    description: 'Crispy fries tossed in spicy peri peri seasoning.',
    price: 139,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=900&q=80',
    tag: 'Spicy'
  },
  {
    id: 13,
    name: 'Grilled Sandwich - 4 Pieces',
    category: 'Snacks',
    description: 'Classic grilled vegetable sandwich.',
    price: 169,
    image: `${import.meta.env.BASE_URL}img1.jpg`,
    tag: 'Classic'
  },
  {
    id: 14,
    name: 'Aloo Sandwich - 4 Pieces',
    category: 'Snacks',
    description: 'Grilled sandwich stuffed with spiced potato filling.',
    price: 139,
    image: `${import.meta.env.BASE_URL}img1.jpg`,
    tag: 'Comfort'
  },
  {
    id: 15,
    name: 'Paneer Sandwich - 4 Pieces',
    category: 'Snacks',
    description: 'Crispy grilled sandwich stuffed with spiced paneer filling.',
    price: 179,
    image: `${import.meta.env.BASE_URL}img1.jpg`,
    tag: 'Popular'
  },
  {
    id: 16,
    name: 'Paneer Cheese Sandwich - 4 Pieces',
    category: 'Snacks',
    description: 'Grilled paneer sandwich loaded with extra cheese.',
    price: 249,
    image: `${import.meta.env.BASE_URL}img1.jpg`,
    tag: 'Cheesy'
  },
  {
    id: 17,
    name: 'VEG THALI',
    category: 'Thali & Rice Combos',
    description: 'Dal, Sabzi, Roti, Rice, Raita, Salad, Pickle.',
    price: 199,
    image: `${import.meta.env.BASE_URL}veg_thali.png`,
    tag: 'Daily'
  },
  {
    id: 18,
    name: 'SPECIAL VEG THALI',
    category: 'Thali & Rice Combos',
    description: 'Dal, Mutter Paneer, Roti, Boondi Raita, Salad, Pickle.',
    price: 249,
    image: `${import.meta.env.BASE_URL}veg_thali.png`,
    tag: 'Special'
  },
  {
    id: 19,
    name: 'RAJMA CHAWAL',
    category: 'Thali & Rice Combos',
    description: 'Classic homestyle Rajma served with steamed rice.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    tag: 'Classic'
  },
  {
    id: 20,
    name: 'CHOLE CHAWAL',
    category: 'Thali & Rice Combos',
    description: 'Spicy chole served with steamed rice.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular'
  },
  {
    id: 21,
    name: 'YELLOW DAL TADKA CHAWAL',
    category: 'Thali & Rice Combos',
    description: 'Yellow dal tadka served with steamed rice.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    tag: 'Comfort'
  },
  {
    id: 22,
    name: 'BLACK DAL CHAWAL',
    category: 'Thali & Rice Combos',
    description: 'Creamy black dal served with steamed rice.',
    price: 169,
    image: `${import.meta.env.BASE_URL}img2.jpg`,
    tag: 'Rich'
  },
  {
    id: 23,
    name: 'MUTTER PANEER 300gm',
    category: 'Thali & Rice Combos',
    description: 'Homestyle mutter paneer curry.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80',
    tag: 'Curry'
  },
  {
    id: 24,
    name: 'BLACK DAL FRY 300gm',
    category: 'Thali & Rice Combos',
    description: 'Delicious creamy black dal fry.',
    price: 149,
    image: `${import.meta.env.BASE_URL}img2.jpg`,
    tag: 'Curry'
  },
  {
    id: 25,
    name: 'YELLOW DAL TADKA 300gm',
    category: 'Thali & Rice Combos',
    description: 'Classic yellow dal tadka.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    tag: 'Curry'
  },
  {
    id: 26,
    name: 'Steamed Basmati Rice',
    category: 'Extras',
    description: 'Premium quality steamed basmati rice, perfect with any curry.',
    price: 79,
    image: `${import.meta.env.BASE_URL}img3.jpg`,
    tag: 'Fresh'
  },
  {
    id: 27,
    name: 'Punjabi Kadhi Pakora',
    category: 'Extras',
    description: 'Tangy yogurt curry with deep-fried onion pakoras and a spicy tadka.',
    price: 129,
    image: `${import.meta.env.BASE_URL}img4.jpg`,
    tag: 'Classic'
  },
  {
    id: 28,
    name: 'Homestyle Aloo Sabzi',
    category: 'Extras',
    description: 'Spiced potato curry cooked with tomatoes, curry leaves and homestyle masala.',
    price: 99,
    image: `${import.meta.env.BASE_URL}img5.jpg`,
    tag: 'Homestyle'
  }
];

export function getMenu(): MenuItem[] {
  try {
    const flag = localStorage.getItem('swadeshi-menu-restored-v2');
    if (!flag) {
      saveMenu(defaultMenu);
      localStorage.setItem('swadeshi-menu-restored-v2', 'true');
      return defaultMenu;
    }
    const stored = localStorage.getItem('swadeshi-menu');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  saveMenu(defaultMenu);
  return defaultMenu;
}

export function saveMenu(menu: MenuItem[]) {
  localStorage.setItem('swadeshi-menu', JSON.stringify(menu));
}

export function addMenuItem(item: Omit<MenuItem, 'id'>) {
  const currentMenu = getMenu();
  const nextId = Math.max(0, ...currentMenu.map(i => i.id)) + 1;
  const newItem = { ...item, id: nextId };
  saveMenu([...currentMenu, newItem]);
  return newItem;
}

export function deleteMenuItem(id: number) {
  const currentMenu = getMenu();
  saveMenu(currentMenu.filter(item => item.id !== id));
}

export function editMenuItem(id: number, updatedItem: Partial<MenuItem>) {
  const currentMenu = getMenu();
  const index = currentMenu.findIndex(item => item.id === id);
  if (index !== -1) {
    currentMenu[index] = { ...currentMenu[index], ...updatedItem };
    saveMenu(currentMenu);
  }
}

export function renameCategory(oldName: string, newName: string) {
  const currentMenu = getMenu();
  const updated = currentMenu.map(item => 
    item.category === oldName ? { ...item, category: newName } : item
  );
  saveMenu(updated);
}

export function deleteCategory(categoryName: string) {
  const currentMenu = getMenu();
  const updated = currentMenu.map(item => 
    item.category === categoryName ? { ...item, category: 'Uncategorized' } : item
  );
  saveMenu(updated);
}

// --- OFFERS ---
export type Offer = {
  id: number;
  title: string;
  description: string;
  active: boolean;
};

const defaultOffers: Offer[] = [
  { id: 1, title: 'SWADESHI10', description: '10% off food bill on all orders', active: true },
  { id: 2, title: 'FREEDEL', description: 'Free delivery on orders over Rs 499', active: true }
];

export function getOffers(): Offer[] {
  try {
    const stored = localStorage.getItem('swadeshi-offers');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultOffers;
}

export function saveOffers(offers: Offer[]) {
  localStorage.setItem('swadeshi-offers', JSON.stringify(offers));
}

// --- GALLERY ---
export type GalleryImage = {
  id: number;
  url: string;
};

const defaultGallery: GalleryImage[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80' },
  { id: 2, url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=900&q=80' },
  { id: 3, url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80' }
];

export function getGallery(): GalleryImage[] {
  try {
    const stored = localStorage.getItem('swadeshi-gallery');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultGallery;
}

export function saveGallery(gallery: GalleryImage[]) {
  localStorage.setItem('swadeshi-gallery', JSON.stringify(gallery));
}

// --- PRICING PLANS / MENUS ---
export type PricingSection = {
  id: number;
  title: string;
  items: { name: string; priceText: string; subText?: string }[];
};

const defaultPricing: PricingSection[] = [
  {
    id: 1,
    title: 'Daily Thali Options (Rs 199)',
    items: [
      { name: 'Monday & Thursday', priceText: '', subText: 'Rice, Yellow Dal, Aloo Jeera, Boondi Raita, Salad, 3 Tawa Roti' },
      { name: 'Tuesday', priceText: '', subText: 'Rice, Channa Masala, Mix Veg, Boondi Raita, Salad, 3 Roti' },
      { name: 'Wednesday & Friday', priceText: '', subText: 'Rice, Black Dal Tadka, Aloo Bhaji, Boondi Raita, Salad, 3 Roti' },
      { name: 'Saturday', priceText: '', subText: 'Rice, Rajma, Mix Veg, Boondi Raita, Salad, 3 Roti' },
      { name: 'Sunday', priceText: '', subText: 'Rice, Kadhi Pakora, Aloo Mutter, 3 Roti' }
    ]
  },
  {
    id: 2,
    title: 'Our Parathas',
    items: [
      { name: 'Gobhi Paratha', priceText: '1 pc Rs 79 | 2 pcs Rs 139', subText: 'Served with curd & pickle' },
      { name: 'Paneer Paratha', priceText: '1 pc Rs 119 | 2 pcs Rs 189', subText: 'Served with curd & pickle' },
      { name: 'Mooli Paratha', priceText: '1 pc Rs 99 | 2 pcs Rs 169', subText: 'Served with curd & pickle' },
      { name: 'Aloo Paratha', priceText: '1 pc Rs 79 | 2 pcs Rs 139', subText: 'Served with curd & pickle' },
      { name: 'Aloo Pyaz Paratha', priceText: '1 pc Rs 89 | 2 pcs Rs 159', subText: 'Served with curd & pickle' },
      { name: 'Ajwain Paratha', priceText: '2 pcs Rs 139', subText: 'Served with aloo jeera, curd, pickle' },
      { name: 'Luxurious Paratha', priceText: '1 pc Rs 139 | 2 pcs Rs 199', subText: 'Stuffed with paneer, aloo, mooli, gobhi' },
      { name: 'Aloo Poori', priceText: '5 pooris Rs 119', subText: 'Served with curd & pickle' }
    ]
  },
  {
    id: 3,
    title: 'Extra Items',
    items: [
      { name: 'Dal', priceText: 'Half Rs 60 | Full Rs 110' },
      { name: 'Sabzi', priceText: 'Half Rs 60 | Full Rs 110' },
      { name: 'Rice', priceText: 'Half Rs 50 | Full Rs 100' },
      { name: 'Plain Tawa Roti', priceText: '1 pc Rs 12 | 10 pcs Rs 100' },
      { name: 'Ghee Tawa Roti', priceText: '1 pc Rs 15 | 10 pcs Rs 130' },
      { name: 'Butter Tawa Roti', priceText: '1 pc Rs 15 | 10 pcs Rs 150' }
    ]
  }
];

export function getPricing(): PricingSection[] {
  try {
    const stored = localStorage.getItem('swadeshi-pricing');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultPricing;
}

export function savePricing(pricing: PricingSection[]) {
  localStorage.setItem('swadeshi-pricing', JSON.stringify(pricing));
}

// --- GLOBAL SETTINGS ---
export type GlobalSettings = {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    openingHours: string;
  };
  whatsapp: {
    number: string;
    messageTemplate: string;
  };
  seo: {
    title: string;
    description: string;
  };
  brand: {
    name: string;
    logo: string;
  };
};

const defaultSettings: GlobalSettings = {
  hero: {
    title: 'Authentic North Indian Food.',
    subtitle: 'From delicious paranthas to homestyle thalis, delivered fresh to your door in Delhi.',
    backgroundImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85'
  },
  contact: {
    email: 'swadeshikitchen0@gmail.com',
    phone: '+919599749976',
    address: '53-A Arjun Park, Najafgarh, New Delhi 110043',
    openingHours: 'Mon-Sun: 8:00 AM - 11:00 PM'
  },
  whatsapp: {
    number: '919599749976',
    messageTemplate: 'Hello Swadeshi Kitchen! I would like to place an order.'
  },
  seo: {
    title: 'Swadeshi Kitchen | Authentic North Indian Food in Delhi',
    description: 'Order delicious paranthas, thalis, and homestyle North Indian food online from Swadeshi Kitchen. Delivery in Delhi.'
  },
  brand: {
    name: 'Swadeshi Kitchen',
    logo: '/swadeshi-kitchen-live/logo.png' // Using the existing BASE_URL logo
  }
};

export function getSettings(): GlobalSettings {
  try {
    const stored = localStorage.getItem('swadeshi-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate if old placeholder values are found in local storage
      if (
        parsed.contact?.phone === '+919999999999' ||
        parsed.contact?.email === 'amansharma85.dev@gmail.com' ||
        parsed.contact?.openingHours === 'Mon-Sun: 11:00 AM - 11:00 PM' ||
        parsed.brand?.logo === '/swadeshi-kitchen/logo.png'
      ) {
        const migrated = {
          ...parsed,
          contact: {
            ...parsed.contact,
            phone: '+919599749976',
            email: 'swadeshikitchen0@gmail.com',
            address: '53-A Arjun Park, Najafgarh, New Delhi 110043',
            openingHours: 'Mon-Sun: 8:00 AM - 11:00 PM'
          },
          whatsapp: {
            ...parsed.whatsapp,
            number: '919599749976'
          },
          brand: {
            ...parsed.brand,
            logo: '/swadeshi-kitchen-live/logo.png'
          }
        };
        saveSettings(migrated);
        return migrated;
      }
      return parsed;
    }
  } catch (e) {}
  return defaultSettings;
}

export function saveSettings(settings: GlobalSettings) {
  localStorage.setItem('swadeshi-settings', JSON.stringify(settings));
}

// --- TESTIMONIALS ---
export type Testimonial = {
  id: number;
  name: string;
  review: string;
  rating: number;
};

const defaultTestimonials: Testimonial[] = [
  { id: 1, name: 'Rahul Sharma', review: 'The Aloo Paranthas here are amazing! Just like home.', rating: 5 },
  { id: 2, name: 'Priya Singh', review: 'Best Rajma Chawal in Delhi. Highly recommended for daily meals.', rating: 5 },
  { id: 3, name: 'Amit Kumar', review: 'Very fast delivery and the packaging was excellent. Food was piping hot.', rating: 4 }
];

export function getTestimonials(): Testimonial[] {
  try {
    const stored = localStorage.getItem('swadeshi-testimonials');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultTestimonials;
}

export function saveTestimonials(testimonials: Testimonial[]) {
  localStorage.setItem('swadeshi-testimonials', JSON.stringify(testimonials));
}


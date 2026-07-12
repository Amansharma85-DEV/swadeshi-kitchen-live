const fs = require('fs');
let content = fs.readFileSync('src/Home.tsx', 'utf8');

// 1. Add settings to imports
content = content.replace(
  "import { getMenu, getPricing, getOffers, getGallery, type MenuItem as StoreMenuItem, type PricingSection, type Offer, type GalleryImage } from './lib/store';",
  "import { getMenu, getPricing, getOffers, getGallery, getSettings, getTestimonials, type MenuItem as StoreMenuItem, type PricingSection, type Offer, type GalleryImage, type GlobalSettings, type Testimonial } from './lib/store';"
);

// 2. Add state inside App component
const storeStateOld = `  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);`;
  
const storeStateNew = `  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);`;

content = content.replace(storeStateOld, storeStateNew);

const useEffectOld = `    setOffers(getOffers());
    setGallery(getGallery());
  }, []);`;

const useEffectNew = `    setOffers(getOffers());
    setGallery(getGallery());
    setSettings(getSettings());
    setTestimonials(getTestimonials());
  }, []);`;
  
content = content.replace(useEffectOld, useEffectNew);

// 3. Remove hardcoded businessEmail etc and use settings
content = content.replace(/const businessEmail = '.*?';/, '');
content = content.replace(/const whatsappNumber = '.*?';/, '');
content = content.replace(/const zomatoUrl = '.*?';/, '');
content = content.replace(/const instagramUrl = '.*?';/, '');
content = content.replace(/const upiId = '.*?';/, '');

// Replace the checkout WhatsApp link
const oldCheckoutLink = `const whatsappUrl = \`https://wa.me/\${whatsappNumber}?text=\${encodeURIComponent(message)}\`;`;
const newCheckoutLink = `const whatsappUrl = \`https://wa.me/\${settings?.whatsapp.number || '919999999999'}?text=\${encodeURIComponent((settings?.whatsapp.messageTemplate || '') + '\\n\\n' + message)}\`;`;
content = content.replace(oldCheckoutLink, newCheckoutLink);

// 4. Update the Hero Section
const oldHero = `<h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
                Authentic North Indian Food.
              </h1>
              <p className="mt-6 max-w-lg text-lg font-medium text-white/90 sm:text-xl">
                From delicious paranthas to homestyle thalis, delivered fresh to your door in Delhi.
              </p>`;
const newHero = `<h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
                {settings?.hero.title}
              </h1>
              <p className="mt-6 max-w-lg text-lg font-medium text-white/90 sm:text-xl">
                {settings?.hero.subtitle}
              </p>`;
content = content.replace(oldHero, newHero);

const oldHeroBg = `<img src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85" alt="Swadeshi Kitchen meals" className="absolute inset-0 h-full w-full object-cover opacity-85" />`;
const newHeroBg = `<img src={settings?.hero.backgroundImage || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85"} alt={settings?.brand.name} className="absolute inset-0 h-full w-full object-cover opacity-85" />`;
content = content.replace(oldHeroBg, newHeroBg);

// 5. Update Contact Section
const oldContactEmail = `<a href={\`mailto:\${businessEmail}?subject=Bulk order enquiry - Swadeshi Kitchen\`} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">`;
const newContactEmail = `<a href={\`mailto:\${settings?.contact.email}?subject=Bulk order enquiry\`} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 font-black text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">`;
content = content.replace(oldContactEmail, newContactEmail);

// 6. Testimonials Section - Adding it after Gallery
const gallerySection = `          </section>

          <section id="tracking"`;
const testimonialsSection = `          </section>

          {/* TESTIMONIALS */}
          {testimonials.length > 0 && (
            <section className="bg-white dark:bg-slate-900 py-16">
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
            </section>
          )}

          <section id="tracking"`;
content = content.replace(gallerySection, testimonialsSection);

// 7. Premium UI Overhaul Additions
// Make Header Glassmorphic
content = content.replace(
  'className="fixed top-0 z-50 w-full border-b border-orange-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"',
  'className="fixed top-0 z-50 w-full border-b border-orange-100 bg-white/80 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/80"'
);

// Add Micro animations to product cards
content = content.replace(
  '<div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md dark:bg-slate-900">',
  '<div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">'
);

// Zoom effect on product images
content = content.replace(
  '<img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />',
  '<img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />'
);

// SEO Injection hook
const appReturn = 'return (';
const appReturnWithSeo = `useEffect(() => {
    if (settings) {
      document.title = settings.seo.title;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', settings.seo.description);
    }
  }, [settings]);

  return (`;
content = content.replace(appReturn, appReturnWithSeo);

fs.writeFileSync('src/Home.tsx', content);
console.log('UI Phase 1 & 2 integration complete.');

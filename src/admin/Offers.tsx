import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getOffers, saveOffers, type Offer } from '../lib/store';

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    setOffers(getOffers());
  }, []);

  const handleAdd = () => {
    const newOffer = { id: Date.now(), title: 'NEW OFFER', description: 'Describe the offer here', active: true };
    const nextOffers = [...offers, newOffer];
    setOffers(nextOffers);
    saveOffers(nextOffers);
  };

  const handleDelete = (id: number) => {
    const nextOffers = offers.filter(o => o.id !== id);
    setOffers(nextOffers);
    saveOffers(nextOffers);
  };

  const toggleActive = (id: number) => {
    const nextOffers = offers.map(o => o.id === id ? { ...o, active: !o.active } : o);
    setOffers(nextOffers);
    saveOffers(nextOffers);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Promotional Offers</h1>
          <p className="mt-1 text-slate-500">Manage coupon codes and discounts shown on the live website.</p>
        </div>
        <button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{offer.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(offer.id)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${offer.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {offer.active ? 'Active' : 'Disabled'}
                </button>
                <button onClick={() => handleDelete(offer.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{offer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X, Check, Tag } from 'lucide-react';
import { getOffers, saveOffers, type Offer } from '../lib/store';
import { fetchApiSetting, saveApiSetting, subscribeToLiveSync } from '../lib/api';

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form state
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);

  const loadOffersData = async () => {
    const apiOffers = await fetchApiSetting<Offer[]>('offers');
    if (apiOffers && Array.isArray(apiOffers)) {
      setOffers(apiOffers);
      saveOffers(apiOffers);
    } else {
      setOffers(getOffers());
    }
  };

  useEffect(() => {
    loadOffersData();
    const interval = setInterval(loadOffersData, 2000);
    const unsubscribe = subscribeToLiveSync(loadOffersData);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const syncOffersState = async (nextOffers: Offer[]) => {
    setOffers(nextOffers);
    saveOffers(nextOffers);
    await saveApiSetting('offers', nextOffers);
  };

  const openAddModal = () => {
    setEditingOffer(null);
    setFormCode('');
    setFormDescription('');
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setFormCode(offer.title);
    setFormDescription(offer.description);
    setFormActive(offer.active);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formCode.trim().toUpperCase();
    if (!cleanCode) return;

    let nextOffers: Offer[];
    if (editingOffer) {
      nextOffers = offers.map(o => o.id === editingOffer.id ? { ...o, title: cleanCode, description: formDescription, active: formActive } : o);
    } else {
      const newOffer: Offer = {
        id: Date.now(),
        title: cleanCode,
        description: formDescription || 'Promotional discount coupon',
        active: formActive
      };
      nextOffers = [...offers, newOffer];
    }

    await syncOffersState(nextOffers);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotional offer?')) {
      const nextOffers = offers.filter(o => o.id !== id);
      await syncOffersState(nextOffers);
    }
  };

  const toggleActive = async (id: number) => {
    const nextOffers = offers.map(o => o.id === id ? { ...o, active: !o.active } : o);
    await syncOffersState(nextOffers);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Promotional Offers</h1>
          <p className="mt-1 text-slate-500">Manage coupon codes and discounts shown on the live website saved on AWS.</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Tag className="text-orange-500 shrink-0" size={20} />
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">{offer.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleActive(offer.id)} 
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                    offer.active 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {offer.active ? 'Active' : 'Disabled'}
                </button>
                <button 
                  onClick={() => openEditModal(offer)} 
                  className="text-slate-400 hover:text-orange-600 p-1 transition-colors"
                  title="Edit Offer"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(offer.id)} 
                  className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                  title="Delete Offer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{offer.description}</p>
          </div>
        ))}

        {offers.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <Tag size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No active offers yet</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">Click "Add Offer" to create your first coupon code for customers.</p>
            <button 
              onClick={openAddModal} 
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold inline-flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add First Offer
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Coupon Code / Offer Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SWADESHI10 or FREEDEL" 
                  value={formCode}
                  onChange={e => setFormCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Description / Discount Rules
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder="e.g. 10% off food bill on all orders OR Free delivery on orders over Rs 499" 
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="offerActiveCheck"
                  checked={formActive}
                  onChange={e => setFormActive(e.target.checked)}
                  className="w-5 h-5 rounded accent-orange-600 cursor-pointer"
                />
                <label htmlFor="offerActiveCheck" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Activate Offer Immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm"
                >
                  <Check size={16} />
                  {editingOffer ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

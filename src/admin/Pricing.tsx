import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getPricing, savePricing, type PricingSection } from '../lib/store';
import { fetchApiSetting, saveApiSetting, subscribeToLiveSync } from '../lib/api';

export default function Pricing() {
  const [pricingSections, setPricingSections] = useState<PricingSection[]>([]);

  const loadPricingData = async () => {
    const apiPricing = await fetchApiSetting<PricingSection[]>('pricing');
    if (apiPricing && Array.isArray(apiPricing)) {
      setPricingSections(apiPricing);
      savePricing(apiPricing);
    } else {
      setPricingSections(getPricing());
    }
  };

  useEffect(() => {
    loadPricingData();
    const interval = setInterval(loadPricingData, 2000);
    const unsubscribe = subscribeToLiveSync(loadPricingData);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const syncState = async (nextPricing: PricingSection[]) => {
    setPricingSections(nextPricing);
    savePricing(nextPricing);
    await saveApiSetting('pricing', nextPricing);
  };

  const handleAddSection = async () => {
    const newSection: PricingSection = {
      id: Date.now(),
      title: 'New Section',
      items: []
    };
    const nextPricing = [...pricingSections, newSection];
    await syncState(nextPricing);
  };

  const handleDeleteSection = async (id: number) => {
    if (window.confirm('Delete this entire pricing section?')) {
      const nextPricing = pricingSections.filter(s => s.id !== id);
      await syncState(nextPricing);
    }
  };

  const handleAddItem = async (sectionId: number) => {
    const nextPricing = pricingSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          items: [...s.items, { name: 'Item Name', priceText: 'Rs 0' }]
        };
      }
      return s;
    });
    await syncState(nextPricing);
  };

  const handleDeleteItem = async (sectionId: number, itemIndex: number) => {
    const nextPricing = pricingSections.map(s => {
      if (s.id === sectionId) {
        const newItems = [...s.items];
        newItems.splice(itemIndex, 1);
        return { ...s, items: newItems };
      }
      return s;
    });
    await syncState(nextPricing);
  };

  const handleUpdateItem = async (sectionId: number, itemIndex: number, field: string, value: string) => {
    const nextPricing = pricingSections.map(s => {
      if (s.id === sectionId) {
        const newItems = [...s.items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        return { ...s, items: newItems };
      }
      return s;
    });
    await syncState(nextPricing);
  };

  const handleUpdateSectionTitle = async (sectionId: number, title: string) => {
    const nextPricing = pricingSections.map(s => s.id === sectionId ? { ...s, title } : s);
    await syncState(nextPricing);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Pricing / Text Menus</h1>
          <p className="mt-1 text-slate-500">Manage non-visual text menus, extra items, and daily thali schedules saved live on AWS.</p>
        </div>
        <button onClick={handleAddSection} className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add Menu Section
        </button>
      </div>

      <div className="mt-8 space-y-8">
        {pricingSections.map((section) => (
          <div key={section.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center gap-4">
              <input 
                type="text" 
                value={section.title}
                onChange={e => handleUpdateSectionTitle(section.id, e.target.value)}
                className="font-black text-xl bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none flex-1 text-slate-900 dark:text-white"
              />
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleAddItem(section.id)} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors">
                  <Plus size={16} /> Add Item
                </button>
                <button onClick={() => handleDeleteSection(section.id)} className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors">
                  <Trash2 size={16} /> Delete Section
                </button>
              </div>
            </div>

            <div className="p-4">
              {section.items.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-2">No items in this section yet.</p>
              ) : (
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={e => handleUpdateItem(section.id, idx, 'name', e.target.value)}
                        placeholder="Item name"
                        className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                      />
                      <input 
                        type="text" 
                        value={item.priceText} 
                        onChange={e => handleUpdateItem(section.id, idx, 'priceText', e.target.value)}
                        placeholder="Price e.g. Rs 149"
                        className="w-36 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                      />
                      <button onClick={() => handleDeleteItem(section.id, idx)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

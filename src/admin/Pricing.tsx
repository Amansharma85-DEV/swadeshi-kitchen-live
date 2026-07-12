import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { getPricing, savePricing, type PricingSection } from '../lib/store';

export default function Pricing() {
  const [pricingSections, setPricingSections] = useState<PricingSection[]>([]);

  useEffect(() => {
    setPricingSections(getPricing());
  }, []);

  const handleAddSection = () => {
    const newSection: PricingSection = {
      id: Date.now(),
      title: 'New Section',
      items: []
    };
    const nextPricing = [...pricingSections, newSection];
    setPricingSections(nextPricing);
    savePricing(nextPricing);
  };

  const handleDeleteSection = (id: number) => {
    if (window.confirm('Delete this entire pricing section?')) {
      const nextPricing = pricingSections.filter(s => s.id !== id);
      setPricingSections(nextPricing);
      savePricing(nextPricing);
    }
  };

  const handleAddItem = (sectionId: number) => {
    const nextPricing = pricingSections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          items: [...s.items, { name: 'Item Name', priceText: 'Rs 0' }]
        };
      }
      return s;
    });
    setPricingSections(nextPricing);
    savePricing(nextPricing);
  };

  const handleDeleteItem = (sectionId: number, itemIndex: number) => {
    const nextPricing = pricingSections.map(s => {
      if (s.id === sectionId) {
        const newItems = [...s.items];
        newItems.splice(itemIndex, 1);
        return { ...s, items: newItems };
      }
      return s;
    });
    setPricingSections(nextPricing);
    savePricing(nextPricing);
  };

  const handleUpdateItem = (sectionId: number, itemIndex: number, field: string, value: string) => {
    const nextPricing = pricingSections.map(s => {
      if (s.id === sectionId) {
        const newItems = [...s.items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        return { ...s, items: newItems };
      }
      return s;
    });
    setPricingSections(nextPricing);
    savePricing(nextPricing);
  };

  const handleUpdateSectionTitle = (sectionId: number, title: string) => {
    const nextPricing = pricingSections.map(s => s.id === sectionId ? { ...s, title } : s);
    setPricingSections(nextPricing);
    savePricing(nextPricing);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Pricing / Text Menus</h1>
          <p className="mt-1 text-slate-500">Manage non-visual text menus, extra items, and daily thali schedules.</p>
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
                <button onClick={() => handleAddItem(section.id)} className="text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded flex items-center gap-1 hover:text-orange-600">
                  <Plus size={14} /> Add Row
                </button>
                <button onClick={() => handleDeleteSection(section.id)} className="text-slate-400 hover:text-red-600 p-1.5">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-4">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0 group">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={e => handleUpdateItem(section.id, idx, 'name', e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none focus:border-orange-500"
                    placeholder="Item Name (e.g. Monday)"
                  />
                  <input 
                    type="text" 
                    value={item.subText || ''}
                    onChange={e => handleUpdateItem(section.id, idx, 'subText', e.target.value)}
                    className="flex-[2] min-w-[200px] px-3 py-2 text-sm text-slate-500 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none focus:border-orange-500"
                    placeholder="Description / Subtext (Optional)"
                  />
                  <input 
                    type="text" 
                    value={item.priceText}
                    onChange={e => handleUpdateItem(section.id, idx, 'priceText', e.target.value)}
                    className="flex-1 min-w-[100px] px-3 py-2 font-bold bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none focus:border-orange-500 text-right"
                    placeholder="Price Text"
                  />
                  <button onClick={() => handleDeleteItem(section.id, idx)} className="p-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {section.items.length === 0 && (
                <p className="text-center text-slate-500 text-sm py-4">No items in this section. Click 'Add Row' to start.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Layers, Edit2, Trash2, Check, X } from 'lucide-react';
import { getMenu, renameCategory, deleteCategory } from '../lib/store';

export default function Categories() {
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const loadCategories = () => {
    const menu = getMenu();
    const catMap = new Map<string, number>();
    menu.forEach(item => {
      const c = item.category || 'Uncategorized';
      catMap.set(c, (catMap.get(c) || 0) + 1);
    });
    const sorted = Array.from(catMap.entries()).map(([name, count]) => ({name, count}));
    setCategories(sorted);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (name: string) => {
    setEditingCat(name);
    setEditValue(name);
  };

  const handleSaveEdit = (oldName: string) => {
    if (editValue.trim() && editValue.trim() !== oldName) {
      renameCategory(oldName, editValue.trim());
      loadCategories();
    }
    setEditingCat(null);
  };

  const handleDelete = (name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"? All items in it will become Uncategorized.`)) {
      deleteCategory(name);
      loadCategories();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-slate-500">Manage categories to organize your menu items.</p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm max-w-3xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
          <Layers className="text-slate-400" size={18} />
          <h2 className="font-bold text-slate-700 dark:text-slate-300">Active Categories</h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((cat) => (
            <div key={cat.name} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex-1">
                {editingCat === cat.name ? (
                  <div className="flex items-center gap-2 max-w-sm">
                    <input 
                      type="text" 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(cat.name)} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingCat(null)} className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{cat.name}</p>
                    <p className="text-sm text-slate-500">{cat.count} items</p>
                  </div>
                )}
              </div>
              
              {!editingCat && cat.name !== 'Uncategorized' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(cat.name)}
                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.name)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

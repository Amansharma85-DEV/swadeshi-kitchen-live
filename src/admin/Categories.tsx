import { useState, useEffect } from 'react';
import { Layers, Edit2, Trash2, Check, X, Plus } from 'lucide-react';
import { getMenu, renameCategory, deleteCategory } from '../lib/store';
import { fetchApiCategories, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '../lib/api';

export default function Categories() {
  const [categories, setCategories] = useState<{ id?: number; name: string; count: number }[]>([]);
  const [editingCatId, setEditingCatId] = useState<number | string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadCategories = async () => {
    const apiCats = await fetchApiCategories();
    if (apiCats && apiCats.length > 0) {
      const mapped = apiCats.map((c) => ({ id: c.id, name: c.name, count: 0 }));
      setCategories(mapped);
    } else {
      const menu = getMenu();
      const catMap = new Map<string, number>();
      menu.forEach((item) => {
        const c = item.category || 'Uncategorized';
        catMap.set(c, (catMap.get(c) || 0) + 1);
      });
      const sorted = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
      setCategories(sorted);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (cat: { id?: number; name: string }) => {
    setEditingCatId(cat.id || cat.name);
    setEditValue(cat.name);
  };

  const handleSaveEdit = async (cat: { id?: number; name: string }) => {
    if (editValue.trim() && editValue.trim() !== cat.name) {
      if (cat.id) {
        await updateCategoryApi(cat.id, { name: editValue.trim() });
      } else {
        await createCategoryApi({ name: editValue.trim() });
      }
      renameCategory(cat.name, editValue.trim());
      await loadCategories();
    }
    setEditingCatId(null);
  };

  const handleAddCategory = async () => {
    if (newCatName.trim()) {
      await createCategoryApi({ name: newCatName.trim() });
      setNewCatName('');
      setIsAdding(false);
      await loadCategories();
    }
  };

  const handleDelete = async (cat: { id?: number; name: string }) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      if (cat.id) {
        await deleteCategoryApi(cat.id);
      }
      deleteCategory(cat.name);
      await loadCategories();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-slate-500">Manage categories saved live in your database.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-colors"
        >
          <Plus size={18} /> Add New Category
        </button>
      </div>

      {isAdding && (
        <div className="mt-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm max-w-3xl flex items-center gap-3">
          <input
            type="text"
            placeholder="Category Name..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm max-w-3xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
          <Layers className="text-slate-400" size={18} />
          <h2 className="font-bold text-slate-700 dark:text-slate-300">Active Categories</h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.name}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex-1">
                {editingCatId === (cat.id || cat.name) ? (
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(cat)}
                      className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{cat.name}</p>
                  </div>
                )}
              </div>

              {!editingCatId && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
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

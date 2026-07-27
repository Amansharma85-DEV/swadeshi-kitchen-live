import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { getMenu, deleteMenuItem, type MenuItem } from '../lib/store';
import { fetchApiMenu, updateMenuItemApi, deleteMenuItemApi } from '../lib/api';
import ProductForm from './ProductForm';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | undefined>(undefined);

  const loadProducts = async () => {
    const apiItems = await fetchApiMenu();
    if (apiItems && apiItems.length > 0) {
      const mapped: MenuItem[] = apiItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category_name || 'Our Special Paranthas',
        description: item.description,
        price: Number(item.price),
        image: item.image_url || 'https://amansharma85-dev.github.io/swadeshi-kitchen-live/stuffed_paratha.png',
        tag: item.tag || 'Popular',
        status: item.is_available ? 'In Stock' : 'Out of Stock',
        inStock: item.is_available
      }));
      setProducts(mapped);
    } else {
      setProducts(getMenu().map(item => ({
        ...item,
        status: item.inStock !== false ? 'In Stock' : 'Out of Stock',
        inStock: item.inStock !== false
      })));
    }
  };

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 3000);
    const handleForceSync = () => loadProducts();
    window.addEventListener('swadeshi-force-sync', handleForceSync);
    return () => {
      clearInterval(interval);
      window.removeEventListener('swadeshi-force-sync', handleForceSync);
    };
  }, []);

  const handleToggleStock = async (product: MenuItem) => {
    const nextStock = !product.inStock;
    await updateMenuItemApi(product.id, { is_available: nextStock });
    loadProducts();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMenuItemApi(id);
      await loadProducts();
    }
  };

  const handleEdit = (product: MenuItem) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const inStockCount = products.filter(p => p.inStock !== false).length;
  const outOfStockCount = products.filter(p => p.inStock === false).length;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (stockFilter === 'in_stock') return matchesSearch && p.inStock !== false;
    if (stockFilter === 'out_of_stock') return matchesSearch && p.inStock === false;
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Products & Inventory</h1>
          <p className="mt-1 text-slate-500">Manage dish pricing, category classification, and live stock availability.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setEditingProduct(undefined);
              setIsFormOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          onClose={handleCloseForm} 
          onSave={loadProducts} 
          initialData={editingProduct}
        />
      )}

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStockFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${stockFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setStockFilter('in_stock')}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${stockFilter === 'in_stock' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'}`}
        >
          <span>🟢</span> In Stock ({inStockCount})
        </button>
        <button
          onClick={() => setStockFilter('out_of_stock')}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${stockFilter === 'out_of_stock' ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40'}`}
        >
          <span>🔴</span> Out of Stock ({outOfStockCount})
        </button>
      </div>

      <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products or categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold uppercase tracking-wide border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No products found matching filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isInStock = product.inStock !== false;
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={18} />
                          )}
                        </div>
                        <span className="text-slate-900 dark:text-white">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-semibold">{product.category}</td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-black">Rs {product.price}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStock(product)}
                          title="Click to toggle stock status"
                          className="flex items-center gap-2 group focus:outline-none"
                        >
                          {isInStock ? (
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-200 transition-colors">
                              <span>🟢</span> In Stock
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-red-200 transition-colors">
                              <span>🔴</span> Out of Stock
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/20 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

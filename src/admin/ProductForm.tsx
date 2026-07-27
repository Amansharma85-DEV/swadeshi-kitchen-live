import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { addMenuItem, editMenuItem, type MenuItem } from '../lib/store';
import { createMenuItemApi, updateMenuItemApi, fetchApiCategories, type ApiCategory } from '../lib/api';

export default function ProductForm({ 
  onClose, 
  onSave,
  initialData 
}: { 
  onClose: () => void, 
  onSave: () => void,
  initialData?: MenuItem 
}) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    image: initialData?.image || '',
    tag: initialData?.tag || '',
    inStock: initialData?.inStock !== false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchApiCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
        if (!formData.category) {
          setFormData(prev => ({ ...prev, category: cats[0].name }));
        }
      }
    });
  }, []);

  // Handle local image upload and convert to lightweight WebP base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        
        // Convert to WebP/JPEG format for ultra compression (~12KB payload)
        let dataUrl = canvas.toDataURL('image/webp', 0.5);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        }
        setFormData(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert("Name, Category, and Price are required.");
      return;
    }

    setIsSubmitting(true);

    const matchedCat = categories.find(c => c.name.toLowerCase() === formData.category.toLowerCase());
    const category_id = matchedCat ? matchedCat.id : 1;
    
    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
      tag: formData.tag || 'New',
      inStock: formData.inStock
    };

    let res: any;
    if (initialData) {
      res = await updateMenuItemApi(initialData.id, {
        category_id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image,
        tag: productData.tag,
        is_available: formData.inStock
      });
    } else {
      res = await createMenuItemApi({
        category_id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image,
        tag: productData.tag,
        is_available: formData.inStock
      });
    }
    
    setIsSubmitting(false);

    if (res && res.success === false) {
      alert(`Error updating product: ${res.message || 'Failed to save to database'}`);
      return;
    }

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" placeholder="e.g. Special Paneer Paratha" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category *</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white">
                  {categories.length > 0 ? (
                    categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                  ) : (
                    <>
                      <option value="Our Special paratha">Our Special paratha</option>
                      <option value="Thali & Rice Combos">Thali & Rice Combos</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Extras">Extras</option>
                      <option value="Desserts">Desserts</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price (₹) *</label>
                <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" placeholder="99.00" />
              </div>
            </div>

            {/* Inventory Status Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stock Availability</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.inStock ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>
                  <input type="radio" name="inStock" checked={formData.inStock} onChange={() => setFormData({...formData, inStock: true})} className="sr-only" />
                  <span>🟢 In Stock</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${!formData.inStock ? 'border-rose-500 bg-rose-500/10 text-rose-600 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}>
                  <input type="radio" name="inStock" checked={!formData.inStock} onChange={() => setFormData({...formData, inStock: false})} className="sr-only" />
                  <span>🔴 Out of Stock</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" placeholder="Delicious fresh food..."></textarea>
            </div>
            
            {/* Dual Product Image Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Product Photo</label>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg text-xs font-bold">
                  <button type="button" onClick={() => setImageTab('upload')} className={`px-2.5 py-1 rounded-md transition-colors ${imageTab === 'upload' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-500'}`}>
                    Upload File
                  </button>
                  <button type="button" onClick={() => setImageTab('url')} className={`px-2.5 py-1 rounded-md transition-colors ${imageTab === 'url' ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-sm' : 'text-slate-500'}`}>
                    Paste URL Link
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="w-20 h-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-slate-400" size={28} />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  {imageTab === 'upload' ? (
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors text-sm shadow-sm"
                      >
                        <Upload size={16} />
                        Choose New Photo
                      </button>
                      <p className="text-xs text-slate-500 mt-1">Upload a photo from your mobile/laptop.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input 
                          type="url" 
                          value={formData.image} 
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                          placeholder="https://example.com/photo.jpg" 
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Paste any public photo URL link.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Badge / Tag</label>
              <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" placeholder="e.g. New, Popular" />
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" form="productForm" disabled={isSubmitting} className="px-5 py-2.5 font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50">
            {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

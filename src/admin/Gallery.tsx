import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getGallery, saveGallery, type GalleryImage } from '../lib/store';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    setImages(getGallery());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    const nextGallery = [...images, { id: Date.now(), url: newUrl }];
    setImages(nextGallery);
    saveGallery(nextGallery);
    setNewUrl('');
  };

  const handleDelete = (id: number) => {
    const nextGallery = images.filter(img => img.id !== id);
    setImages(nextGallery);
    saveGallery(nextGallery);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Gallery</h1>
          <p className="mt-1 text-slate-500">Manage images displayed in the website gallery section.</p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-4">
          <input 
            type="url" 
            required
            value={newUrl} 
            onChange={e => setNewUrl(e.target.value)} 
            placeholder="Paste image URL here..." 
            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500" 
          />
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Add Image
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map(img => (
          <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button onClick={() => handleDelete(img.id)} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

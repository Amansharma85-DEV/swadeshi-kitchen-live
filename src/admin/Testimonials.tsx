import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { getTestimonials, saveTestimonials, type Testimonial } from '../lib/store';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', review: '', rating: '5' });

  useEffect(() => {
    setTestimonials(getTestimonials());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.review) return;

    let updated: Testimonial[];
    if (editingId) {
      updated = testimonials.map(t => 
        t.id === editingId ? { ...t, ...formData, rating: Number(formData.rating) } : t
      );
    } else {
      const nextId = Math.max(0, ...testimonials.map(t => t.id)) + 1;
      updated = [...testimonials, { id: nextId, name: formData.name, review: formData.review, rating: Number(formData.rating) }];
    }

    setTestimonials(updated);
    saveTestimonials(updated);
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', review: '', rating: '5' });
  };

  const handleEdit = (t: Testimonial) => {
    setFormData({ name: t.name, review: t.review, rating: String(t.rating) });
    setEditingId(t.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this testimonial?')) {
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      saveTestimonials(updated);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Testimonials</h1>
          <p className="mt-1 text-slate-500">Manage customer reviews shown on your website.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', review: '', rating: '5' });
            setEditingId(null);
            setIsFormOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{editingId ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Customer Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rating (1-5)</label>
                <select value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Review</label>
                <textarea required value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
              <button type="submit" className="mt-2 w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors">Save</button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex text-yellow-400 mb-3">
                {Array.from({length: t.rating}).map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium italic">"{t.review}"</p>
              <p className="mt-4 font-black text-slate-900 dark:text-white">- {t.name}</p>
            </div>
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => handleEdit(t)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg"><Edit2 size={16}/></button>
              <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

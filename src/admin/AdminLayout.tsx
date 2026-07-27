import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import { RefreshCw, Database } from 'lucide-react';

import Products from './Products';
import Pricing from './Pricing';
import Gallery from './Gallery';
import Offers from './Offers';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Categories from './Categories';
import Settings from './Settings';
import Testimonials from './Testimonials';

export default function AdminLayout() {
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerLiveSync = () => {
    setIsSyncing(true);
    window.dispatchEvent(new Event('swadeshi-force-sync'));
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Sync Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database size={14} />
            AWS MySQL Live Database Connected
          </div>

          <button
            onClick={triggerLiveSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg text-sm font-bold border border-orange-200 dark:border-orange-800/40 transition-all active:scale-95"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Refresh Live Data'}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Page under construction</h2>
                <p className="text-slate-500 mt-2">This admin feature is coming soon.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

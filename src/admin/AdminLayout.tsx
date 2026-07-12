import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';

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
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
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
  );
}

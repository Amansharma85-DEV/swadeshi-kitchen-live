import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';
import { getMenu } from '../lib/store';
import { readLocalOrders, type StoredOrder } from '../lib/firebase';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeMenuItems: 0,
    revenueToday: 0,
  });
  const [recentOrders, setRecentOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    const menu = getMenu();
    const orders = readLocalOrders();
    
    // Calculate today's revenue (just summing all for now in this demo)
    const revenue = orders.reduce((sum, order) => sum + (order.totals?.grandTotal || 0), 0);

    setMetrics({
      totalOrders: orders.length,
      activeMenuItems: menu.length,
      revenueToday: revenue,
    });

    setRecentOrders(orders.slice(0, 5));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Dashboard Overview</h1>
      <p className="mt-2 text-slate-500">Welcome to Swadeshi Kitchen Admin</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Orders</p>
            <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{metrics.totalOrders}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShoppingCart size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Menu Items</p>
            <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{metrics.activeMenuItems}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Revenue</p>
            <p className="text-3xl font-black mt-2 text-slate-900 dark:text-white">Rs {metrics.revenueToday}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-500" />
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">#{order.id.slice(0,6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 font-black">Rs {order.totals.grandTotal}</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

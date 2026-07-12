import { useState, useEffect } from 'react';
import { Package, Search, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { readLocalOrders, updateOrderStatus, type StoredOrder } from '../lib/firebase';

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrders = () => {
    setOrders(readLocalOrders());
  };

  useEffect(() => {
    loadOrders();
    // In a real app we'd set up a Firebase listener here
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pending': return <Clock size={16} className="text-amber-500" />;
      case 'Preparing': return <Package size={16} className="text-blue-500" />;
      case 'Packed': return <Package size={16} className="text-indigo-500" />;
      case 'Out for Delivery': return <Truck size={16} className="text-purple-500" />;
      case 'Delivered': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Preparing': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Packed': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Orders</h1>
          <p className="mt-1 text-slate-500">Track and manage customer orders.</p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Name, or Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold uppercase tracking-wide border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">#{order.id.slice(0,6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.customer.phone}</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[200px] truncate" title={order.customer.address}>{order.customer.address}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600 dark:text-slate-400 font-medium max-w-[250px]">
                        {order.items.map(item => (
                          <div key={item.name} className="truncate">
                            <span className="font-bold text-slate-900 dark:text-slate-200">{item.quantity}x</span> {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-black">Rs {order.totals.grandTotal}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status || 'Pending')}`}>
                        {getStatusIcon(order.status || 'Pending')}
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
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

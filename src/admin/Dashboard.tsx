import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp, Eye, Phone, MessageSquare, Printer, X, MapPin, User, Mail, FileText, Calendar, CreditCard } from 'lucide-react';
import { fetchApiMenu, fetchApiOrders, updateOrderStatusApi, subscribeToLiveSync } from '../lib/api';

const STATUS_OPTIONS = ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    activeMenuItems: 0,
    revenueToday: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [addressModalOrder, setAddressModalOrder] = useState<any | null>(null);

  const loadDashboardData = async () => {
    const [apiItems, apiOrders] = await Promise.all([
      fetchApiMenu(),
      fetchApiOrders()
    ]);

    const activeCount = apiItems ? apiItems.length : 0;
    const ordersList = apiOrders || [];

    const revenue = ordersList.reduce((sum: number, order: any) => sum + Number(order.grand_total || 0), 0);

    setMetrics({
      totalOrders: ordersList.length,
      activeMenuItems: activeCount,
      revenueToday: revenue,
    });

    const mappedOrders = ordersList.map((o: any) => ({
      id: o.order_code || `SK-${o.id}`,
      db_id: o.id,
      customer: {
        name: o.customer_name || 'Customer',
        phone: o.customer_phone || '',
        email: o.customer_email || o.email || '',
        address: o.customer_address || 'Address Not Provided',
        note: o.customer_note || ''
      },
      items: Array.isArray(o.items) ? o.items.map((i: any) => ({
        name: i.item_name || i.name || 'Dish Item',
        quantity: Number(i.quantity || 1),
        price: Number(i.unit_price || i.price || 0)
      })) : [],
      totals: {
        subtotal: Number(o.subtotal || 0),
        discount: Number(o.discount || 0),
        deliveryFee: Number(o.delivery_fee || 0),
        grandTotal: Number(o.grand_total || 0)
      },
      paymentMethod: o.payment_method || 'Cash on Delivery',
      deliveryMethod: o.delivery_method || 'Standard',
      couponCode: o.coupon_code || 'None',
      status: o.status || 'Pending',
      createdAt: o.created_at || new Date().toISOString()
    }));

    setRecentOrders(mappedOrders);
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 2000);
    const unsubscribe = subscribeToLiveSync(loadDashboardData);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (order: any, newStatus: string) => {
    if (order.db_id) {
      await updateOrderStatusApi(order.db_id, newStatus);
    }
    loadDashboardData();
  };

  const handlePrintInvoice = (order: any) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const itemsList = Array.isArray(order.items) ? order.items : [];
    const itemsHtml = itemsList.map((item: any) => {
      const itemName = item.name || item.item_name || 'Delicious Dish';
      const itemQty = Number(item.quantity || 1);
      const itemPrice = Number(item.price !== undefined ? item.price : (item.unit_price !== undefined ? item.unit_price : 0));
      const itemTotal = Number(item.subtotal !== undefined ? item.subtotal : (itemPrice * itemQty));
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${itemName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${itemQty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${itemPrice}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${itemTotal}</td>
        </tr>
      `;
    }).join('');

    const subtotal = order.totals?.subtotal || itemsList.reduce((s: number, i: any) => s + ((i.price || i.unit_price || 0) * (i.quantity || 1)), 0);
    const gst = Math.round(subtotal * 0.05);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ea580c; padding-bottom: 10px; }
            .brand { font-size: 24px; font-weight: bold; color: #ea580c; }
            .sub { font-size: 13px; color: #666; }
            .section { margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .table th { background: #f8fafc; padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1; }
            .totals { margin-top: 20px; float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand { font-size: 18px; font-weight: bold; color: #ea580c; border-top: 2px solid #333; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">SWADESHI KITCHEN</div>
            <div class="sub">Pure & Authentic Homemade Delights</div>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Tax Invoice / Order Receipt</p>
          </div>

          <div class="section">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>

          <div class="section">
            <h3 style="margin-bottom: 5px; color: #1e293b;">Customer Details</h3>
            <p style="margin: 3px 0;"><strong>Name:</strong> ${order.customer.name}</p>
            <p style="margin: 3px 0;"><strong>Phone:</strong> ${order.customer.phone}</p>
            ${order.customer.email ? `<p style="margin: 3px 0;"><strong>Email:</strong> ${order.customer.email}</p>` : ''}
            <p style="margin: 3px 0;"><strong>Address:</strong> ${order.customer.address}</p>
            ${order.customer.note ? `<p style="margin: 3px 0;"><strong>Note:</strong> ${order.customer.note}</p>` : ''}
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Subtotal:</span><span>₹${subtotal}</span></div>
            <div class="totals-row"><span>Delivery Charge:</span><span>₹${order.totals.deliveryFee}</span></div>
            <div class="totals-row"><span>Discount:</span><span>-₹${order.totals.discount}</span></div>
            <div class="totals-row"><span>GST (5%):</span><span>₹${gst}</span></div>
            <div class="totals-row grand"><span>Grand Total:</span><span>₹${order.totals.grandTotal}</span></div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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

      {/* Enhanced Recent Orders Table */}
      <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp size={20} className="text-orange-500" />
            Recent Orders
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
            Live AWS Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer Details</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const isLongAddress = order.customer.address.length > 38;
                  const displayAddress = isLongAddress ? `${order.customer.address.slice(0, 38)}...` : order.customer.address;
                  const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      {/* 1. Order ID */}
                      <td className="px-5 py-4 font-mono font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                        #{order.id.slice(0, 10).toUpperCase()}
                        <p className="text-[11px] font-sans text-slate-400 font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      {/* 2. Customer Details */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 dark:text-white text-base">{order.customer.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📞</span> {order.customer.phone}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>✉️</span> {order.customer.email || 'No email provided'}
                        </p>
                      </td>

                      {/* 3. Address */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                          {displayAddress}
                        </p>
                        {isLongAddress && (
                          <button
                            onClick={() => setAddressModalOrder(order)}
                            className="mt-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 underline cursor-pointer"
                          >
                            View Full Address
                          </button>
                        )}
                      </td>

                      {/* 4. Items */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {(order.items || []).length} {(order.items || []).length === 1 ? 'Item' : 'Items'}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[180px] truncate">
                          {(order.items || []).map((i: any) => `${i.quantity || 1}x ${i.name || i.item_name || 'Dish'}`).join(', ')}
                        </div>
                      </td>

                      {/* 5. Total */}
                      <td className="px-5 py-4 font-black text-slate-900 dark:text-white whitespace-nowrap text-base">
                        ₹{order.totals.grandTotal}
                      </td>

                      {/* 6. Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 7. Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            title="View Details"
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Eye size={14} /> <span>View</span>
                          </button>

                          {/* Call */}
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              title="Call Customer"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Phone size={14} />
                            </a>
                          )}

                          {/* WhatsApp */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(`Hello ${order.customer.name}, regarding your Swadeshi Kitchen order #${order.id}...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp Message"
                              className="p-1.5 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:hover:bg-green-900/60 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <MessageSquare size={14} />
                            </a>
                          )}

                          {/* Print Invoice */}
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            title="Print Invoice"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Printer size={14} />
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

      {/* View Full Address Modal */}
      {addressModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setAddressModalOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-orange-500" /> Complete Delivery Address
            </h3>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Customer: {addressModalOrder.customer.name} ({addressModalOrder.customer.phone})
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-3">
              {addressModalOrder.customer.address}
            </div>
            {addressModalOrder.customer.note && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <strong>Cooking Note / Landmark:</strong> {addressModalOrder.customer.note}
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setAddressModalOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ View Details Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-widest text-orange-200 font-bold">Order Details</span>
                <h2 className="text-2xl font-black mt-0.5">#{selectedOrder.id.toUpperCase()}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section 1: Customer Information */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                  <User size={16} /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                      <Phone size={14} className="text-emerald-500" /> {selectedOrder.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email Address</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Mail size={14} className="text-blue-500" /> {selectedOrder.customer.email || 'No email provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Payment Method</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <CreditCard size={14} className="text-purple-500" /> {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500 font-medium">Complete Delivery Address</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <MapPin size={14} className="inline text-orange-500 mr-1" /> {selectedOrder.customer.address}
                    </p>
                  </div>
                  {selectedOrder.customer.note && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-500 font-medium">Cooking Note / Landmark</p>
                      <p className="font-medium text-amber-800 dark:text-amber-300 mt-0.5 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900">
                        {selectedOrder.customer.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Ordered Items */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <Package size={16} /> Ordered Items ({selectedOrder.items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-xs uppercase">
                        <th className="pb-2">Product Name</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                          <td className="py-2.5 text-center font-semibold text-slate-700 dark:text-slate-300">{item.quantity}</td>
                          <td className="py-2.5 text-right font-medium text-slate-600 dark:text-slate-400">₹{item.price}</td>
                          <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Order Date & Time</span>
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <Calendar size={14} /> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{selectedOrder.totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{selectedOrder.totals.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Discount</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">-₹{selectedOrder.totals.discount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>GST (5%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(selectedOrder.totals.subtotal * 0.05)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-black text-lg text-slate-900 dark:text-white">Grand Total</span>
                    <span className="font-black text-2xl text-orange-600 dark:text-orange-400">₹{selectedOrder.totals.grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone size={14} /> Call
                </a>
                <a
                  href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.customer.name}, regarding your order #${selectedOrder.id}...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Image as ImageIcon, 
  DollarSign, 
  Tag, 
  MessageSquare, 
  MonitorPlay, 
  Settings, 
  Phone, 
  ShoppingCart, 
  MessageCircle, 
  Search,
  LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Layers, label: 'Categories', path: '/admin/categories' },
  { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
  { icon: DollarSign, label: 'Pricing', path: '/admin/pricing' },
  { icon: Tag, label: 'Offers', path: '/admin/offers' },
  { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Settings, label: 'Website Settings', path: '/admin/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('swadeshi_admin_auth');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-black text-white">Admin Panel</h2>
        <p className="text-xs text-slate-500 mt-1">Swadeshi Kitchen</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-orange-500 text-sm font-bold hover:text-orange-400">
          View Live Website
        </Link>
      </div>
      
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                isActive 
                  ? 'bg-orange-500 text-white' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold w-full text-left hover:bg-slate-800 hover:text-white transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

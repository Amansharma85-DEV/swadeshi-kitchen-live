import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';

import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import ProtectedRoute from './admin/ProtectedRoute';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
        <Route path="/products" element={<Navigate to="/admin/products" replace />} />
        <Route path="/orders" element={<Navigate to="/admin/orders" replace />} />
        <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

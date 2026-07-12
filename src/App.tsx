import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';

import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import ProtectedRoute from './admin/ProtectedRoute';

function App() {
  return (
    <BrowserRouter basename="/swadeshi-kitchen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

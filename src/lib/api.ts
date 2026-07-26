export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://43.204.145.203/api';

export type ApiMenuItem = {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tag: string;
  is_veg: boolean;
  is_bestseller: boolean;
  is_available: boolean;
};

export type ApiCategory = {
  id: number;
  name: string;
  description: string;
};

// Fetch all menu items from AWS EC2 API
export async function fetchApiMenu(): Promise<ApiMenuItem[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data?.menu)) {
      return json.data.menu;
    }
  } catch (err) {
    console.warn('Backend API connection warning:', err);
  }
  return null;
}

// Fetch all categories from AWS EC2 API
export async function fetchApiCategories(): Promise<ApiCategory[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data?.categories)) {
      return json.data.categories;
    }
  } catch (err) {
    console.warn('Backend categories connection warning:', err);
  }
  return null;
}

// Create Menu Item in AWS EC2 API
export async function createMenuItemApi(item: {
  name: string;
  category_id?: number;
  description: string;
  price: number;
  image_url?: string;
  tag?: string;
}) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(item)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Update Menu Item in AWS EC2 API
export async function updateMenuItemApi(id: number, item: {
  name?: string;
  category_id?: number;
  description?: string;
  price?: number;
  image_url?: string;
  tag?: string;
  is_available?: boolean;
}) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(item)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Delete Menu Item from AWS EC2 API
export async function deleteMenuItemApi(id: number) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Create Category in AWS EC2 API
export async function createCategoryApi(category: { name: string; description?: string }) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(category)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Update Category in AWS EC2 API
export async function updateCategoryApi(id: number, category: { name?: string; description?: string }) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(category)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Delete Category from AWS EC2 API
export async function deleteCategoryApi(id: number) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Fetch all orders from AWS EC2 API
export async function fetchApiOrders() {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data?.orders)) {
      return json.data.orders;
    }
  } catch (err) {
    console.warn('Backend orders connection warning:', err);
  }
  return null;
}

// Update Order Status in AWS EC2 API
export async function updateOrderStatusApi(id: number, status: string) {
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Submit Customer Order to AWS EC2 Database
export async function submitApiOrder(orderData: {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note?: string;
  subtotal: number;
  discount?: number;
  delivery_fee?: number;
  grand_total: number;
  payment_method?: string;
  delivery_method?: string;
  coupon_code?: string;
  items: Array<{
    menu_item_id?: number;
    item_name: string;
    quantity: number;
    unit_price: number;
  }>;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

// Admin Login API
export async function adminLoginApi(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return { success: false, message: 'Network connection error' };
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://protect-cooperative-blocking-what.trycloudflare.com/api';

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

// --- REAL-TIME BROADCAST CHANNEL & EVENT BUS ---
const liveSyncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('swadeshi_realtime_sync') 
  : null;

export function notifyDataChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('swadeshi-force-sync'));
    if (liveSyncChannel) {
      try {
        liveSyncChannel.postMessage({ type: 'SWADESHI_DATA_UPDATE', timestamp: Date.now() });
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }
  }
}

export function subscribeToLiveSync(onUpdate: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleEvent = () => onUpdate();
  window.addEventListener('swadeshi-force-sync', handleEvent);

  let handleChannelMsg: ((e: MessageEvent) => void) | null = null;
  if (liveSyncChannel) {
    handleChannelMsg = (e: MessageEvent) => {
      if (e.data?.type === 'SWADESHI_DATA_UPDATE') {
        onUpdate();
      }
    };
    liveSyncChannel.addEventListener('message', handleChannelMsg);
  }

  return () => {
    window.removeEventListener('swadeshi-force-sync', handleEvent);
    if (liveSyncChannel && handleChannelMsg) {
      liveSyncChannel.removeEventListener('message', handleChannelMsg);
    }
  };
}

// Fetch all menu items from AWS EC2 API
export async function fetchApiMenu(): Promise<ApiMenuItem[] | null> {
  const url = `${API_BASE_URL}/menu?_t=${Date.now()}`;
  console.log('[API REQ] GET Menu:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[API RES ERR] GET Menu failed with status:', res.status);
      return null;
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data?.menu)) {
      console.log('[API RES OK] GET Menu items count:', json.data.menu.length);
      return json.data.menu;
    }
  } catch (err) {
    console.warn('[API ERR] GET Menu network error:', err);
  }
  return null;
}

// Fetch all categories from AWS EC2 API
export async function fetchApiCategories(): Promise<ApiCategory[] | null> {
  const url = `${API_BASE_URL}/categories?_t=${Date.now()}`;
  console.log('[API REQ] GET Categories:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[API RES ERR] GET Categories failed with status:', res.status);
      return null;
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data?.categories)) {
      console.log('[API RES OK] GET Categories count:', json.data.categories.length);
      return json.data.categories;
    }
  } catch (err) {
    console.warn('[API ERR] GET Categories network error:', err);
  }
  return null;
}

// Direct Multipart/Form-Data File Upload to AWS Backend
export async function uploadImageFileApi(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  const url = `${API_BASE_URL}/menu/upload`;
  console.log('[API REQ] POST Upload File:', url, file.name, file.size);
  try {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    const json = await res.json();
    console.log('[API RES] POST Upload File status:', res.status, json);
    if (res.ok && json.success && json.data?.url) {
      return { success: true, url: json.data.url };
    }
    return { success: false, message: json.message || `Server returned HTTP ${res.status}` };
  } catch (err: any) {
    console.warn('[API ERR] Direct upload failed:', err.message);
    return { success: false, message: err.message || 'Direct upload unavailable' };
  }
}

// Create Menu Item in AWS EC2 API
export async function createMenuItemApi(item: {
  name: string;
  category_id?: number;
  description: string;
  price: number;
  image_url?: string;
  tag?: string;
  is_available?: boolean;
}) {
  const url = `${API_BASE_URL}/menu`;
  console.log('[API REQ] POST Menu Item:', url, '[PAYLOAD]:', item);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(item)
    });
    const json = await res.json();
    console.log('[API RES] POST Menu Item status:', res.status, '[DATA]:', json);
    if (res.ok && json.success) {
      notifyDataChange();
      return json;
    }
    return { success: false, message: json.message || `HTTP ${res.status} Error` };
  } catch (err: any) {
    console.error('[API ERR] POST Menu Item failed:', err);
    return { success: false, message: err.message ? `Network Error: ${err.message}` : 'Failed to reach server. Please check internet connection.' };
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
  const url = `${API_BASE_URL}/menu/${id}`;
  console.log('[API REQ] PUT Menu Item ID:', id, url, '[PAYLOAD]:', item);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(item)
    });
    const json = await res.json();
    console.log('[API RES] PUT Menu Item ID:', id, 'status:', res.status, '[DATA]:', json);
    if (res.ok && json.success) {
      notifyDataChange();
      return json;
    }
    return { success: false, message: json.message || `HTTP ${res.status} Error` };
  } catch (err: any) {
    console.error('[API ERR] PUT Menu Item failed:', err);
    return { success: false, message: err.message ? `Network Error: ${err.message}` : 'Failed to reach server. Please check internet connection.' };
  }
}

// Delete Menu Item from AWS EC2 API
export async function deleteMenuItemApi(id: number) {
  const url = `${API_BASE_URL}/menu/${id}`;
  console.log('[API REQ] DELETE Menu Item ID:', id, url);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const json = await res.json();
    console.log('[API RES] DELETE Menu Item ID:', id, 'status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] DELETE Menu Item failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Create Category in AWS EC2 API
export async function createCategoryApi(category: { name: string; description?: string }) {
  const url = `${API_BASE_URL}/categories`;
  console.log('[API REQ] POST Category:', url, '[PAYLOAD]:', category);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(category)
    });
    const json = await res.json();
    console.log('[API RES] POST Category status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] POST Category failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Update Category in AWS EC2 API
export async function updateCategoryApi(id: number, category: { name?: string; description?: string }) {
  const url = `${API_BASE_URL}/categories/${id}`;
  console.log('[API REQ] PUT Category ID:', id, url, '[PAYLOAD]:', category);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(category)
    });
    const json = await res.json();
    console.log('[API RES] PUT Category ID:', id, 'status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] PUT Category failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Delete Category from AWS EC2 API
export async function deleteCategoryApi(id: number) {
  const url = `${API_BASE_URL}/categories/${id}`;
  console.log('[API REQ] DELETE Category ID:', id, url);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    const json = await res.json();
    console.log('[API RES] DELETE Category ID:', id, 'status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] DELETE Category failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Fetch Orders from AWS EC2 API
export async function fetchApiOrders() {
  const url = `${API_BASE_URL}/orders?_t=${Date.now()}`;
  console.log('[API REQ] GET Orders:', url);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && Array.isArray(json.data?.orders)) {
      console.log('[API RES OK] GET Orders count:', json.data.orders.length);
      return json.data.orders;
    }
  } catch (err) {
    console.warn('[API ERR] GET Orders network error:', err);
  }
  return null;
}

// Submit Customer Order to AWS EC2 API
export async function submitApiOrder(orderData: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  order_notes?: string;
  payment_method?: string;
  delivery_method?: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  items: { product_id: number; quantity: number; unit_price: number }[];
}) {
  const url = `${API_BASE_URL}/orders`;
  console.log('[API REQ] POST Order:', url, '[PAYLOAD]:', orderData);
  try {
    const payload = {
      ...orderData,
      customer_address: orderData.delivery_address,
      grand_total: orderData.total_amount
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    console.log('[API RES] POST Order status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] POST Order failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Update Order Status in AWS EC2 API
export async function updateOrderStatusApi(id: number, status: string) {
  const url = `${API_BASE_URL}/orders/${id}/status`;
  console.log('[API REQ] PUT Order Status ID:', id, status, url);
  try {
    const token = localStorage.getItem('swadeshi_token');
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    console.log('[API RES] PUT Order Status ID:', id, 'status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] PUT Order Status failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Admin Login API
export async function adminLoginApi(credentials: { email: string; password: string }) {
  const url = `${API_BASE_URL}/auth/login`;
  console.log('[API REQ] POST Admin Login:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    console.log('[API RES] POST Admin Login status:', res.status, '[DATA]:', json);
    return json;
  } catch (err) {
    console.error('[API ERR] Admin Login failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

// Fetch Setting by Key from AWS EC2 API
export async function fetchApiSetting<T>(key: string): Promise<T | null> {
  const url = `${API_BASE_URL}/settings/${key}?_t=${Date.now()}`;
  console.log('[API REQ] GET Setting Key:', key, url);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data?.value !== undefined) {
      console.log('[API RES OK] GET Setting Key:', key, '[VALUE]:', json.data.value);
      return json.data.value as T;
    }
  } catch (err) {
    console.warn('[API ERR] GET Setting failed:', err);
  }
  return null;
}

// Save Setting by Key to AWS EC2 API
export async function saveApiSetting<T>(key: string, value: T) {
  const url = `${API_BASE_URL}/settings/${key}`;
  console.log('[API REQ] POST Setting Key:', key, url, '[VALUE]:', value);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value })
    });
    const json = await res.json();
    console.log('[API RES] POST Setting Key:', key, 'status:', res.status, '[DATA]:', json);
    notifyDataChange();
    return json;
  } catch (err) {
    console.error('[API ERR] POST Setting failed:', err);
    return { success: false, message: 'Network connection error' };
  }
}

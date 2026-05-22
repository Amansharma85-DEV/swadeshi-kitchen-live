import { initializeApp, type FirebaseApp } from 'firebase/app';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

export type StoredOrder = {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    note: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totals: {
    subtotal: number;
    discount: number;
    delivery: number;
    taxes: number;
    grandTotal: number;
  };
  paymentMethod: string;
  deliveryMethod: string;
  couponCode: string;
  status: string;
  createdAt: string;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let firebaseApp: FirebaseApp | null = null;

function getFirebaseApp() {
  if (!hasFirebaseConfig) {
    return null;
  }
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return firebaseApp;
}

function saveLocalOrder(order: StoredOrder) {
  const existing = JSON.parse(localStorage.getItem('swadeshi-orders') || '[]') as StoredOrder[];
  localStorage.setItem('swadeshi-orders', JSON.stringify([order, ...existing]));
}

export async function storeOrder(order: StoredOrder) {
  const app = getFirebaseApp();
  if (!app) {
    saveLocalOrder(order);
    return { mode: 'local', id: order.id };
  }

  const db = getFirestore(app);
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp()
  });
  saveLocalOrder({ ...order, id: docRef.id });
  return { mode: 'firebase', id: docRef.id };
}

export function readLocalOrders() {
  return JSON.parse(localStorage.getItem('swadeshi-orders') || '[]') as StoredOrder[];
}


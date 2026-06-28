'use client';
// src/lib/CartContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, parsePrecio } from '@/data/products';

// ─── Tipos ────────────────────────────────────────────
export interface CartItem {
  product: Product;
  qty: number;
  talla?: string;
  color?: string;
  tipo?: string;
  nota?: string; // instrucciones de estampado
  estampado?: { id: string; label: string; precio: number }; // tamaño de estampado (poleras/polerones)
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; index: number }
  | { type: 'UPDATE_QTY'; index: number; qty: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

// ─── Reducer ──────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      // Busca si ya existe el mismo producto+variante
      const existingIdx = state.items.findIndex(
        (i) =>
          i.product.id === action.item.product.id &&
          i.talla === action.item.talla &&
          i.color === action.item.color &&
          i.tipo === action.item.tipo &&
          i.estampado?.id === action.item.estampado?.id
      );
      if (existingIdx >= 0) {
        const updated = [...state.items];
        updated[existingIdx] = {
          ...updated[existingIdx],
          qty: updated[existingIdx].qty + action.item.qty,
        };
        return { ...state, items: updated, isOpen: true };
      }
      return { ...state, items: [...state.items, action.item], isOpen: true };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((_, i) => i !== action.index) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((_, i) => i !== action.index) };
      }
      const updated = [...state.items];
      updated[action.index] = { ...updated[action.index], qty: action.qty };
      return { ...state, items: updated };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────
interface CartContextValue {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalEstampado: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────
const STORAGE_KEY = 'patronestampados_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Persistir en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        parsed.forEach((item) => dispatch({ type: 'ADD', item }));
      }
    } catch {
      // Si falla, ignorar
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Si falla, ignorar
    }
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const unit = parsePrecio(i.product.precio) + (i.estampado?.precio || 0);
    return sum + unit * i.qty;
  }, 0);
  const totalEstampado = state.items.reduce((sum, i) => sum + (i.estampado?.precio || 0) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (item) => dispatch({ type: 'ADD', item }),
        removeItem: (index) => dispatch({ type: 'REMOVE', index }),
        updateQty: (index, qty) => dispatch({ type: 'UPDATE_QTY', index, qty }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        totalItems,
        totalPrice,
        totalEstampado,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────
export function formatPrice(clp: number): string {
  return '$' + clp.toLocaleString('es-CL');
}

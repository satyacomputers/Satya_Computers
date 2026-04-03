'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  originalPrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  cartOriginalTotal: number;
  cartDiscount: number;
  expiresAt: number | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // Load from local storage
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('satya_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        console.error("Failed to parse cart");
      }
    }
    const savedExpiry = localStorage.getItem('satya_cart_expiry');
    if (savedExpiry) {
      const exp = parseInt(savedExpiry, 10);
      if (Date.now() > exp) {
         setItems([]);
         localStorage.removeItem('satya_cart');
         localStorage.removeItem('satya_cart_expiry');
      } else {
         setExpiresAt(exp);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (items.length > 0) {
        localStorage.setItem('satya_cart', JSON.stringify(items));
        if (!expiresAt) {
           const newExp = Date.now() + 15 * 60 * 1000;
           setExpiresAt(newExp);
           localStorage.setItem('satya_cart_expiry', newExp.toString());
        }
      } else {
        localStorage.removeItem('satya_cart');
        localStorage.removeItem('satya_cart_expiry');
        setExpiresAt(null);
      }
    }
  }, [items, isMounted, expiresAt]);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      if (Date.now() > expiresAt) {
         clearCart();
         alert('PROTOCOL TIMEOUT: Your hardware reservation has expired to clear ledger space.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const FALLBACK_IMAGE = '/products/dell_laptop_premium.png';
    const image = (newItem.image && newItem.image.trim() !== '') ? newItem.image : FALLBACK_IMAGE;

    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.productId === newItem.productId);
      
      if (existingItem) {
        return currentItems.map(item => 
          item.productId === newItem.productId 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...currentItems, { ...newItem, image, id: Math.random().toString(36).substring(7) }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((currentItems) => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((currentItems) => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  const cartOriginalTotal = items.reduce((total, item) => total + ((item.originalPrice || (item.price + 2000)) * item.quantity), 0);
  const cartDiscount = cartOriginalTotal - cartTotal;

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
      cartOriginalTotal,
      cartDiscount,
      expiresAt
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

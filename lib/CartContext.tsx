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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('satya_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.productId === newItem.productId);
      
      if (existingItem) {
        return currentItems.map(item => 
          item.productId === newItem.productId 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...currentItems, { ...newItem, id: Math.random().toString(36).substring(7) }];
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
      cartDiscount
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

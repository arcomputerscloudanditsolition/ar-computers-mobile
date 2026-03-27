import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => { loadCart(); loadWishlist(); }, []);

  const loadCart = async () => {
    try { const s = await AsyncStorage.getItem('ar_cart'); if (s) setCartItems(JSON.parse(s)); } catch (e) {}
  };
  const saveCart = async (items) => {
    try { await AsyncStorage.setItem('ar_cart', JSON.stringify(items)); } catch (e) {}
  };
  const loadWishlist = async () => {
    try { const s = await AsyncStorage.getItem('ar_wishlist'); if (s) setWishlist(JSON.parse(s)); } catch (e) {}
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find(i => i.id === product.id);
    let newCart;
    if (existing) { newCart = cartItems.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i); }
    else { newCart = [...cartItems, { ...product, quantity }]; }
    setCartItems(newCart); saveCart(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = cartItems.filter(i => i.id !== id);
    setCartItems(newCart); saveCart(newCart);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) { removeFromCart(id); return; }
    const newCart = cartItems.map(i => i.id === id ? { ...i, quantity } : i);
    setCartItems(newCart); saveCart(newCart);
  };

  const clearCart = () => { setCartItems([]); saveCart([]); };

  const addToWishlist = (product) => {
    if (!wishlist.find(i => i.id === product.id)) {
      const w = [...wishlist, product]; setWishlist(w);
      AsyncStorage.setItem('ar_wishlist', JSON.stringify(w));
    }
  };

  const removeFromWishlist = (id) => {
    const w = wishlist.filter(i => i.id !== id); setWishlist(w);
    AsyncStorage.setItem('ar_wishlist', JSON.stringify(w));
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, wishlist, addToCart, removeFromCart, updateQuantity, clearCart, addToWishlist, removeFromWishlist, cartTotal, cartCount, isInWishlist: (id) => wishlist.some(i => i.id === id) }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

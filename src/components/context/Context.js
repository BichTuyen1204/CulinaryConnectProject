import React, { createContext, useState, useEffect } from 'react';
import CartService from '../../api/CartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  const updateCartCount = (items) => {
    setCartCount(items.length);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (jwtToken) {
        try {
          const response = await CartService.getAllInCart();
          if (Array.isArray(response)) {
            setCartItems(response);
            updateCartCount(response);
          }
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
          setCartItems([]);
          setCartCount(0);
        }
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    };
    fetchCartItems();
  }, [jwtToken]);

  const addToCart = async (product) => {
    if (!jwtToken) {
      window.location.href = "/sign_in";
      return;
    }
    try {
      const response = await CartService.addToCart(product.id, 1);
      if (response && response.product) {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(item => item.product.id === product.id);
          if (existingItem) {
            return prevItems.map(item =>
              item.product.id === product.id
                ? { ...item, amount: item.amount + 1 }
                : item
            );
          } else {
            const updatedItems = [...prevItems, { product: response.product, amount: 1 }];
            updateCartCount(updatedItems);
            return updatedItems;
          }
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!jwtToken) return;
    try {
      const response = await CartService.deleteCart(productId);
      if (response === true) {
        const updatedItems = cartItems.filter(item => item.product.id !== productId);
        setCartItems(updatedItems);
        updateCartCount(updatedItems);
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };


  useEffect(() => {
    updateCartCount(cartItems);
  }, [cartItems]);

  const updateCart = async (productId, quantity) => {
    if (!jwtToken) return;
    try {
      await CartService.updateCart(productId, quantity);
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, amount: quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart, updateCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

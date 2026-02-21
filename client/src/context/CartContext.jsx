import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  // ✅ Load cart from localStorage on start
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  const addToCart = (item, quantity) => {

    setCart(prevCart => {

      const existing = prevCart.find(i => i.id === item.id);

      if (existing) {
        return prevCart.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        return [
          ...prevCart,
          { ...item, quantity }
        ];
      }

    });

  };


  const removeFromCart = (id) => {
    setCart(prevCart =>
      prevCart.filter(item => item.id !== id)
    );
  };


  const clearCart = () => {
    setCart([]);
  };


  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );

}

export const useCart = () => useContext(CartContext);
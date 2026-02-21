import { useCart } from "../context/CartContext";
import { useState } from "react";
import API from "../services/api";
import "./cart.css";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      setError("");
      setMessage("");

      const orderData = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        }))
      };

      await API.post("/orders/place", orderData);

      setMessage("Order placed successfully 🎉");
      clearCart();

    } catch (err) {
      setError(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="cart-container">

      <h2 className="cart-title">Your Cart</h2>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">

                <div>
                  <h4>{item.name}</h4>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>
            ))}
          </div>

          <div className="cart-footer">
            <h3>Total: ₹{total}</h3>

            <button
              className="order-btn"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default Cart;
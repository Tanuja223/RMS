import { useEffect, useState } from "react";
import axios from "axios";
import "./waiter.css";

function WaiterDashboard() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  // 🔥 FETCH ORDERS FUNCTION
  const fetchOrders = () => {
    axios
      .get("http://localhost:4300/api/orders/waiter", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load orders");
      });
  };
const handleCheckout = (orderId) => {
  const token = localStorage.getItem("token");

  axios
    .post(
      `http://localhost:4300/api/orders/${orderId}/checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(res => {
      alert(`✅ Paid ₹${res.data.totalAmount}`);
      fetchOrders(); // refresh list
    })
    .catch(err => {
      console.error(err);
      alert("Checkout failed");
    });
};

  // 🔹 INITIAL LOAD
  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 AUTO REFRESH EVERY 5 SECONDS
  useEffect(() => {
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="waiter-page">
      <h2>🍽️ Active Orders</h2>

      {orders.length === 0 && <p>No active orders</p>}

      {orders.map(order => (
        <div className="order-card" key={order.order_id}>
          <div><strong>Order ID:</strong> #{order.order_id}</div>
          <div><strong>Total:</strong> ₹{order.total_price}</div>

          <div className={`status ${order.status}`}>
            {order.status === "pending" && "🕒 Pending"}
            {order.status === "preparing" && "👨‍🍳 Preparing"}
            {order.status === "served" && "✅ Ready to Serve"}
          </div>

          {order.status === "served" && (
            <button
  className="checkout-btn"
  onClick={() => handleCheckout(order.order_id)}
>
  Checkout
</button>

          )}
        </div>
      ))}
    </div>
  );
}

export default WaiterDashboard;

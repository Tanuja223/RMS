// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/orders/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setOrders(res.data))
      .catch(() => alert("Failed to load orders"));
  }, []);

  return (
    <div className="orders-page">
      <h2>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
  <div className="order-card" key={order.order_id}>
    <p><b>Order ID:</b> #{order.order_id}</p>

    <div>
      <b>Items:</b>
      {order.items.map((item, index) => (
        <div key={index}>
          {item.name} × {item.quantity} — ₹{item.price * item.quantity}
        </div>
      ))}
    </div>

    <p><b>Total:</b> ₹{order.total_price}</p>

    <span className={`status ${order.status}`}>
      {order.status === "pending" && "🕒 Pending"}
      {order.status === "preparing" && "👨‍🍳 Preparing"}
      {order.status === "served" && "✅ Served"}
      {order.status === "paid" && "💰 Paid"}
    </span>
  </div>
))}

    </div>
  );
}

export default Orders;

import { useEffect, useState } from "react";
import axios from "axios";
import "./chef.css";

function ChefDashboard() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchOrders = () => {
    axios
      .get("http://localhost:4300/api/orders/chef", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load chef orders");
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

 const updateStatus = (orderId, status) => {

  console.log("Updating:", orderId, status);

  axios.patch(
    `http://localhost:4300/api/orders/${orderId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(res => {
    console.log("Update success:", res.data);
    fetchOrders();
  })
  .catch(err => {
    console.error("Update error:", err);
  });
};


  return (
    <div className="chef-page">
      <h2>👨‍🍳 Kitchen Orders</h2>

      {orders.length === 0 && <p>No active orders</p>}

      {orders.map(order => (
        <div className="chef-card" key={order.order_id}>
          <div><strong>Order #{order.order_id}</strong></div>
          <div>{order.item_name} × {order.quantity}</div>
          <div>Status: {order.status}</div>

          {order.status === "pending" && (
            <button
              onClick={() => updateStatus(order.order_id, "preparing")}
            >
              Start Preparing
            </button>
          )}

          {order.status === "preparing" && (
            <button
              onClick={() => updateStatus(order.order_id, "served")}
            >
              Mark as Served
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChefDashboard;

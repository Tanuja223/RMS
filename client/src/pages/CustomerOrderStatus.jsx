import { useEffect, useState } from "react";
import axios from "axios";

function CustomerOrderStatus() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStatus = () => {
      axios.get("http://localhost:4300/api/orders/customer", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // 🔄 auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return <h3 style={{ textAlign: "center" }}>No active orders</h3>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>🧾 Your Order</h2>
      <p><strong>Order ID:</strong> #{order.order_id}</p>
      <p><strong>Total:</strong> ₹{order.total_price}</p>

      <h3>
        Status:{" "}
        {order.status === "pending" && "🕒 Pending"}
        {order.status === "preparing" && "👨‍🍳 Preparing"}
        {order.status === "served" && "✅ Ready to Serve"}
      </h3>
    </div>
  );
}

export default CustomerOrderStatus;

import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "./customerOrder.css";

const categoryLabels = {
  veg: "Veg Starters",
  nonveg_starters: "Non-Veg Starters",
  main_veg: "Veg Main Items",
  nonveg: "Non-Veg Main Items",
  desserts: "Desserts"
};

function CustomerOrder() {

  const { category } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  // ✅ NEW STATES
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* 🔒 CUSTOMER ONLY */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "customer") {
      navigate("/login");
    }
  }, [navigate]);

  /* 📦 FETCH MENU */
  useEffect(() => {
    axios
      .get(`http://localhost:4300/api/menuitems/${category}`)
      .then(res => {

        setItems(res.data);

        const qty = {};
        res.data.forEach(item => {
          qty[item.id] = 0;
        });

        setQuantities(qty);

      })
      .catch(err => {
        setError("Failed to load menu items");
      });

  }, [category]);

  /* ➕➖ QUANTITY */
  const increaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  const decreaseQty = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0
    }));
  };

  /* 🛒 ADD TO CART */
  const handleAddToCart = (item) => {

    const qty = quantities[item.id];

    if (qty === 0) {
      setError("Please select quantity");
      return;
    }

    addToCart(item, qty);

    // ✅ SHOW MESSAGE
    setMessage(`${item.name} added to cart`);
    setError("");

    // auto hide after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);

  };

  return (
    <div className="order-page">

      <h2 className="order-title">
        {categoryLabels[category] || "Menu Items"}
      </h2>

      {/* ✅ SUCCESS MESSAGE */}
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* ✅ ERROR MESSAGE */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* GO TO CART */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/cart" className="place-order-btn">
          Go to Cart 🛒 
        </Link>
      </div>

      <div className="order-list">

        {items.map(item => {

          const qty = quantities[item.id];
          const rowTotal = qty * item.price;

          return (
            <div className="order-row" key={item.id}>

              <div className="item-name">
                {item.name}
              </div>

              <div className="item-price">
                ₹{item.price}
              </div>

              <div className="qty-controls">

                <button onClick={() => decreaseQty(item.id)}>
                  −
                </button>

                <span>{qty}</span>

                <button onClick={() => increaseQty(item.id)}>
                  +
                </button>

              </div>

              <div className="total-action">

                <span className="row-total">
                  ₹{rowTotal}
                </span>

                <button
                  className="add-btn"
                  disabled={qty === 0}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>

              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
}

export default CustomerOrder;
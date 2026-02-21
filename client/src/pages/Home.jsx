import React, { useState } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const name = localStorage.getItem("name") || "Customer";
  const email = localStorage.getItem("email") || "";
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/logout");
  };

  return (
    <div>
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="nav-container">
          <h1 className="logo">Serve Smart</h1>

          <div
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li>
              <a href="#hero" onClick={() => setMenuOpen(false)}>Home</a>
            </li>

            <li>
              <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
            </li>

            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            </li>

            {/* 🛒 CART */}
            <li>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                🛒 Cart {cartCount > 0 && <span>({cartCount})</span>}
              </Link>
            </li>

           {isLoggedIn ? (
  <li className="profile-container">

    {/* Avatar button */}
    <button
      className="avatar-btn"
      onClick={() => setProfileOpen(!profileOpen)}
    >
      {name.charAt(0).toUpperCase()}
    </button>

    {/* Dropdown */}
    {profileOpen && (
      <div className="profile-dropdown">

        <p><b>{name}</b></p>
        {email && <p>{email}</p>}

       <Link
  to="/orders"
  className="orders-btn"
  onClick={() => setProfileOpen(false)}
>
My Orders
</Link>


        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>
    )}

  </li>
) : (

              <>
                <li>
                  <Link
                    className="auth-btn"
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    className="auth-btn"
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="hero" className="hero">
        <div className="hero-text">
          <h2>Delicious Food</h2>
          <p>Order fresh food directly from your table</p>
        </div>
      </section>

      {/* ===== MENU ===== */}
      <section id="menu" className="menu-section">
        <h2 className="section-title">Our Menu</h2>

        <div className="menu-cards">
          <div className="menu-card">
            <Link to="/order/veg">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK9AipkI1X_82O6ZeY_u6GvKjZYrpHmVrNcQ&s" alt="Veg" />
              <h3>Veg Starters</h3>
            </Link>
          </div>

          <div className="menu-card">
            <Link to="/order/nonveg_starters">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmEIQYVBoHKeq-n_GPa6UfiLP9Gws9EIxTIQ&s" alt="Non Veg" />
              <h3>Non-Veg Starters</h3>
            </Link>
          </div>

          <div className="menu-card">
            <Link to="/order/main_veg">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtg5mIsKoCIOAPR-LwNk001kEdZmaVRu1chA&s" alt="Main Veg" />
              <h3>Main Course (Veg)</h3>
            </Link>
          </div>

          <div className="menu-card">
            <Link to="/order/nonveg">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0qdyMwcMmfnjU0qQG2f15UCGW9DqMp7N7Hw&s" alt="Main Non Veg" />
              <h3>Main Course (Non-Veg)</h3>
            </Link>
          </div>

          <div className="menu-card">
            <Link to="/order/desserts">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpR7Ebfhvn1Bdu6TlQd_hrgExg2lbDDSYlQ&s" alt="Desserts" />
              <h3>Desserts</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
          Location: Hyderabad <br />
          Hi-Tech City <br />
          Contact: 9854626562
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>Thank You | Visit Again</p>
      </footer>
    </div>
  );
}

export default Home;

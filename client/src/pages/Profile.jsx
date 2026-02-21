import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile() {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "user@email.com";

  const firstLetter = name.charAt(0).toUpperCase();

  const logout = () => {
    localStorage.clear();
    navigate("/logout");
  };

  return (
   <div className="profile-wrapper">

  {/* avatar button */}
  <button
  className="avatar-btn"
  onClick={() => {
    console.log("clicked");   // debug
    setOpen(prev => !prev);
  }}
>
  {firstLetter}
</button>



      {/* Dropdown opens when clicking T */}
      {open && (
        <div className="profile-dropdown">

          <div className="profile-header">
            <div className="avatar large">
              {firstLetter}
            </div>

            <div>

              <h3>{name}</h3>
              <p>{email}</p>
            </div>
          </div>

          <hr />

          {/* ✅ THIS WILL SHOW */}
          <button
            className="orders-btn"
            onClick={() => navigate("/orders")}
          >
          My Orders
          </button>

          {/* Logout */}
          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
}

export default Profile;

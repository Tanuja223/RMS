import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./logout.css";

function Logout() {

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();

    setTimeout(() => {
      navigate("/");
    }, 2000);

  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h2>You have been logged out</h2>
        <p>Redirecting to home page...</p>
      </div>
    </div>
  );
}

export default Logout;

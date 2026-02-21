import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CustomerOrder from "./pages/CustomerOrder";
import WaiterDashboard from "./pages/Waiterdashboard";
import ChefDashboard from "./pages/Chefdashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import CustomerOrderStatus from "./pages/CustomerOrderStatus";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Logout from "./pages/Logout";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<Home />} />

        {/* CUSTOMER ORDER PAGE */}
        <Route path="/order/:category" element={<CustomerOrder />} />

        {/* CART PAGE */}
        <Route path="/cart" element={<Cart />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* CUSTOMER ORDER STATUS */}
        <Route path="/order-status" element={<CustomerOrderStatus />} />
        <Route path="/orders" element={<Orders />} />

        {/* ✅ CUSTOMER PROFILE (PROTECTED) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* WAITER DASHBOARD */}
        <Route
          path="/waiter"
          element={
            <ProtectedRoute allowedRoles={["waiter"]}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* CHEF DASHBOARD */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={["chef"]}>
              <ChefDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

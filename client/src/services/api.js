import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4300/api"
});

// ✅ ADD THIS BLOCK (VERY IMPORTANT)
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

// 🔥 AUTO LOGOUT ON TOKEN EXPIRY
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;

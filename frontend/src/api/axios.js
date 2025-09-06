import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api",
  withCredentials: true, // important for auth cookies
  timeout: 30000,
});

export default api;

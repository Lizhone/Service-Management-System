import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000/api",
});

client.interceptors.request.use((config) => {
  // Admin login token
  const adminToken = localStorage.getItem("token");

  // Customer login token
  const customerToken = localStorage.getItem("customerToken");

  // Prefer admin token if both exist
  const token = adminToken || customerToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;

// frontend/src/api/client.js
import axios from "axios";

// 1) Where is our API? (use env vars if present, else localhost)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000";

// One Axios instance used everywhere
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // optional — you can remove if we want
});

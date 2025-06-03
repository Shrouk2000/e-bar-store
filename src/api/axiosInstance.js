import axios from "axios";

const token = localStorage.getItem("session_token") || (() => {
  const newToken = [...Array(64)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
  localStorage.setItem("session_token", newToken);
  return newToken;
})();

const api = axios.create({
  baseURL: "https://dev.backend-api.goldady.com/user-api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request's Authorization header
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api, token };

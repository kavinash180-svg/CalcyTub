import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("calcytub_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setToken = (token) => {
  if (token) localStorage.setItem("calcytub_token", token);
  else localStorage.removeItem("calcytub_token");
};

export const getToken = () => localStorage.getItem("calcytub_token");

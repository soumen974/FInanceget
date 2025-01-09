import axios from "axios";
const API_link=import.meta.env.VITE_API_URL;
export const api = axios.create({
  baseURL: API_link,
  withCredentials: true
});

 
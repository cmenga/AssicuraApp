import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:8001/auth",
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
});

import axios from "axios";
import { API_URL } from "./config/service-path";

const authClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default authClient;

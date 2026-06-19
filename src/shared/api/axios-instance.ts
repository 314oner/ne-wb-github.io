import axios from "axios";
import { API_URL } from "./config/service-path";

const publicClient = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export default publicClient;

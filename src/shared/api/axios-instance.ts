import axios from "axios";
import { STAGE } from "./config/current-stage";
import { API_URL } from "./config/service-path";

const api = axios.create({
  withCredentials: STAGE === "development" ? false : true,
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

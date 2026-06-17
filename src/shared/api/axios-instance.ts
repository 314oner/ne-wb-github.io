import axios from "axios";
import { STAGE } from "./config/current-stage";

const api = axios.create({
  withCredentials: STAGE === "development" ? false : true,
  baseURL: "https://nest-proto-hub-backend-dev-9.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

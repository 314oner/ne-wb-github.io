import axios from "axios";

const authClient = axios.create({
  baseURL: "https://nest-proto-hub-backend-dev-9.vercel.app",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default authClient;

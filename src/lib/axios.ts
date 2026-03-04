import axios from "axios";

/**
 * Client-side axios instance.
 * - withCredentials: true  → automatically sends cookies (replaces { credentials: "include" })
 * - baseURL is intentionally left as the relative root so relative paths like
 *   "/api/auth/login" work in the browser without extra config.
 */
const apiClient = axios.create({
  withCredentials: true, // Send cookies on every request (equivalent to credentials: "include")
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

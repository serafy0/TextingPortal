import axios from "axios";
import { BasicNotification } from "../Helpers/NotificationHelper";

const apiClient = axios.create({
  baseURL: "https://localhost:44363/api/",
});

// Request interceptor: attach bearer token (from localStorage) to every request except login/register
apiClient.interceptors.request.use(
  (config: any) => {
    if (
      config.url &&
      !config.url.includes("Auth/login") &&
      !config.url.includes("Auth/register")
    ) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      } else {
        // Token not found: notify and redirect to login
        BasicNotification("Unauthorized: Please login");
        window.location.href = "/login";
        return Promise.reject(new Error("No token available"));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if a 401 error is returned, notify and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401&&localStorage.getItem("token")) {
      BasicNotification("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }else if(error.response && error.response.status === 403){

      BasicNotification("Something went wrong.");
      window.location.href = "/dashboard";

    }
    return Promise.reject(error);
  }
);

export default apiClient;

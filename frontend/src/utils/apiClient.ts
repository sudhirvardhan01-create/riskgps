import axios from "axios";
import { showToast } from "@/utils/toastManager";

let loaderCallbacks: { show: () => void; hide: () => void } | null = null;

export const registerLoader = (show: () => void, hide: () => void) => {
  loaderCallbacks = { show, hide };
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// ✅ Request interceptor — good place for auth tokens later
apiClient.interceptors.request.use(
  (config) => {
    // Example: config.headers.Authorization = `Bearer ${token}`;
    loaderCallbacks?.show();
    return config;
  },
  (error) => {
    loaderCallbacks?.hide();
    return Promise.reject(error);
  }
);

// ✅ Response interceptor — handle success + errors globally
apiClient.interceptors.response.use(
  (response) => {
    loaderCallbacks?.hide();
    // Show success toast automatically for POST/PUT/DELETE
    const method = response.config.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method ?? "")) {
      const endpoint = response.config.url?.split("/").pop();
      const formattedName =
        endpoint?.replace(/-/g, " ").replace(/\?.*/, "") ?? "Operation";
      showToast(`${formattedName} completed successfully`, "success");
    }
    return response;
  },
  (error) => {
    loaderCallbacks?.hide();
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) message = "Unauthorized — please log in again.";
      else if (status === 404) message = "Resource not found.";
      else if (status >= 500) message = "Server error — please try later.";
      else if (data?.message) message = data.message;
    } else if (error.request) {
      message = "No response from the server. Check your connection.";
    }

    // 🔥 Automatically show error toast
    showToast(message, "error");
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export default apiClient;

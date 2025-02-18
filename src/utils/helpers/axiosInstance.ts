/* eslint-disable */
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { Store } from "redux"; // Ensure you have redux types installed
import ENVConfig from "../../config/config";

// Define the type for the Redux store
let store: Store<any>;

// Function to inject the store
export const injectStore = (_store: Store<any>): void => {
  store = _store;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: ENVConfig.baseURL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.user?.token;
    const userId = state.user?.id; // Assuming userId is stored in the Redux state
    if (token && userId) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["X-User-Id"] = userId; // Add user ID to custom header
    }

    // Track the request in New Relic
    if (window.NREUM) {
      window.NREUM.addPageAction("apiRequest", {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Track the response in New Relic
    if (window.NREUM) {
      window.NREUM.addPageAction("apiResponse", {
        url: response.config.url,
        status: response.status,
        responseTime: response.headers["x-response-time"], // Or use another metric
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle error and track it
    if (window.NREUM) {
      window.NREUM.addPageAction("apiError", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    if (error.response && error.response.status === 401) {
      // store.dispatch(logout());
      // window.location.reload();
      return Promise.reject(error.response);
    } else {
      return Promise.reject(error.response);
    }
  }
);

export default axiosInstance;

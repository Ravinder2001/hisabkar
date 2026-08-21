/* eslint-disable */
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { Store } from "redux"; // Ensure you have redux types installed
import ENVConfig from "../../config/config";
import CONSTANTS from "../constant/Constant";
import { setAccessToken, setUserLoggedOut } from "../../store/features/userSlice";

// Define the type for the Redux store
let store: Store<any>;

// Function to inject the store
export const injectStore = (_store: Store<any>): void => {
  store = _store;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: ENVConfig.baseURL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

// Plain, un-intercepted client for the refresh call itself — reusing
// axiosInstance here would recurse back into this same 401 handler if the
// refresh call ever itself returns 401.
const refreshClient = axios.create({
  baseURL: ENVConfig.baseURL,
  withCredentials: true,
});

// Shared across concurrent 401s so a burst of requests triggers exactly one
// refresh call, not one per request.
let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post(CONSTANTS.API_ROUTES.REFRESH_TOKEN)
      .then((res) => {
        const newToken = res.data?.data?.token;
        if (!newToken) return false;
        store.dispatch(setAccessToken(newToken));
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const forceLogout = () => {
  store.dispatch(setUserLoggedOut());
  window.location.href = "/";
};

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
  async (error: AxiosError) => {
    // Handle error and track it
    if (window.NREUM) {
      window.NREUM.addPageAction("apiError", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    if (error.response && error.response.status === 401) {
      const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

      // Access token expired — try one silent refresh (via the httpOnly
      // cookie, through refreshClient so a 401 here can't recurse back into
      // this same interceptor) and transparently replay the original
      // request. Skip anything already retried once — the refresh token
      // itself must be invalid/revoked at that point.
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return axiosInstance(originalRequest);
        }
      }

      forceLogout();
      return Promise.reject(error.response);
    } else {
      // Network-level failures (server unreachable, CORS, DNS, offline) never get an
      // error.response — reject with the original error instead of undefined, otherwise
      // callers crash reading properties off `undefined` (see useAPIFetch's catch block).
      return Promise.reject(error.response ?? error);
    }
  }
);

export default axiosInstance;

import axios, { AxiosInstance } from "axios";
import config from "../config/config";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("whatsToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response && error.response.status == 401) {
      //handle logout
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

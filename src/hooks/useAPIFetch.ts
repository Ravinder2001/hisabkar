/* eslint-disable */
import { useState, useCallback } from "react";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../utils/helpers/axiosInstance";
import showToast from "../utils/helpers/toastHelper";

const useApiFetch = (initialUrl: string, initialOptions?: AxiosRequestConfig) => {
  const [response, setResponse] = useState<{
    data?: any;
    error?: string;
    count?: number;
    success?: number;
    message?: string;
    [key: string]: any;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Memoize fetchData to prevent recreation on every render
  const fetchData = useCallback(
    async (url = initialUrl, options = initialOptions) => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance(url, {
          ...options, // Spread existing options
          withCredentials: true, // Include credentials (cookies, authorization headers)
        });
        setResponse({
          ...data,
        });
      } catch (error: any) {
        const errorMessage = error?.data?.message || error.response?.data?.message || "Something went wrong";
        showToast(errorMessage, "error");
        if (error.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        setResponse({ error: errorMessage, success: 0 });
      } finally {
        setIsLoading(false);
      }
    },
    [initialUrl, initialOptions] // Dependencies that, if changed, recreate fetchData
  );

  return { response, isLoading, fetchData };
};

export default useApiFetch;

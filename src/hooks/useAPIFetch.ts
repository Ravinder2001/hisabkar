/* eslint-disable  */
import { useState } from "react";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../utils/helpers/axiosInstance";
import showToast from "../utils/helpers/toastHelper";
import useDecryption from "./useDecryption";
import ENVConfig from "../config/config";

const useApiFetch = (initialUrl: string, initialOptions?: AxiosRequestConfig) => {
  const [response, setResponse] = useState<{
    data?: any;
    error?: string;
    count?: number;
    success?: number;
    message?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (url = initialUrl, options = initialOptions) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance(url, {
        ...options, // Spread existing options
        withCredentials: true, // Include credentials (cookies, authorization headers)
      });
      let decryptedData = data.data;

      if (ENVConfig.enviroment === "prod" && data.data) {
        decryptedData = useDecryption(data.data);
      }
      setResponse({
        data: decryptedData,
        message: data.message,
        success: data.success,
      });
    } catch (error: any) {
      const errorMessage = error?.data?.message || error.response?.data?.message || "Something went wrong";
      showToast(errorMessage, "error");
      if (error.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      setResponse({ error: errorMessage, success: error?.data?.success || error.response?.data?.success });
    } finally {
      setIsLoading(false);
    }
  };

  return { response, isLoading, fetchData };
};

export default useApiFetch;

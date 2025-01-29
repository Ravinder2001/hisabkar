/* eslint-disable  */
import { useState } from "react";
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
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (url = initialUrl, options = initialOptions) => {
    setIsLoading(true);
    try {
      console.log(url, options);
      const { data } = await axiosInstance.post(url, options?.data, options);
      setResponse({
        data: data.data,
        message: data.message,
        success: data.success,
      });
    } catch (error: any) {
      const errorMessage = error?.data?.message || error.response?.data?.message || "Something went wrong";
      showToast(errorMessage, "error");
      setResponse({ error: errorMessage, success: error?.data?.success || error.response?.data?.success });
    } finally {
      setIsLoading(false);
    }
  };

  return { response, isLoading, fetchData };
};

export default useApiFetch;

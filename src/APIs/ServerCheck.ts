import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const ServerCheck = async () => {
  try {
    const response = await axiosInstance.get(`/server`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default ServerCheck;

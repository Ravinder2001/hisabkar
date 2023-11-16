import { message } from "antd";
import axiosInstance from "../utils/AxiosInstance";
import { Bad_Request, Unauthorized, localStorageKey, request_succesfully } from "../utils/Constants";

const UsernameExists = async (username: string) => {
  try {
    const response = await axiosInstance.get(`/isUsernameExists/${username}`);
    if (response.status === request_succesfully) {
      return response.data;
    }
  } catch (error: any) {
    if (error.response.status === Bad_Request) {
      message.error(error.response.data.message);
    }
    if (error.response.status === Unauthorized) {
      message.error(error.response.data.message);
      localStorage.removeItem(localStorageKey);
      window.location.reload();
    }
  }
};
export default UsernameExists;

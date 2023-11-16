import { message } from "antd";
import axiosInstance from "../utils/AxiosInstance";
import { Bad_Request, Unauthorized, localStorageKey, request_succesfully } from "../utils/Constants";

const Login = async (props: { username: string; pin: string }) => {
  try {
    const response = await axiosInstance.post(`/login`, props);
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
export default Login;

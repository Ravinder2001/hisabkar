import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const LoginUser = async (props: string) => {
  try {
    const response = await axiosInstance.post(`/login`, { token: props });
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default LoginUser;

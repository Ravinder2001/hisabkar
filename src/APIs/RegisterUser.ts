import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants"
type RegisterUserProps = {
  name: string;
  email: string;
  image: string;
};

const RegisterUser = async (props: RegisterUserProps) => {
  try {
    const response = await axiosInstance.post(`/register`, props);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default RegisterUser;

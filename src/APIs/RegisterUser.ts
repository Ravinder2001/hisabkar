import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants"


const RegisterUser = async (props: string) => {
  try {
    const response = await axiosInstance.post(`/register/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default RegisterUser;

import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const GetUniquePairsNames = async (props: string) => {
  try {
    const response = await axiosInstance.get(`/pairs/getUniquePairsNames/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default GetUniquePairsNames;

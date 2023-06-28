import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const GetPairsByGroupId = async (props: string) => {
  try {
    const response = await axiosInstance.get(`/pairs/getPairs/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default GetPairsByGroupId;

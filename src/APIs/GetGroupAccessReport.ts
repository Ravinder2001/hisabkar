import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const GetGroupAccessReport = async (props: string) => {
  try {
    const response = await axiosInstance.get(`/group/AccessReport/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default GetGroupAccessReport;

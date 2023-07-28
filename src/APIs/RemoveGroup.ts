import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const RemoveGroup = async (props: string) => {
  try {
    const response = await axiosInstance.delete(`/group/delete/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default RemoveGroup;

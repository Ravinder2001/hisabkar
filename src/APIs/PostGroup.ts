import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const PostGroup = async (props: object) => {
  try {
    const response = await axiosInstance.post(`/group/add`, props);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default PostGroup;

import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const PostPairs = async (group_id: string, member_list: string[]) => {
  try {
    const response = await axiosInstance.post(
      `/pairs/addPairs/${group_id}`,
      member_list
    );
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default PostPairs;

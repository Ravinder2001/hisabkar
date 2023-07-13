import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";
type GroupType = {
  group_id: string;
  email: string;
  edit: boolean;
};
const PostGroupRelation = async (props: GroupType) => {
  try {
    const response = await axiosInstance.post(
      `/group/addRelation`,
      props
    );
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default PostGroupRelation;

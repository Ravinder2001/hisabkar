import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const GetGraphByUserId = async (props: {
  user_id: string|null;
  guestUser: boolean;
}) => {
  try {
    if (!props.guestUser) {
      const response = await axiosInstance.get(`/graph/graphData/user/${props.user_id}`);
      if (response.status === request_succesfully) {
        return response?.data;
      }
    } else {
      const response = await axiosInstance.get(
        `/graph/graphData/user/${props.user_id}/sharing`
      );
      if (response.status === request_succesfully) {
        return response?.data;
      }
    }
  } catch (error) {
    return error;
  }
};

export default GetGraphByUserId;

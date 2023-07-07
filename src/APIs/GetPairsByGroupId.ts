import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const GetPairsByGroupId = async (props: {
  group_id: string;
  guestUser: boolean;
}) => {
  try {
    if (!props.guestUser) {
      const response = await axiosInstance.get(
        `/pairs/getPairs/${props.group_id}`
      );
      if (response.status === request_succesfully) {
        return response?.data;
      }
    } else {
      const response = await axiosInstance.get(
        `/pairs/getPairs/${props.group_id}/sharing`
      );
      if (response.status === request_succesfully) {
        return response?.data;
      }
    }
  } catch (error) {
    return error;
  }
};

export default GetPairsByGroupId;
import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

type propsType = { group_id: string; guestUser: boolean };
const GetGroupById = async (props: propsType) => {
  try {
    if (!props.guestUser) {
      const response = await axiosInstance.get(`/group/${props.group_id}`);
      if (response.status === request_succesfully) {
        return response?.data;
      }
    } else {
      const response = await axiosInstance.get(`/group/${props.group_id}/sharing`);
      if (response.status === request_succesfully) {
        return response?.data;
      }
    }
  } catch (error) {
    return error;
  }
};

export default GetGroupById;

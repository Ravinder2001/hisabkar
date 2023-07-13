import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

type propsType = { group_id: string; guestUser: boolean; user: string | null };
const GetGroupById = async (props: propsType) => {
  try {
    if (!props.guestUser) {
      const response = await axiosInstance.get(`/group/${props.group_id}`);
      if (response.status === request_succesfully) {
        return response?.data;
      }
    } else if (props.guestUser && props.user) {
      const response = await axiosInstance.get(
        `/group/${props.group_id}/${props.user}/sharing`
      );
      if (response.status === request_succesfully) {
        return response?.data;
      }
    }
  } catch (error) {
    return error;
  }
};

export default GetGroupById;

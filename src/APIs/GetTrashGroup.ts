import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

// type propsType = { group_id: string; guestUser: boolean; user: string | null };
const GetTrashGroup = async (props: string) => {
  try {
    const response = await axiosInstance.get(`/group/trash/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default GetTrashGroup;

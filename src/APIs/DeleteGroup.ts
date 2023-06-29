import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const DeleteGroup = async (props: { group_id: string; status: boolean }) => {
  try {
    const response = await axiosInstance.put(
      `/group/update/${props.group_id}`,
      { status: props.status }
    );
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default DeleteGroup;

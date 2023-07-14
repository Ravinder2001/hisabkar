import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const DeleteRelation = async (props: number) => {
  try {
    const response = await axiosInstance.delete(`/group/deleteRelation/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default DeleteRelation;

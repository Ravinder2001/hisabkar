import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

export type PutPairsType = {
  id: number;
  status: boolean;
};

const PutRelation = async (props: PutPairsType) => {
  try {
    const response = await axiosInstance.put(
      `/group/updateRelation/${props.id}/${props.status}`
    );
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default PutRelation;

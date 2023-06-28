import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

export type PutPairsType = {
  amount: number;
  paidBy: string;
  group_id: string;
  members: string[];
};

const PutPairs = async (props: PutPairsType) => {
  try {
    const response = await axiosInstance.put(
      `/pairs/updatePairs/${props.group_id}`,
      {
        paidby: props.paidBy,
        amount: props.amount,
        members: props.members,
      }
    );
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default PutPairs;

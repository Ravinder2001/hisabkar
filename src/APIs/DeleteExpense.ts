import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const DeleteExpense = async (props: number) => {
  try {
    const response = await axiosInstance.delete(`/expense/delete/${props}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default DeleteExpense;

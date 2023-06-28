import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const PostExpense = async (props: object) => {
  try {
    const response = await axiosInstance.post(`/expense/addExpense`, props);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default PostExpense;

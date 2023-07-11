import axiosInstance from "../utils/AxiosInstance";
import { request_succesfully } from "../utils/Constants";

const GetWhatsappData = async (props: {
  group_id: string;
  user_id: string;
}) => {
  try {
    const response = await axiosInstance.get(`/getWhatsappData/${props.group_id}/${props.user_id}`);
    if (response.status === request_succesfully) {
      return response?.data;
    }
  } catch (error) {
    return error;
  }
};

export default GetWhatsappData;

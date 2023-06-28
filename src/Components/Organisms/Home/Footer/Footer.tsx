import React from "react";
import Button1 from "../../../Atoms/Button/Button1/Button1";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import PostGroup from "../../../../APIs/PostGroup";
import moment from "moment";
import { request_succesfully } from "../../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast } from "../../../../utils/ToastStyle";
import PostPairs from "../../../../APIs/PostPairs";

type FooterProps = {
  GroupName: string;
  MemberList: { id: string; name: string }[];
};

function Footer(props: FooterProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user_id = useSelector((state: RootState) => state.UserSlice.id);

  const SubmitGroup = async () => {
    let data = {
      user_id: user_id,
      name: props.GroupName,
      timestamp: moment(),
      members: props.MemberList,
    };
    const res = await PostGroup(data);
    if (res.status == request_succesfully) {
      CreatePairs(res.data.group_id, res.data.members);
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };

  const CreatePairs = async (e: string, members: string[]) => {
    const res = await PostPairs(e, members);
    if (res.status == request_succesfully) {
      navigate(`/${e}`);
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };

  const handleSubmit = () => {
    SubmitGroup();
  };
  return (
    <div className={styles.container} onClick={handleSubmit}>
      <Button1 />
    </div>
  );
}

export default Footer;

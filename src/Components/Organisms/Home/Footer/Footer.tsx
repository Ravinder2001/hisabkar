import React, { Dispatch, SetStateAction } from "react";
import Button1 from "../../../Atoms/Button/Button1/Button1";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import PostGroup from "../../../../APIs/PostGroup";
import moment from "moment";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast } from "../../../../utils/ToastStyle";
import PostPairs from "../../../../APIs/PostPairs";
import { Logout } from "../../../../store/slices/UserSlice";

type FooterProps = {
  setIsSubmit: Dispatch<SetStateAction<boolean>>;
  Error: { name: boolean; members: boolean };
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
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };

  const handleSubmit = () => {
    props.setIsSubmit(true);
    if (!props.Error.name && !props.Error.members) {
      SubmitGroup();
    }
  };
  return (
    <div className={styles.container} onClick={handleSubmit}>
      <Button1 />
    </div>
  );
}

export default Footer;

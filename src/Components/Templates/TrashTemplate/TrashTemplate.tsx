import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import GetTrashGroup from "../../../APIs/GetTrashGroup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../../store/slices/UserSlice";
import { message } from "antd";
import moment from "moment";
import DeleteGroup from "../../../APIs/DeleteGroup";
import RemoveGroup from "../../../APIs/RemoveGroup";
type groupType = {
  id: string;
  name: string;
  timestamp: string;
};
function TrashTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Id = useSelector((state: RootState) => state.UserSlice.id);

  const [TrashGroup, SetTrashGroup] = useState<groupType[]>([]);
  console.log("🚀  file: TrashTemplate.tsx:25  TrashGroup:", TrashGroup);
  const [loading, setLoading] = useState(false);

  const FetchGroup = async () => {
    setLoading(true);
    const res = await GetTrashGroup(Id);
    if (res.status == request_succesfully) {
      SetTrashGroup(res.data);
      setLoading(false);
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      setLoading(false);
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };
  const RecoverGroup = async (id: string) => {
    const res = await DeleteGroup({
      group_id: id,
      status: true,
    });
    if (res.status == request_succesfully) {
      message.success("Group Recover Successfully");
      FetchGroup();
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };
  const RemoveGroupById = async (id: string) => {
    const res = await RemoveGroup(id);
    if (res.status == request_succesfully) {
      message.success(res.message ?? "Group Deleted Successfully");
      FetchGroup();
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };
  useEffect(() => {
    FetchGroup();
  }, [Id]);
  return (
    <div className={styles.container}>
      {TrashGroup.map((item) => (
        <div className={styles.box} key={item.id}>
          <div className={styles.name}>{item.name}</div>
          {/* <div className={styles.count}>Members count</div> */}
          <div className={styles.time}>
            {moment(item.timestamp).format("DD-MM-YY HH:mm:ss")}
          </div>
          <div className={styles.button} onClick={() => RecoverGroup(item.id)}>
            Recover
          </div>
          <div
            className={styles.del_button}
            onClick={() => RemoveGroupById(item.id)}
          >
            Delete
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrashTemplate;

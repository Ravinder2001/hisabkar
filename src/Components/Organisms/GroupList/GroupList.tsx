import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import GetUserGroups from "../../../APIs/GetUserGroups";
import { request_succesfully } from "../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast } from "../../../utils/ToastStyle";
import GroupCard from "../../Atoms/GroupCard/GroupCard";

type GroupListType = {
  id: string;
  name: string;
  group_members: { image: string; name: string }[];
  timestamp: string;
  editable: boolean;
  amount: number;
};

function GroupList() {
  const user_id = useSelector((state: RootState) => state.UserSlice.id);
  const [GroupsList, setGroupList] = useState<GroupListType[]>([]);
  const [flag, setFlag] = useState(false);

  const toogleFlag = () => {
    setFlag(!flag);
  };

  const FetchGroupList = async () => {
    const res = await GetUserGroups(user_id);
    if (res.status == request_succesfully) {
      setGroupList(res.data);
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };
  useEffect(() => {
    FetchGroupList();
  }, [flag]);

  return (
    <div className={styles.container}>
      {/* {GroupsList.map((item) => (
        <div>{item.name}</div>
      ))} */}
      {GroupsList.map((item) => (
        <GroupCard
          id={item.id}
          name={item.name}
          members={item.group_members}
          amount={item.amount}
          time={item.timestamp}
          editable={item.editable}
          toogleFlag={toogleFlag}
        />
      ))}
    </div>
  );
}

export default GroupList;

import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import GetUserGroups from "../../../APIs/GetUserGroups";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import GroupCard from "../../Atoms/GroupCard/GroupCard";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../../store/slices/UserSlice";
import CircularLoader from "../../Atoms/Loader/CircularLoader/CircularLoader";
import {message} from "antd"
type GroupListType = {
  id: string;
  name: string;
  group_members: { image: string; name: string }[];
  timestamp: string;
  editable: boolean;
  amount: number;
};

function GroupList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_id: any = useSelector((state: RootState) => state.UserSlice.id);

  const [GroupsList, setGroupList] = useState<GroupListType[]>([]);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);

  const toogleFlag = () => {
    setFlag(!flag);
  };

  const FetchGroupList = async () => {
    setLoading(true);
    const res = await GetUserGroups(user_id);
    if (res.status == request_succesfully) {
      setGroupList(res.data);
      setLoading(false);
    } else if (res?.response?.data?.status === Unauthorized) {
      localStorage.removeItem(localStorageKey);
      dispatch(Logout());
      navigate("/login");
      message.error(res?.response?.data?.message ?? "Something went wrong")
    } else {
      setLoading(false);
      message.error(res?.response?.data?.message ?? "Something went wrong")
    }
  };
  useEffect(() => {
    FetchGroupList();
  }, [flag]);
  
  return loading ? (
    <div className={styles.loaderBox}>
      <CircularLoader />
    </div>
  ) : (
    <div className={styles.container}>
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

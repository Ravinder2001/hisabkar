import { Fragment, useState, useEffect } from "react";
import Header from "../../Organisms/Dashboard/Header/Header";
import Main from "../../Organisms/Dashboard/Main/Main";
import styles from "./styles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import GetGroupById from "../../../APIs/GetGroupById";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import { Logout } from "../../../store/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { message } from "antd";
import BarLoader from "../../Atoms/Loader/BarLoader/BarLoader";
import ProgressLoader from "../../Atoms/Loader/ProgressLoader/ProgressLoader";
import { addGroupMembers } from "../../../store/slices/FilterSlice";
interface Params extends Record<string, string | undefined> {
  group_id: string;
}

export type GroupDataType = {
  group_id: string;
  group_name: string;
  group_members: { member_id: string; member_name: string }[];
};

function DashBoardTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [GroupData, setGroupData] = useState<GroupDataType | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);

  const { group_id } = useParams<Params>();
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );
  const FetchGroup = async () => {
    if (group_id) {
      let object = {
        group_id,
        guestUser,
      };
      const res = await GetGroupById(object);
      if (res.status == request_succesfully) {
        setGroupData(res.data);
        dispatch(addGroupMembers(res.data.group_members));
        setLoading(false);
      } else if (res.response.data.status === Unauthorized) {
        dispatch(Logout());
        localStorage.removeItem(localStorageKey);
        navigate("/login");
        message.error(res.response.data.message ?? "Something went wrong");
      } else {
        setGroupData(undefined);
        message.error(res.response.data.message ?? "Something went wrong");
        setLoading(false);
      }
    } else {
      setGroupData(undefined);
    }
  };
  useEffect(() => {
    setLoading(true);
    FetchGroup();
  }, [group_id]);

  return loading ? (
    <div className={styles.loader}>
      <ProgressLoader />
    </div>
  ) : (
    <>
      {GroupData ? (
        <>
          <div className={styles.container}>
            <Header
              name={GroupData.group_name}
              members={GroupData.group_members.length}
            />
            <Main GroupData={GroupData} />
          </div>
        </>
      ) : (
        <div className={styles.errorContainer}>
          <div>
            <ReactIcons name="BiErrorCircle" color="white" size={60} />
          </div>
          <div className={styles.text}>
            There is no group exist with this group id! Please check the group
            id.
          </div>
          <div onClick={() => navigate("/")} className={styles.home}>
            Go to Home
          </div>
        </div>
      )}
    </>
  );
}

export default DashBoardTemplate;

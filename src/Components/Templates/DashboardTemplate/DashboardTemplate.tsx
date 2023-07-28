import { useState, useEffect } from "react";
import { message } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../Organisms/Dashboard/Header/Header";
import Main from "../../Organisms/Dashboard/Main/Main";
import GetGroupById from "../../../APIs/GetGroupById";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import ProgressLoader from "../../Atoms/Loader/ProgressLoader/ProgressLoader";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { Logout } from "../../../store/slices/UserSlice";
import { RootState } from "../../../store/store";
import { addGroupMembers } from "../../../store/slices/FilterSlice";

import styles from "./styles.module.css";
interface Params extends Record<string, string | undefined> {
  group_id: string;
}

export type GroupDataType = {
  group_id: string;
  group_name: string;
  group_members: { member_id: string; member_name: string }[];
  inputedit: boolean;
};

function DashBoardTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
      let extractedValue: string | null = "";
      if (guestUser) {
        const urlParams = new URLSearchParams(location.search);
        extractedValue = urlParams.get("id");
      }
      let object = {
        group_id,
        guestUser,
        user: extractedValue,
      };

      const res = await GetGroupById(object);
      if (res.status == request_succesfully && res.data !== undefined) {
        setGroupData(res.data);
        dispatch(addGroupMembers(res.data.group_members));
        setLoading(false);
      } else if (res.data === undefined && res.status == request_succesfully) {
        setGroupData(undefined);
      } else if (res?.response?.data?.status === Unauthorized) {
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
              group_id={GroupData.group_id}
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

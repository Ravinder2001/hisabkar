import { Fragment, useState, useEffect } from "react";
import Header from "../../Organisms/Dashboard/Header/Header";
import Main from "../../Organisms/Dashboard/Main/Main";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import GetGroupById from "../../../APIs/GetGroupById";
import { request_succesfully } from "../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast } from "../../../utils/ToastStyle";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";

interface Params extends Record<string, string | undefined> {
  group_id: string;
}

export type GroupDataType = {
  group_id: string;
  group_name: string;
  group_members: { member_id: string; member_name: string }[];
};

function DashBoardTemplate() {
  const [GroupData, setGroupData] = useState<GroupDataType | undefined>(
    undefined
  );
  const { group_id } = useParams<Params>();
  const FetchGroup = async () => {
    if (group_id) {
      const res = await GetGroupById(group_id);
      if (res.status == request_succesfully) {
        setGroupData(res.data);
      } else {
        setGroupData(undefined);
        toast.error(
          res.response.data.message ?? "Something went wrong",
          ErroToast
        );
      }
    } else {
      setGroupData(undefined);
    }
  };
  useEffect(() => {
    FetchGroup();
  }, [group_id]);
  return (
    <>
      {GroupData ? (
        <>
          <div className={styles.container}>
            <Header
              name={GroupData.group_name}
              members={GroupData.group_members.length}
            />
            <Main GroupData={GroupData}/>
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
        </div>
      )}
    </>
  );
}

export default DashBoardTemplate;

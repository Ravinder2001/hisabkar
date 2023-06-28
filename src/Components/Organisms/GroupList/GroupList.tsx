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
  group_members: { member_name: string }[];
};

function GroupList() {
  const user_id = useSelector((state: RootState) => state.UserSlice.id);
  const [GroupsList, setGroupList] = useState<GroupListType[]>([]);

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
  }, []);

  let GroupDetails = [
    {
      groupName: "Kedarnath",
      description: "Ase hi bnai h",
      members: [
        { image: "https://api.multiavatar.com/111.png", name: "Ravi" },
        { image: "https://api.multiavatar.com/2222.png", name: "Vishal" },
        { image: "https://api.multiavatar.com/333.png", name: "Prajal" },
      ],
      amount: 10000,
      timestamp: "2023-06-28T06:30:39.060Z",
    },
  ];

  return (
    <div className={styles.container}>
      {/* {GroupsList.map((item) => (
        <div>{item.name}</div>
      ))} */}
      {GroupDetails.map((item: any) => (
        <GroupCard
          name={item.groupName}
          des={item.description}
          members={item.members}
          amount={item.amount}
          time={item.timestamp}
        />
      ))}
    </div>
  );
}

export default GroupList;

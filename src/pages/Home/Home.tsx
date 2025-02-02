import React, { useEffect, useState } from "react";
import ExpenseCard from "../../components/GroupCard/GroupCard";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import { GroupType } from "../../utils/comman/CommanTypes";
import styles from "./style.module.css";

function Home() {
  const { fetchData, response } = useApiFetch(CONSTANTS.API_ROUTES.ALL_GROUPS);

  const [groupList, setGroupList] = useState<GroupType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (response?.success == 1) {
      setGroupList(response.data);
    }
  }, [response]);
  return (
    <div className={styles.container}>
      <div className={styles.cardCon}>
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
        {groupList.map((group) => (
          <ExpenseCard key={group.group_id} {...group} />
        ))}
      </div>
    </div>
  );
}

export default Home;

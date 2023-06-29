import { useState } from "react";
import List from "../../Organisms/Home/List/List";
import Footer from "../../Organisms/Home/Footer/Footer";
import Header from "../../Organisms/Home/Header/Header";
import styles from "./styles.module.css";
import { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import GroupList from "../../Organisms/GroupList/GroupList";

type MemberList = {
  name: string;
}[];

type MemberListType = {
  id: string;
  name: string;
  image:string
};

function HomeTemplate() {
  const [GroupName, setGroupName] = useState<string>("");
  const [MemberList, setMemberList] = useState<MemberListType[]>([]);

  const handleGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const addMember = (e: { id: string; name: string,image:string }) => {
    
    setMemberList((prev) => [...prev, e]);
  };

  const handleRemoveMember = (e: string) => {
    let data = MemberList.filter((item) => item.id !== e);
    setMemberList(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftBox}>
        <Header />
        <List
          GroupName={GroupName}
          handleGroupName={handleGroupName}
          addMember={addMember}
          MemberList={MemberList}
          handleRemoveMember={handleRemoveMember}
        />
        <Footer GroupName={GroupName} MemberList={MemberList} />
      </div>
      <div className={styles.rightBox}>
        <GroupList />
      </div>
    </div>
  );
}

export default HomeTemplate;

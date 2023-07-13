import { useState, useEffect, useRef } from "react";
import List from "../../Organisms/Home/List/List";
import Footer from "../../Organisms/Home/Footer/Footer";
import Header from "../../Organisms/Home/Header/Header";
import styles from "./styles.module.css";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import GroupList from "../../Organisms/GroupList/GroupList";
import { toogleAmount } from "../../../store/slices/OtherSlice";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
type MemberList = {
  name: string;
}[];

type MemberListType = {
  id: string;
  name: string;
  image: string;
};

function HomeTemplate() {
  const dispatch = useDispatch();
  const [GroupName, setGroupName] = useState<string>("");
  const [MemberList, setMemberList] = useState<MemberListType[]>([]);
  const [Error, setError] = useState({
    name: true,
    members: true,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const handleGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const addMember = (e: { id: string; name: string; image: string }) => {
    setMemberList((prev) => [...prev, e]);
  };

  const handleRemoveMember = (e: string) => {
    let data = MemberList.filter((item) => item.id !== e);
    setMemberList(data);
  };

  useEffect(() => {
    dispatch(toogleAmount(0));
  }, []);

  useEffect(() => {
    if (GroupName.length > 0 && MemberList.length > 1) {
      setError({ members: false, name: false });
    }
  }, [GroupName, MemberList]);

  useEffect(() => {
    if (GroupName.length < 1) {
      setError({ ...Error, name: true });
    } else {
      setError({ ...Error, name: false });
    }
  }, [GroupName]);

  useEffect(() => {
    if (MemberList.length < 2) {
      setError({ ...Error, members: true });
    } else {
      setError({ ...Error, members: false });
    }
  }, [MemberList]);

  return (
    <div className={styles.container}>
      <div className={styles.leftBox}>
        <Header />
        <List
          Error={Error}
          isSubmit={isSubmit}
          GroupName={GroupName}
          handleGroupName={handleGroupName}
          addMember={addMember}
          MemberList={MemberList}
          handleRemoveMember={handleRemoveMember}
        />
        <Footer
          setIsSubmit={setIsSubmit}
          Error={Error}
          GroupName={GroupName}
          MemberList={MemberList}
        />
       
          <div className={styles.scroll}>
            {/* Scroll Down */}
            <span style={{ marginTop: "10px", marginLeft: "6px" }}>
              <ReactIcons name="BsChevronDoubleDown" size={30} />
            </span>
          </div>
   
      </div>

      <div className={styles.rightBox}>
        <GroupList />
      </div>
    </div>
  );
}

export default HomeTemplate;

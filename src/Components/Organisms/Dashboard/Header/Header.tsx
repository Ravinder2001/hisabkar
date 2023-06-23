import React from "react";
import styles from "./styles.module.css";
import Heading from "../../../Atoms/Headings/Heading";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
function Header() {
  const GroupName = useSelector(
    (state: RootState) => state.AddGroupSlice.GroupName
  );

  const MembersLength = useSelector(
    (state: RootState) => state.AddGroupSlice.MemberList.length
  );

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <Heading text="hisabkar.com" />
      </div>
      <div className={styles.subHeading}>
        <div>{GroupName}</div>
        <div>{MembersLength} Members</div>
      </div>
    </div>
  );
}

export default Header;

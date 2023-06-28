import React from "react";
import styles from "./styles.module.css";
import Heading from "../../../Atoms/Headings/Heading";

type HeaderProps = {
  name: string;
  members: number;
};

function Header(props: HeaderProps) {
  const GroupName = props.name;

  const MembersLength = props.members;

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

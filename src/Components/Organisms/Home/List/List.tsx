import { ChangeEvent, Dispatch, SetStateAction } from "react";
import InputBox1 from "../../../Atoms/InputBox/InputBox1/InputBox1";
import AddMember from "../../../Molecules/AddMember/AddMember";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../../store/store";
import ReactIcons from "../../../Atoms/ReactIcons/ReactIcons";

type ListProps = {
  Error: { name: boolean; members: boolean };
  isSubmit: boolean;
  handleGroupName: (e: ChangeEvent<HTMLInputElement>) => void;
  GroupName: string;
  addMember: (e: { id: string; name: string; image: string }) => void;
  MemberList: { id: string; name: string }[];
  handleRemoveMember: (e: string) => void;
};

function List(props: ListProps) {
  return (
    <div className={styles.container}>
      <div>
        <InputBox1
          handleChange={props.handleGroupName}
          value={props.GroupName}
          placeholder="Group Name"
          type="text"
        />
      </div>
      {props.Error.name && props.isSubmit && <div className={styles.error}>Please Add Group name!</div>}

      <div>
        <AddMember addMember={props.addMember} />
      </div>
      {props.Error.members && props.isSubmit && (
        <div  className={styles.error}>Please Add atleast two people!</div>
      )}

      {props.MemberList.map((item) => (
        <div className={styles.memberBox} key={item.id}>
          <div className={styles.memberName}>{item.name}</div>
          <div onClick={() => props.handleRemoveMember(item.id)}>
            <ReactIcons
              name="IoMdRemoveCircleOutline"
              color="white"
              size={20}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default List;

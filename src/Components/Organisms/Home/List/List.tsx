import { ChangeEvent } from "react";
import InputBox1 from "../../../Atoms/InputBox/InputBox1/InputBox1";
import AddMember from "../../../Molecules/AddMember/AddMember";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addGroupName,
  removeGroupMember,
} from "../../../../store/slices/AddGroupSlice";
import { RootState } from "../../../../store/store";
import ReactIcons from "../../../Atoms/ReactIcons/ReactIcons";

function List() {
  const dispatch = useDispatch();

  const GroupName = useSelector(
    (state: RootState) => state.AddGroupSlice.GroupName
  );
  const MemberList = useSelector(
    (state: RootState) => state.AddGroupSlice.MemberList
  );

  const GroupError = useSelector(
    (state: RootState) => state.AddGroupSlice.GroupError
  );
  const MemberError = useSelector(
    (state: RootState) => state.AddGroupSlice.MemberError
  );
  const ErrorShow = useSelector(
    (state: RootState) => state.AddGroupSlice.ErrorShow
  );

  const handleGroupName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(addGroupName(e.target.value));
  };

  const handleRemoveMember = (e: string) => {
    dispatch(removeGroupMember(e));
  };

  return (
    <div className={styles.container}>
      <div>
        <InputBox1 handleChange={handleGroupName} value={GroupName} placeholder="Group Name" type="text" />
        {GroupError && ErrorShow && <div>Please Add Group Name</div>}
      </div>

      <div>
        <AddMember />
        {MemberError && ErrorShow && <div>Please add atleast two members</div>}
      </div>

      {MemberList.map((item) => (
        <div className={styles.memberBox} key={item.id}>
          <div className={styles.memberName}>{item.name}</div>
          <div onClick={() => handleRemoveMember(item.id)}>
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

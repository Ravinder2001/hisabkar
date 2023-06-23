import { ChangeEvent, useState, KeyboardEvent } from "react";
import InputBox2 from "../../Atoms/InputBox/InputBox2/InputBox2";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  addGroupMember,
  addGroupName,
} from "../../../store/slices/AddGroupSlice";

function AddMember() {
  const dispatch = useDispatch();
  const [memberName, setMemberName] = useState<string>("");

  const handleMemberName = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberName(e.target.value);
  };

  const handleAddMember = () => {
    if (memberName !== "") {
      dispatch(addGroupMember(memberName));
      setMemberName("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleAddMember();
      setMemberName("");
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <InputBox2
          handleChange={handleMemberName}
          value={memberName}
          handleKeyPress={handleKeyPress}
        />
      </div>
      <div className={styles.icon} onClick={handleAddMember}>
        <ReactIcons name="BsPersonAdd" size={30} color="#45f3ff" />
      </div>
    </div>
  );
}

export default AddMember;

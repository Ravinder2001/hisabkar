import {
  ChangeEvent,
  useState,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
} from "react";
import InputBox2 from "../../Atoms/InputBox/InputBox2/InputBox2";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const shortid = require("shortid");
type AddMemberProps = {
  addMember: (e: { id: string; name: string; image: string }) => void;
};
function AddMember(props: AddMemberProps) {
  const dispatch = useDispatch();
  const [memberName, setMemberName] = useState<string>("");

  const handleMemberName = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberName(e.target.value);
  };

  const handleAddMember = () => {
    if (memberName !== "") {
      const num1 = Math.floor(Math.random() * 100);
      const image = `https://api.multiavatar.com/${num1}.png`;
      let id = shortid.generate();
      props.addMember({ id: id, name: memberName, image: image });
      // dispatch(addGroupMember(memberName));
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

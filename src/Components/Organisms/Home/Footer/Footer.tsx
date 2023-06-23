import React from "react";
import Button1 from "../../../Atoms/Button/Button1/Button1";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { toogleErrorShow } from "../../../../store/slices/AddGroupSlice";
import { addPairs } from "../../../../store/slices/SplitSlice";
function Footer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const GroupError = useSelector(
    (state: RootState) => state.AddGroupSlice.GroupError
  );
  const MemberError = useSelector(
    (state: RootState) => state.AddGroupSlice.MemberError
  );

  const MemberList = useSelector(
    (state: RootState) => state.AddGroupSlice.MemberList
  );

  const handleSubmit = () => {
    if (!GroupError && !MemberError) {
      dispatch(addPairs(MemberList));
      navigate("/dashboard");
    } else {
      dispatch(toogleErrorShow());
    }
  };
  return (
    <div className={styles.container} onClick={handleSubmit}>
      <Button1 />
    </div>
  );
}

export default Footer;

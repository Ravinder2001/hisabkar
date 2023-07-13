import React, { useEffect, useState, ChangeEvent } from "react";
import styles from "./styles.module.css";
import PutRelation from "../../../APIs/PutRelation";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { message } from "antd";
import { Logout } from "../../../store/slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function ToogleSwitch2(props: { open: boolean; id: number }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(props.open);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setOpen(e.target.checked);
    const res = await PutRelation({ id: props.id, status: e.target.checked });
    if (res?.status === request_succesfully) {
      message.success(res.message);
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };
  return (
    <div>
      <label className={styles.switch}>
        <input checked={open} onChange={handleChange} type="checkbox" />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
}

export default ToogleSwitch2;

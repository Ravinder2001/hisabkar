import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import styles from "./style.module.scss";
import PinBox from "../../PinBox/PinBox";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { DashboardRoute, localStorageKey, request_succesfully } from "../../../utils/Constants";
import { jwtDecode } from "jwt-decode";
import { AddUser } from "../../../store/slices/UserSlice";
import Login from "../../../APIs/Login";
type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
};
interface decode {
  exp: number;
  iat: number;
  id: string;
  username: string;
  image: string;
}
function LoginContainer(props: props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");

  const validateUsername = (username: string) => {
    if (username.length < 4) {
      return "Username must be at least 4 characters";
    }
    if (username.length > 20) {
      return "Username cannot be more than 20 characters";
    }
    return null; // Indicates no validation error
  };

  const validatePin = (pin: string) => {
    if (pin.length !== 4) {
      return "Please enter a valid pin!";
    }
    return null;
  };

  const handleSubmit = async () => {
    const usernameError = validateUsername(username);
    if (usernameError) {
      return message.error(usernameError);
    }

    const pinError = validatePin(pin);
    if (pinError) {
      return message.error(pinError);
    }

    const res = await Login({ username, pin });
    if (res?.status == request_succesfully) {
      const decode: decode = jwtDecode(res?.token);
      dispatch(AddUser(decode));
      localStorage.setItem(localStorageKey, res?.token);
      navigate(DashboardRoute);
    }
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Login</div>

      <div className={styles.mainContainer}>
        <div className={styles.label}>Username</div>
        <input className={styles.input} type="text" maxLength={20} value={username} onChange={handleUsername} placeholder="Username" />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.label}>Pin</div>
        <PinBox value={pin} setPin={setPin} />
      </div>
      <div className={styles.btn} onClick={handleSubmit}>
        Submit
      </div>

      <div
        className={styles.footer}
        onClick={() => {
          props.setSelectedOptions("sign");
        }}
      >
        Create an account
      </div>
      <div className={styles.footer}>
        Forgot Pin? <span>Contact Admin</span>
      </div>
    </div>
  );
}

export default LoginContainer;

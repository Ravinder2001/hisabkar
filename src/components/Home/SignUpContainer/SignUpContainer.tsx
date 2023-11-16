import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./style.module.scss";
import PinBox from "../../PinBox/PinBox";
import Register from "../../../APIs/Register";
import { message } from "antd";
import { DashboardRoute, localStorageKey, request_succesfully } from "../../../utils/Constants";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { AddUser } from "../../../store/slices/UserSlice";
import UsernameExists from "../../../APIs/UsernameExists";

interface decode {
  exp: number;
  iat: number;
  id: string;
  username: string;
  image: string;
}
type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
};
function SignUpContainer(props: props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [isUsernameExists, setIsUsernameExists] = useState<boolean>(false);

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

    if (pin !== confirmPin) {
      return message.error("Pin and Confirm Pin must be the same!");
    }

    const random = Math.floor(Math.random() * 100);
    const image = `https://api.multiavatar.com/${random}.png`;

    const res = await Register({ username, pin, image });
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

  const handleUserExists = async () => {
    const res = await UsernameExists(username);
    if (res?.status == request_succesfully) {
      setIsUsernameExists(res?.exist);
    }
  };

  useEffect(() => {
    if (username.length) {
      handleUserExists();
    } else {
      setIsUsernameExists(false);
    }
  }, [username]);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Create an Account</div>

      <div className={styles.mainContainer}>
        <div className={styles.label}>Username</div>
        <input className={styles.input} type="text" maxLength={20} placeholder="Username" value={username} onChange={handleUsername} />
        {isUsernameExists && <div className={styles.exist_error}>This Username is already Exists!</div>}
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.label}>Pin</div>
        <PinBox value={pin} setPin={setPin} />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.label}>Confirm Pin</div>
        <PinBox value={confirmPin} setPin={setConfirmPin} />
      </div>
      <div className={styles.btn} onClick={handleSubmit}>
        Submit
      </div>

      <div className={styles.footer}>
        Already have a account?{" "}
        <span
          onClick={() => {
            props.setSelectedOptions("login");
          }}
        >
          Login
        </span>
      </div>
    </div>
  );
}

export default SignUpContainer;

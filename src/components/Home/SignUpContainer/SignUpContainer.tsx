import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import styles from "./style.module.scss";
import PinBox from "../../PinBox/PinBox";
import Register from "../../../APIs/Register";
import { message } from "antd";
type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
};
function SignUpContainer(props: props) {
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");

  const handleSubmit = async () => {
    if (username.length < 4) {
      return message.error("Username must be at least 4 characters");
    }
    if (username.length > 20) {
      return message.error("Username cannot be more than 20 characters");
    }
    if (pin.length != 4) {
      return message.error("Please enter a valid pin!");
    }
    if (confirmPin.length != 4) {
      return message.error("Please enter a valid confirm pin!");
    }
    if(pin!=confirmPin){
      return message.error("Pin and Confirm Pin must be the same!");
    }
    return alert("jii");
    let image = "";
    const res = await Register({ username, pin, image });
  };

  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Create an Account</div>

      <div className={styles.mainContainer}>
        <div className={styles.label}>Username</div>
        <input className={styles.input} type="text" maxLength={20} placeholder="Username" value={username} onChange={handleUsername} />
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

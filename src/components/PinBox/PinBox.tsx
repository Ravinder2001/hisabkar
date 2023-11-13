import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import OtpInput from "react-otp-input";
import styles from "./style.module.scss";
type props = {
  value: string;
  setPin: Dispatch<SetStateAction<string>>;
};
function PinBox(props: props) {
  return (
    <OtpInput
      value={props.value}
      onChange={props.setPin}
      containerStyle={styles.input}
      numInputs={4}
      renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
    />
  );
}

export default PinBox;

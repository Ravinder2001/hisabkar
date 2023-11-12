import React, { useState } from "react";
import OtpInput from "react-otp-input";
import styles from "./style.module.scss";
function PinBox() {
  const [otp, setOtp] = useState("");
  return (
    <OtpInput
      value={otp}
      onChange={setOtp}
      containerStyle={styles.input}
      numInputs={4}
      renderSeparator={<span>-</span>}
      renderInput={(props) => <input {...props} />}
    />
  );
}

export default PinBox;

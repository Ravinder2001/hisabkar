 
import React, { useState } from "react";
import styles from "./style.module.css";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

type PropsType = {
  animateClassName: string;
  handleSubmit: (e: string) => void;
  isLoading: boolean;
};

function OTPComponent(props: PropsType) {
  const [otpValues, setOTPValues] = useState("");

  const handleOTP = (value: string) => {
    setOTPValues(value);
  };

  const handleSubmit = () => {
    props.handleSubmit(otpValues);
  };

  return (
    <div className={`${styles.container} ${styles[props.animateClassName]}`}>
      <InputOTP maxLength={6} value={otpValues} onChange={handleOTP}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <ButtonComponent text="Submit" onClick={handleSubmit} isLoading={props.isLoading} />
    </div>
  );
}

export default OTPComponent;

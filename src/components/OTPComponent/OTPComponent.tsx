/*eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.css";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";

type PropsType = {
  setValues: Dispatch<SetStateAction<any>>;
  values: any;
};

function OTPComponent(props: PropsType) {
  const handleOTP = (value: string) => {
    props.setValues((prev: any) => ({ ...prev, otp: value }));
  };

  return (
    <div className={styles.container}>
      <InputOTP maxLength={6} value={props.values.otp} onChange={handleOTP}>
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
    </div>
  );
}

export default OTPComponent;

import React from "react";
import styles from "./style.module.css";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import ButtonComponent from "../Atoms/ButtonComponent/ButtonComponent";

type PropsType = {
  animateClassName: string;
};

function OTPComponent(props: PropsType) {
  return (
    <div className={`${styles.container} ${styles[props.animateClassName]}`}>
      <InputOTP maxLength={6}>
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
      <ButtonComponent
        text="Submit"
        // onClick={handleSubmit}
        // type="submit"
        // disabled={isSubmitting}
      />
    </div>
  );
}

export default OTPComponent;

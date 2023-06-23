import { ChangeEvent } from "react";
import styles from "./styles.module.css";

type InputBox1Props = {
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  placeholder?: string;
  type?: string;
};

const InputBox1 = (props: InputBox1Props) => {
  const { handleChange, value, placeholder, type } = props;
  return (
    <div className={styles.inputbox}>
      <input className={styles.input} required type={type} value={value} onChange={handleChange} />
      <span>{placeholder}</span>
      <i></i>
    </div>
  );
};

export default InputBox1;

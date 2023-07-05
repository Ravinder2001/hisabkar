import { ChangeEvent, KeyboardEvent } from "react";
import styles from "./styles.module.css";

type InputBox2Props = {
  value?: string;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  max?: number;
};

function InputBox2(props: InputBox2Props) {
  const { value, handleChange, handleKeyPress ,type,placeholder,max} = props;
  return (
    <div className={`${styles.form__group} ${styles.field}`}>
      <input
        type={type}
        className={styles.form__field}
        placeholder="Name"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        max={max}
      />
      <label className={styles.form__label}>{placeholder}</label>
    </div>
  );
}

export default InputBox2;

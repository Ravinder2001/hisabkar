import { ChangeEvent, KeyboardEvent } from "react";
import styles from "./styles.module.css";

type InputBox2Props = {
  value?: string;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

function InputBox2(props: InputBox2Props) {
  const { value, handleChange, handleKeyPress } = props;
  return (
    <div className={`${styles.form__group} ${styles.field}`}>
      <input
        type="input"
        className={styles.form__field}
        placeholder="Name"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />
      <label className={styles.form__label}>Add Group Member</label>
    </div>
  );
}

export default InputBox2;

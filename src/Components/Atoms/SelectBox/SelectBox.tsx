import { ChangeEventHandler } from "react";
import styles from "./styles.module.css";

type SelectBoxProps = {
  options: { member_id: string; member_name: string }[];
  value: string;
  handleChange: ChangeEventHandler<HTMLSelectElement>;
};

function SelectBox(props: SelectBoxProps) {
  const { options, handleChange, value } = props;
  return (
    <select
      name=""
      id=""
      className={styles.select}
      value={value}
      onChange={handleChange}
    >
      {options.map((item) => (
        <option
          key={item.member_id}
          value={item.member_id}
          className={styles.option}
        >
          {item.member_name}
        </option>
      ))}
    </select>
  );
}

export default SelectBox;

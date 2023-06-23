import { ChangeEventHandler } from "react";
import styles from "./styles.module.css";

type SelectBoxProps = {
  options: { id: string; name: string }[];
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
        <option key={item.id} value={item.name} className={styles.option}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

export default SelectBox;

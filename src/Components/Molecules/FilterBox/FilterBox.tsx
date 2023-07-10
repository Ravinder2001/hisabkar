import React, { ChangeEvent } from "react";
import styles from "./styles.module.css";
type FilterBoxProps = {
  value: string;
  title: string;
  options: { member_id: string; member_name: string }[];
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

function FilterBox(props: FilterBoxProps) {
  const { title, options, handleChange, value } = props;
  return (
    <div className={styles.container}>
      <div className={styles.filterHeader}>{title}</div>
      <select
        name=""
        id=""
        className={styles.select}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange(e)}
        value={value}
      >
        <option value="All">All</option>
        {options.map((item) => (
          <option value={item.member_id} key={item.member_id}>
            {item.member_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBox;

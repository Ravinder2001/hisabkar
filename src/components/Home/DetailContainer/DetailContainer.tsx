import React, { Dispatch, SetStateAction } from "react";
import styles from "./style.module.scss";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
type props = {
  setSelectedOptions: Dispatch<SetStateAction<string>>;
  handleModal:() => void;
};
function DetailContainer(props: props) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div className={styles.options} onClick={props.handleModal}>Start Spliting</div>,
    },
    {
      key: "2",
      label: (
        <div
          className={styles.options}
          onClick={() => {
            props.setSelectedOptions("login");
          }}
        >
          Login
        </div>
      ),
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Turning bills into thrills, effortlessly splitting expenses among friends!</div>
      <div className={styles.subHeading}>
        Tired of those post-trip payment disputes with friends? Say goodbye to those headaches with Hisabkar! 🌟
      </div>
      <Dropdown menu={{ items }} placement="bottomLeft">
        <div className={styles.btn}>Try Hisabkar</div>
      </Dropdown>

      <div className={styles.ratingContainer}>
        <div className={styles.star}>🌟🌟🌟🌟🌟</div>
        <div className={styles.title}>Best Expense splitor in market</div>
        <div className={styles.description}>
          Consectetur adipiscing elit. Vehicula massa in enim luctus. Rutrum arcu, aliquam nulla tincidunt gravida. Cursus convallis dolor semper
          pretium ornare.
        </div>
        <div className={styles.profile}>
          <img
            className={styles.img}
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt=""
          />
          <div className={styles.name}>Ravinder</div>
        </div>
      </div>
    </div>
  );
}

export default DetailContainer;

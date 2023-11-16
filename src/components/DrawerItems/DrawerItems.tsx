import { useDispatch, useSelector } from "react-redux";

import styles from "./styles.module.scss";
import LucideIcons from "../../assets/Icons/Icons";
import { RootState } from "../../store/store";
import { setIndex } from "../../store/slices/DrawerSlice";

type DrawerPropsTypes = {
  IconName: string;
  IconColor: string;
  IconSize: number;
  label: string;
  index: number;
  handleClick: () => void;
};

function DrawerItems(props: DrawerPropsTypes) {
  
  const Index = useSelector((state: RootState) => state.DrawerSlice.index);

  return (
    <div className={Index === props.index ? styles.selected_box : styles.box} onClick={props.handleClick}>
      <div className={styles.icon}>
        <LucideIcons name={props.IconName} color={props.IconColor} size={props.IconSize} />
      </div>
      <div className={styles.text}>{props.label}</div>
    </div>
  );
}

export default DrawerItems;

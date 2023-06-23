import styles from "./styles.module.css";

type Button2Props = {
  handleClick: () => void;
};

function Button2(props: Button2Props) {
  return (
    <button className={styles.cssbuttonsIo} onClick={props.handleClick}>
      <span>
        
        Hisabkar
      </span>
    </button>
  );
}

export default Button2;

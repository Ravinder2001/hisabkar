import CircularProgress from '@mui/material/CircularProgress';

import styles from "./styles.module.css";

type ButtonType = {
  onClick: () => void;
  Error: boolean;
  Loading: boolean;
};

function Button3(props: ButtonType) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.Error}
      className={styles.button}
      style={{ cursor: props.Error ? "not-allowed" : "pointer" }}
    >
      {props.Loading ? <CircularProgress size={15} color="inherit"/> : "Add Email"}
    </button>
  );
}

export default Button3;

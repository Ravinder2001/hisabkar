import { BsArrowRight } from "react-icons/bs";

import styles from "./styles.module.css";

type BillBoxProps = {
  receiver: string;
  sender: string;
  amount: number;
};

function BillBox(props: BillBoxProps) {
  const { receiver, sender, amount } = props;
  return (
    <div className={styles.container}>
      <div className={styles.subCon}>
        <div className={styles.name}>{sender}</div>
        <div className={styles.placeholder}>Sender</div>
      </div>

      <div className={styles.subCon}>
        <BsArrowRight size={40} color="#45f3ff" />
      </div>
      <div className={styles.subCon}>
        <div className={styles.name}>{receiver}</div>
        <div className={styles.placeholder}>Receiver</div>
      </div>
      <div className={styles.subCon}>
        <div className={styles.amount}>₹{amount}</div>
        {/* <div className={styles.placeholder}>Amount</div> */}
      </div>
      
    </div>
  );
}

export default BillBox;

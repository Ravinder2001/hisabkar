import styles from "./style.module.scss";
export default function RatingComponent() {
  return (
    <div className={styles.container}>
      Turning bills into thrills, effortlessly splitting
      <div className={styles.flip}>
        <div>
          <div>Expenditure</div>
        </div>
        <div>
          <div>Spending</div>
        </div>
        <div>
          <div>Bills</div>
        </div>
      </div>
      among friends!
    </div>
  );
}

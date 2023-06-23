import styles from "./styles.module.css"
type headingProps={
  text:string
}
function Heading(props:headingProps) {
  return <div className={styles.heading}>{props.text}</div>;
}

export default Heading;

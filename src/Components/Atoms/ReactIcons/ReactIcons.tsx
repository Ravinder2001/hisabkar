import { BsPersonAdd } from "react-icons/bs";
import { IoMdRemoveCircleOutline } from "react-icons/io";

type ReactIconsProps = {
  name: string;
  size?: number;
  color?: string;
};

const ReactIcons = (props: ReactIconsProps) => {
  switch (props.name) {
    case "BsPersonAdd":
      return <BsPersonAdd size={props.size} color={props.color} />;
    case "IoMdRemoveCircleOutline":
      return <IoMdRemoveCircleOutline size={props.size} color={props.color} />;
    default:
      return <></>;
  }
};

export default ReactIcons;

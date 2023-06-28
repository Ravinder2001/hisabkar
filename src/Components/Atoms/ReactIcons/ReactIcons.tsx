import { BsPersonAdd ,} from "react-icons/bs";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {BiErrorCircle} from "react-icons/bi"
import {AiFillDelete} from "react-icons/ai"

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
    case "BiErrorCircle":
      return <BiErrorCircle size={props.size} color={props.color} />;
    case "AiFillDelete":
      return <AiFillDelete size={props.size} color={props.color} />;
    default:
      return <></>;
  }
};

export default ReactIcons;

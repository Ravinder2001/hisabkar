import { BsPersonAdd } from "react-icons/bs";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { BiErrorCircle, BiArrowBack } from "react-icons/bi";
import { CiCircleRemove } from "react-icons/ci";
import { AiFillDelete,AiFillHome } from "react-icons/ai";
import { RiLogoutBoxFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { BsChevronDoubleDown,BsWhatsapp } from "react-icons/bs";
import { SlGraph } from "react-icons/sl";

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
    case "RiLogoutBoxFill":
      return <RiLogoutBoxFill size={props.size} color={props.color} />;
    case "BiArrowBack":
      return <BiArrowBack size={props.size} color={props.color} />;
    case "CiCircleRemove":
      return <CiCircleRemove size={props.size} color={props.color} />;
    case "BsChevronDoubleDown":
      return <BsChevronDoubleDown size={props.size} color={props.color} />;
    case "BsWhatsapp":
      return <BsWhatsapp size={props.size} color={props.color} />;
    case "AiFillHome":
      return <AiFillHome size={props.size} color={props.color} />;
    case "SiGoogleanalytics":
      return <SiGoogleanalytics size={props.size} color={props.color} />;
    case "SlGraph":
      return <SlGraph size={props.size} color={props.color} />;
    default:
      return <></>;
  }
};

export default ReactIcons;

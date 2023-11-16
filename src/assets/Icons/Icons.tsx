import React from "react";
import { Home, LogOut, Dot, Trash2, Pencil } from "lucide-react";

type IconsType = {
  name: string;
  color?: string;
  size?: number;
};
function LucideIcons(props: IconsType) {
  switch (props.name) {
    case "Home":
      return <Home color={props.color} size={props.size} />;
    case "LogOut":
      return <LogOut color={props.color} size={props.size} />;
    case "Dot":
      return <Dot color={props.color} size={props.size} />;
    case "Trash":
      return <Trash2 color={props.color} size={props.size} />;
    case "Edit":
      return <Pencil color={props.color} size={props.size} />;

    default:
      return <></>;
  }
}

export default LucideIcons;

 
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

type PropsType = {
  userImage?: string;
  userName?: string;
  onClick?: (e: string) => void;
};

function UserAvatar(props: PropsType) {
  const User = useSelector((state: RootState) => state.user);

  // Function to extract initials from a full name
  const getInitials = (name: string): string => {
    const parts = name.split(" ").filter(Boolean); // Split the name by spaces and remove empty parts
    const initials = parts.map((part) => part[0].toUpperCase()); // Get the first letter of each part
    return initials.join(""); // Combine the initials
  };

  const fallbackText = getInitials(props.userName ?? User.name);

  // Handle onClick properly by calling it if it exists
  const handleAvatarClick = () => {
    if (props?.onClick) {
      props.onClick(props.userImage ?? ""); // Execute onClick callback
    }
  };

  return (
    <Avatar onClick={handleAvatarClick}>
      <AvatarImage src={props.userImage ?? User.avatar} />
      <AvatarFallback style={{ background: "grey", color: "white", fontSize: "14px" }}>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;

/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from "react";
import * as Icons from "lucide-react";

interface LucideIconProps {
  name: string;
  size?: number;
  color?: string;
  fill?: string;
  onClick?: (e: any) => void;
}

const LucideIcon: React.FC<LucideIconProps> = ({ name, size = 20, color = "currentColor", fill, onClick }) => {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} style={{ cursor: "pointer", fill: fill }} onClick={onClick} />;
};

export default LucideIcon;

import React from "react";
import "./style.css";

function CircularLoader() {
  return (
    <div className="center-loader-wrapper min-h-[300px] flex items-center justify-center w-full h-full">
      <div className="theme-spinner"></div>
    </div>
  );
}

export default CircularLoader;

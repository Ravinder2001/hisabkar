import React, { useEffect, useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function Loader() {
  const [seconds, setSeconds] = useState(60);

  // Get full name from Redux
  const fullName = useSelector((state: RootState) => state?.user?.name);

  // Extract first name or use funny placeholder
  const firstName = fullName ? fullName.split(" ")[0] : Math.random() > 0.5 ? "Sleepy Panda 🐼" : "Lazy Coder 😴";

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
          <circle
            className="pl__ring pl__ring--a"
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 660"
            strokeDashoffset="-330"
            strokeLinecap="round"
          ></circle>
          <circle
            className="pl__ring pl__ring--b"
            cx="120"
            cy="120"
            r="35"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 220"
            strokeDashoffset="-110"
            strokeLinecap="round"
          ></circle>
          <circle
            className="pl__ring pl__ring--c"
            cx="85"
            cy="120"
            r="70"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 440"
            strokeLinecap="round"
          ></circle>
          <circle
            className="pl__ring pl__ring--d"
            cx="155"
            cy="120"
            r="70"
            fill="none"
            stroke="#000"
            strokeWidth="20"
            strokeDasharray="0 440"
            strokeLinecap="round"
          ></circle>
        </svg>
      </div>

      <div className="loader-text">
        <p>⚡ Hey {firstName}, this app is hosted on a free server.</p>
        <p>⏳ The server might be waking up. Please wait…</p>
        <p>
          Estimated time: <strong>{seconds}</strong> seconds
        </p>
      </div>
    </div>
  );
}

export default Loader;

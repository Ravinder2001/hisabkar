import React from "react";

export default function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = Math.max(0, circumference - (percentage / 100) * circumference);

  // Gradient from emerald (safe) to red (over budget)
  const isOverBudget = percentage >= 100;
  const isWarning = percentage >= 85 && percentage < 100;

  let strokeColor = "#10b981"; // emerald-500
  if (isWarning) strokeColor = "#f59e0b"; // amber-500
  if (isOverBudget) strokeColor = "#ef4444"; // red-500

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 54 54">
        {/* Background Circle */}
        <circle cx="27" cy="27" r={radius} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="3.5" fill="none" />
        {/* Progress Circle */}
        <circle
          cx="27"
          cy="27"
          r={radius}
          stroke={strokeColor}
          strokeWidth="3.5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="z-10 flex flex-col items-center">
        <span className="text-[10px] leading-[10px] font-black">{percentage}%</span>
      </div>
    </div>
  );
}

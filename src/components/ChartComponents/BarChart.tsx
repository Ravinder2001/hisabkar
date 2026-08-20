/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { EXPENSE_CATEGORIES } from "../../utils/constant/Categories";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseData {
  expense_type: string;
  total_amount_spent: string;
}

const BarChart: React.FC<{ data: ExpenseData[] }> = ({ data }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const chartLabels = data.map((item) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.label === item.expense_type);
    return cat ? `${cat.icon} ${cat.label}` : item.expense_type;
  });
  // Icon-only version for the axis itself (kept compact); the full name still
  // shows up via the tooltip title callback below, so nothing is lost on tap/hover.
  const chartIcons = data.map((item) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.label === item.expense_type);
    return cat ? cat.icon : "✨";
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Amount Spent",
        data: data.map((item) => parseFloat(item.total_amount_spent)),
        backgroundColor: data.map((item) => {
          const cat = EXPENSE_CATEGORIES.find((c) => c.label === item.expense_type);
          return (cat ? cat.hex : "#3b82f6") + "CC";
        }),
        borderColor: data.map((item) => {
          const cat = EXPENSE_CATEGORIES.find((c) => c.label === item.expense_type);
          return cat ? cat.hex : "#3b82f6";
        }),
        borderWidth: 1,
        borderRadius: 8,
        barThickness: isMobile ? 25 : 40,
      },
    ],
  };

  const options: any = {
    indexAxis: isMobile ? "y" : "x", // Responsive as requested
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        // Chart.js draws to a <canvas>, so these must be literal colors —
        // var(--hk-*) custom properties aren't resolved by the Canvas 2D API.
        backgroundColor: "#1a1f2e", // --hk-surface
        titleColor: "#f1efea", // --hk-ink
        bodyColor: "#f1efea", // --hk-ink
        borderColor: "#2e3549", // --hk-border
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (items: any[]) => chartLabels[items[0].dataIndex],
          label: (context: any) => ` ₹${context.raw.toLocaleString("en-IN")}`,
        },
        titleFont: { family: "Nunito", size: 14, weight: "bold" },
        bodyFont: { family: "Nunito", size: 16 },
      },
    },
    scales: {
      x: {
        type: isMobile ? "linear" : "category",
        grid: { display: !isMobile, color: "#2e3549" }, // --hk-border
        beginAtZero: true,
        ticks: {
          // x holds the ₹ values on mobile, but the icons themselves on desktop
          // (indexAxis flips) — icons need a bigger size to read clearly.
          font: { family: "Nunito", size: isMobile ? 10 : 20 },
          color: "#aeb4c7", // --hk-ink-soft
          callback: (value: any, index: number) => {
            if (isMobile) return `₹${value}`;
            return chartIcons[index];
          },
        },
      },
      y: {
        type: isMobile ? "category" : "linear",
        grid: { display: isMobile, color: "#2e3549" }, // --hk-border
        beginAtZero: true,
        ticks: {
          // y holds the icons on mobile (indexAxis: "y"), ₹ values on desktop.
          font: { family: "Nunito", size: isMobile ? 20 : 12 },
          color: "#aeb4c7", // --hk-ink-soft
          callback: (value: any, index: number) => {
            if (!isMobile) return `₹${value}`;
            return chartIcons[index];
          },
        },
      },
    },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ height: "400px", width: "100%", padding: "5px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;

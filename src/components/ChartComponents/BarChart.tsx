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
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => ` ₹${context.raw.toLocaleString("en-IN")}`,
        },
        titleFont: { family: "Nunito", size: 14, weight: "bold" },
        bodyFont: { family: "Nunito", size: 16 },
      },
    },
    scales: {
      x: {
        type: isMobile ? "linear" : "category",
        grid: { display: !isMobile, color: "#f1f5f9" },
        beginAtZero: true,
        ticks: {
          font: { family: "Nunito", size: isMobile ? 10 : 12 },
          color: "#64748b",
          callback: (value: any, index: number) => {
            if (isMobile) return `₹${value}`;
            return chartLabels[index];
          },
        },
      },
      y: {
        type: isMobile ? "category" : "linear",
        grid: { display: isMobile, color: "#f1f5f9" },
        beginAtZero: true,
        ticks: {
          font: { family: "Nunito", size: isMobile ? 11 : 12 },
          color: "#64748b",
          callback: (value: any, index: number) => {
            if (!isMobile) return `₹${value}`;
            return chartLabels[index];
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

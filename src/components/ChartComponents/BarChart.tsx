/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import CONSTANTS from "../../utils/constant/Constant";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseData {
  expense_type: string;
  total_amount_spent: string;
}
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

const BarChart: React.FC<{ data: ExpenseData[] }> = ({ data }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Prepare the data for the bar chart
  const chartData = {
    labels: data.map((item) => item.expense_type),
    datasets: [
      {
        label: "Total Amount Spent",
        data: data.map((item) => parseFloat(item.total_amount_spent)),
        backgroundColor: data.map(() => getRandomColor()), // Generate a random color for each bar
      },
    ],
  };

  // Chart options (customize as needed)
  const options: any = {
    responsive: true,
    indexAxis: isMobile ? "y" : "x",
    plugins: {
      title: {
        display: false,
        text: "Expense Breakdown",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `₹ ${tooltipItem.raw.toFixed(2)}`,
        },
        titleFont: {
          size: 16,
          family: CONSTANTS.FONT_FAMILY,
        },
        bodyFont: {
          size: 18,
        },
        footerFont: {
          size: 20, // there is no footer by default
        },
      },
      legend: {
        display: false,
        labels: {
          // This more specific font property overrides the global property
          font: {
            family: CONSTANTS.FONT_FAMILY, // Change X-axis labels font
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          //   maxRotation: isMobile ? 0 : 90,
          //   minRotation: isMobile ? 0 : 90,
          font: {
            family: CONSTANTS.FONT_FAMILY, // Change X-axis labels font
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: CONSTANTS.FONT_FAMILY, // Change X-axis labels font
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };
  // Detect screen width changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return <Bar data={chartData} options={options} />;
};

export default BarChart;

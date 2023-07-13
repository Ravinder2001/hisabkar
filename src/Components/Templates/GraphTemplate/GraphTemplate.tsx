import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import GetGraphByUserId from "../../../APIs/GetGraphByUserId";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { Logout } from "../../../store/slices/UserSlice";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import CircularLoader from "../../Atoms/Loader/CircularLoader/CircularLoader";
Chart.register(...registerables);
type DataType = {
  name: string;
  amount: string;
  color: string;
};
function GraphTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const User = useSelector((state: RootState) => state.UserSlice);
  const [Data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  const data = {
    labels: Data.map((item) => item.name),
    datasets: [
      {
        data: Data.map((item) => item.amount),
        backgroundColor: Data.map((item) => item.color),
        borderColor: "#c2bd23", // Change the line color here
        fill: false,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (text: any) {
            let label = "₹" + text.formattedValue;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14, // Change the font size
            weight: "normal", // Change the font weight
            color: "black", // Change the font color
          },
          color: "#23c2a2",
        },
        grid: {
          color: "#424242", // Change the color of the grid lines here
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14, // Change the font size
            weight: "normal", // Change the font weight
            color: "black", // Change the font color
          },
          color: "white",
        },
        grid: {
          color: "#424242", // Change the color of the grid lines here
        },
      },
    },
  };

  const FetchData = async () => {
    const res = await GetGraphByUserId({
      user_id: location.pathname.split("/")[2],
      guestUser: User.guestUser,
    });
    if (res.status == request_succesfully) {
      setData(res.data);
      setLoading(false);
    } else if (res?.response?.data?.status === Unauthorized) {
      localStorage.removeItem(localStorageKey);
      dispatch(Logout());
      navigate("/login");
      message.error(res?.response?.data?.message ?? "Something went wrong");
    } else {
      message.error(res?.response?.data?.message ?? "Something went wrong");
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loader}>
          <CircularLoader />
        </div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
}

export default GraphTemplate;

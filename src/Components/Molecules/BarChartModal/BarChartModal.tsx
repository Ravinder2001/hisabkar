import  { useState, useEffect } from "react";
import {  Modal, message } from "antd";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";

import GetGraphByGroupId from "../../../APIs/GetGraphByGroupId";
import { RootState } from "../../../store/store";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { Logout } from "../../../store/slices/UserSlice";
import BarLoader from "../../Atoms/Loader/BarLoader/BarLoader";

import styles from "./styles.module.css";

Chart.register(...registerables);

type ModalProps = {
  group_id: string;
  name: string;
  handleModal: () => void;
  open: boolean;
};
type DataType = {
  name: string;
  amount: string;
  color: string;
};

const BarChartModal = (props: ModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { open, handleModal, group_id, name } = props;
  const GuestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );

  const [Data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleOk = () => {
    handleModal();
  };

  const GetData = async () => {
    setLoading(true);
    const res = await GetGraphByGroupId({ group_id, guestUser: GuestUser });
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

  const data = {
    labels: Data.map((item) => item.name),
    datasets: [
      {
        data: Data.map((item) => item.amount),
        backgroundColor: Data.map((item) => item.color),
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (text:any) {
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
            weight: "bold", // Change the font weight
            color: "black", // Change the font color
          },
          color:"black"
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
          color:"black"
        },
      },
    },
  };

  useEffect(() => {
    if (open) {
      GetData();
    }
  }, [open]);

  return (
    <Modal
      title={`${name}`}
      open={open}
      onOk={handleOk}
      onCancel={handleModal}
      className={styles.modal}
      footer={null}
      centered
      width={900}
    >
      {loading ? (
        <div className={styles.loader}>
          <BarLoader/>
        </div>
      ) : (
        <div className={styles.box}>
          <Bar data={data} options={options} />
        </div>
      )}
    </Modal>
  );
};

export default BarChartModal;

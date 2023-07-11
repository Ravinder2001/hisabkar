import { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";

import styles from "./styles.module.css";
import ReactIcons from "../ReactIcons/ReactIcons";
import GetUniquePairsNames from "../../../APIs/GetUniquePairsNames";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../utils/Constants";
import { Logout } from "../../../store/slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GetWhatsappData from "../../../APIs/GetWhatsappData";
type ModalBoxProps = {
  url: string;
  open: boolean;
  handleClose: () => void;
  group_id: string;
};

type listType = {
  id: string;
  name: string;
};

export default function BillModalBox(props: ModalBoxProps) {
  const { open, handleClose, url, group_id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState<listType[]>([]);

  const FetchList = async () => {
    const res = await GetUniquePairsNames(group_id);
    if (res?.status == request_succesfully) {
      setData(res?.data);
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };
  const renderWhats = (jsonData: any) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let message = "";

    if (jsonData) {
      const { name, sending, receiving, sendingamount, receivingamount } =
        jsonData;

      // Formatting the receiving list
      const receivingList = receiving
        ?.map(
          (item: any, index: any) => `${index + 1}) ${item.name}-₹${item.amount}`
        )
        ?.join("\n");

      // Formatting the sending list
      const sendingList = sending
        ?.map(
          (item: any, index: any) => `${index + 1}) ${item.name}-₹${item.amount}`
        )
        ?.join("\n");

      // Constructing the final message
      message = `Hi ${name}\n\nYou are going to receive ₹${receivingamount} ${
        receiving?.length
          ? `from ${receiving?.length ?? 0} people:\n${receivingList}`
          : ""
      }\n\nAnd you have to send ₹${sendingamount} ${
        sending?.length ? `to ${sending?.length} people:\n${sendingList}` : ""
      }`;
    }

    let Newurl = "";

    if (isMobile) {
      // Open WhatsApp if installed on mobile
      Newurl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else {
      // Open WhatsApp Web on desktop
      Newurl = `https://web.whatsapp.com/send?text=${encodeURIComponent(
        message
      )}`;
    }

    window.open(Newurl, "_blank");
  };

  const handleClick = async (e: string) => {
    const res = await GetWhatsappData({ group_id, user_id: e });
    console.log("ayaa", res.data);
    renderWhats(res.data);
  };

  useEffect(() => {
    if (open) {
      FetchList();
    }
  });

  return (
    <div>
      <Modal
        title="Share this link with your friends"
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
        width={400}
      >
        <div>
          {data.map((item, index) => (
            <div key={item.id} className={styles.con}>
              <div className={styles.name}>
                {index + 1}) {item.name}
              </div>
              <Button
                className={styles.btn}
                onClick={() => handleClick(item.id)}
              >
                <span style={{ marginRight: "5px" }}>
                  <ReactIcons name="BsWhatsapp" size={13} color="white" />
                </span>
                WhatsApp
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

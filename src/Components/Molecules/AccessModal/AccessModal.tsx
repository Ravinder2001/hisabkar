import { useEffect, useState, ChangeEvent } from "react";
import { Button, Modal, message } from "antd";

import styles from "./styles.module.css";
import ReactIcons from "../../Atoms/ReactIcons/ReactIcons";
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
import CircularLoader from "../../Atoms/Loader/CircularLoader/CircularLoader";
import GetGroupAccessReport from "../../../APIs/GetGroupAccessReport";
import ToogleSwitch from "../../Atoms/ToogleSwitch/ToogleSwitch";
import Button3 from "../../Atoms/Button/Button3/Button3";
import ToogleSwitch2 from "../../Atoms/ToogleSwitch2/ToogleSwitch2";
import PostGroupRelation from "../../../APIs/PostGroupRelation";
import DeleteRelation from "../../../APIs/DeleteRelation";
import ConfirmPop from "../ConfirmPop/ConfirmPop";
type ModalBoxProps = {
  open: boolean;
  handleClose: () => void;
  group_id: string;
};

type dataType = {
  id: number;
  user_email: string;
  edit: boolean;
};

export default function AccessModal(props: ModalBoxProps) {
  const { open, handleClose, group_id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Data, setData] = useState<dataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [text, setText] = useState("");
  const [Toogle, setToogle] = useState(true);
  const [Error, setError] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleToogle = () => {
    setToogle(!Toogle);
  };

  const fetchAccess = async () => {
    const res = await GetGroupAccessReport(group_id);
    if (res?.status === request_succesfully) {
      setData(res?.data);
      setLoading(false);
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };

  const isEmailValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    if (!Error) {
      let object = {
        group_id,
        email: text,
        edit: Toogle,
      };
      const res = await PostGroupRelation(object);
      if (res?.status === request_succesfully) {
        message.success(res.message);
        fetchAccess();
        setSubmitLoading(false);
      } else if (res.response.data.status === Unauthorized) {
        dispatch(Logout());
        localStorage.removeItem(localStorageKey);
        navigate("/login");
        message.error(res.response.data.message ?? "Something went wrong");
      } else {
        message.error(res.response.data.message ?? "Something went wrong");
        setSubmitLoading(false);
      }
    }
  };

  const handleDelete = async (e: number) => {
    const res = await DeleteRelation(e);
    if (res?.status === request_succesfully) {
      message.success(res.message);
      fetchAccess();
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchAccess();
    }
  }, [open]);

  useEffect(() => {
    if (text === "") {
      setError(true);
    } else if (text.length > 0 && isEmailValid(text)) {
      setError(false);
    }
  }, [text]);

  return (
    <div>
      <Modal
        title="Access to this group"
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
        wrapClassName={styles.modal}
        // width={400}
      >
        {loading ? (
          <div>
            <CircularLoader />
          </div>
        ) : (
          <div>
            <div className={styles.inputBox}>
              <div style={{ width: "50%" }}>
                <input
                  type="text"
                  value={text}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Email Address"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className={styles.edit}>Edit Access</div>
                <div style={{ marginTop: "5px" }} className={styles.toogle}>
                  <ToogleSwitch value={Toogle} handleChange={handleToogle} />
                </div>
              </div>
              <div>
                <Button3
                  onClick={handleSubmit}
                  Error={Error}
                  Loading={submitLoading}
                />
              </div>
            </div>
            {Data.length && (
              <div>
                <div className={styles.listHead}>
                  Already Access to these people
                </div>
                <div>
                  {Data.map((item) => (
                    <div key={item.id} className={styles.editCon}>
                      <div className={styles.name}>{item.user_email}</div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* <div className={styles.edit}>Edit Access</div> */}
                        <div style={{ marginTop: "5px" }}>
                          <ToogleSwitch2 open={item.edit} id={item.id} />
                        </div>
                      </div>
                      <div style={{ marginTop: "3px", cursor: "pointer" }}>
                        <ConfirmPop
                          title="Remove Access"
                          des="Are you sure to remove this user?"
                          Submit={() => handleDelete(item.id)}
                          component={
                            <Button className={styles.btn} danger>
                              Delete
                            </Button>
                          }
                        />
                        {/* <ReactIcons name="AiFillDelete" size={20} /> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

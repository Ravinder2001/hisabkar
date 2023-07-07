import { useState, useEffect } from "react";
import Spliter from "../../../Molecules/Spliter/Spliter";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import SimpleAccordion from "../../../Molecules/Accordian/Accordian";
import BillBox from "../../../Molecules/BillBox/BillBox";
import { GroupDataType } from "../../../Templates/DashboardTemplate/DashboardTemplate";
import GetExpensesById from "../../../../APIs/GetExpensesById";
import {
  Unauthorized,
  localStorageKey,
  request_succesfully,
} from "../../../../utils/Constants";
import GetPairsByGroupId from "../../../../APIs/GetPairsByGroupId";
import { toogleAmount } from "../../../../store/slices/OtherSlice";
import { Logout } from "../../../../store/slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import BarLoader from "../../../Atoms/Loader/BarLoader/BarLoader";
type MainProps = {
  GroupData: GroupDataType;
};

type ExpensesListType = {
  id: number;
  amount: number;
  timestamp: string;
  paidby: string;
  expensemembers: { member_name: string; amount: number; image: string }[];
};
type BillListType = {
  id: number;
  amount: number;
  sender: string;
  sender_id: string;
  receiver: string;
  receiver_id: string;
};

function Main(props: MainProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );
  const SenderFilter = useSelector(
    (state: RootState) => state.FilterSlice.senderFilter
  );
  const ReceiverFilter = useSelector(
    (state: RootState) => state.FilterSlice.receiverFilter
  );
  const [ExpensesList, setExpenseList] = useState<ExpensesListType[]>([]);
  const [BillList, setBillList] = useState<BillListType[]>([]);
  const [TempBillList, setTempBillList] = useState<BillListType[]>([]);
  const [flag, setFlag] = useState(false);

  const [ExpenseLoader, setExpenseLoader] = useState(true);
  const [PairLoader, setPairLoader] = useState(true);

  const toogleFlag = () => {
    setFlag(!flag);
  };

  const ExpensesListFetch = async () => {
    let object = {
      group_id: props.GroupData.group_id,
      guestUser,
    };
    const res = await GetExpensesById(object);
    if (res.status == request_succesfully) {
      setExpenseList(res.data);
      setExpenseLoader(false);
    } else if (res.response.data.status === Unauthorized) {
      localStorage.removeItem(localStorageKey);
      dispatch(Logout());
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      setExpenseLoader(false);
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };
  const PairsListFetch = async () => {
    let object = {
      group_id: props.GroupData.group_id,
      guestUser,
    };
    const res = await GetPairsByGroupId(object);
    if (res.status == request_succesfully) {
      setBillList(res.data);
      setTempBillList(res.data);
      setPairLoader(false);
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      message.error(res.response.data.message ?? "Something went wrong");
    } else {
      setPairLoader(false);
      message.error(res.response.data.message ?? "Something went wrong");
    }
  };

  useEffect(() => {
    setExpenseLoader(true);
    setPairLoader(true);
    ExpensesListFetch();
    PairsListFetch();
  }, [flag]);

  useEffect(() => {
    if (ExpensesList.length) {
      const total = ExpensesList.reduce((prev, curr) => {
        return prev + curr.amount;
      }, 0);
      dispatch(toogleAmount(total));
    } else {
      dispatch(toogleAmount(0));
    }
  }, [ExpensesList]);

  useEffect(() => {
    let filteredData = TempBillList;

    if (SenderFilter !== "All") {
      filteredData = filteredData.filter(
        (item) => item.sender_id === SenderFilter
      );
    }

    if (ReceiverFilter !== "All") {
      filteredData = filteredData.filter(
        (item) => item.receiver_id === ReceiverFilter
      );
    }

    setBillList(filteredData);
  }, [SenderFilter, ReceiverFilter, BillList]);

  return (
    <div className={styles.container}>
      {!guestUser && (
        <div className={styles.spliter}>
          <Spliter GroupData={props.GroupData} toogleFlag={toogleFlag} />
        </div>
      )}

      <div className={styles.accordian}>
        {ExpenseLoader ? (
          <div className={styles.loader}>
            <BarLoader />
          </div>
        ) : (
          ExpensesList.length?<>
          {ExpensesList.map((item, index) => (
            <div key={index} className={styles.accordianBox}>
              <SimpleAccordion
                id={item.id}
                amount={item.amount}
                paidBy={item.paidby}
                memberList={item.expensemembers}
              />
            </div>
          ))}
        </>:<div className={styles.noData}>No Expenses Found!</div>
        )}
      </div>
      <div className={styles.splitCon}>
        {PairLoader ? (
          <div className={styles.loader}>
            <BarLoader />
          </div>
        ) : BillList.length ? (
          <>
            {BillList.map((item, index) => (
              <div key={index}>
                <BillBox
                  receiver={item.receiver}
                  sender={item.sender}
                  amount={item.amount}
                />
              </div>
            ))}
          </>
        ) : (
          <div className={styles.noData}>No Billing Pairs Found!</div>
        )}
      </div>
    </div>
  );
}

export default Main;

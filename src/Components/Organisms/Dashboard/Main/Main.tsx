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
import { toast } from "react-toastify";
import { ErroToast } from "../../../../utils/ToastStyle";
import GetPairsByGroupId from "../../../../APIs/GetPairsByGroupId";
import { toogleAmount } from "../../../../store/slices/OtherSlice";
import { Logout } from "../../../../store/slices/UserSlice";
import { useNavigate } from "react-router-dom";

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
  receiver: string;
};

function Main(props: MainProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const guestUser = useSelector(
    (state: RootState) => state.UserSlice.guestUser
  );
  const [ExpensesList, setExpenseList] = useState<ExpensesListType[]>([]);
  const [BillList, setBillList] = useState<BillListType[]>([]);
  const [flag, setFlag] = useState(false);

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
    } else if (res.response.data.status === Unauthorized) {
      localStorage.removeItem(localStorageKey);
      dispatch(Logout());
      navigate("/login");
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
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
    } else if (res.response.data.status === Unauthorized) {
      dispatch(Logout());
      localStorage.removeItem(localStorageKey);
      navigate("/login");
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };

  useEffect(() => {
    ExpensesListFetch();
    PairsListFetch();
  }, [flag]);

  useEffect(() => {
    if (ExpensesList.length) {
      const total = ExpensesList.reduce((prev, curr) => {
        return prev + curr.amount;
      }, 0);
      dispatch(toogleAmount(total));
    }
  }, [ExpensesList]);

  return (
    <div className={styles.container}>
      {!guestUser && (
        <div className={styles.spliter}>
          <Spliter GroupData={props.GroupData} toogleFlag={toogleFlag} />
        </div>
      )}

      <div className={styles.accordian}>
        {ExpensesList.map((item, index) => (
          <div key={index} className={styles.accordianBox}>
            <SimpleAccordion
              amount={item.amount}
              paidBy={item.paidby}
              memberList={item.expensemembers}
            />
          </div>
        ))}
      </div>
      <div className={styles.splitCon}>
        {BillList.map((item, index) => (
          <>
            {item.amount > 0 && (
              <BillBox
                key={index}
                receiver={item.receiver}
                sender={item.sender}
                amount={item.amount}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default Main;

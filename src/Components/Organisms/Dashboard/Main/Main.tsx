import { useState, useEffect } from "react";
import Spliter from "../../../Molecules/Spliter/Spliter";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import SimpleAccordion from "../../../Molecules/Accordian/Accordian";
import BillBox from "../../../Molecules/BillBox/BillBox";
import { GroupDataType } from "../../../Templates/DashboardTemplate/DashboardTemplate";
import GetExpensesById from "../../../../APIs/GetExpensesById";
import { request_succesfully } from "../../../../utils/Constants";
import { toast } from "react-toastify";
import { ErroToast } from "../../../../utils/ToastStyle";
import GetPairsByGroupId from "../../../../APIs/GetPairsByGroupId";

type MainProps = {
  GroupData: GroupDataType;
};

type ExpensesListType = {
  id: number;
  amount: number;
  timestamp: string;
  paidby: string;
  expensemembers: { member_name: string; amount: number }[];
};
type BillListType = {
  id: number;
  amount: number;
  sender: string;
  receiver: string;
};

function Main(props: MainProps) {
  const [ExpensesList, setExpenseList] = useState<ExpensesListType[]>([]);

  const [BillList, setBillList] = useState<BillListType[]>([]);
  console.log("🚀 ~ file: Main.tsx:37 ~ Main ~ BillList:", BillList)

  const ExpensesListFetch = async () => {
    const res = await GetExpensesById(props.GroupData.group_id);
    if (res.status == request_succesfully) {
      setExpenseList(res.data);
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };
  const PairsListFetch = async () => {
    const res = await GetPairsByGroupId(props.GroupData.group_id);
    if (res.status == request_succesfully) {
      setBillList(res.data);
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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.spliter}>
        <Spliter GroupData={props.GroupData} />
      </div>
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

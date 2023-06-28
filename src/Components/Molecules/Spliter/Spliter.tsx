import { useState, useEffect, ChangeEvent } from "react";
import InputBox1 from "../../Atoms/InputBox/InputBox1/InputBox1";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import SelectBox from "../../Atoms/SelectBox/SelectBox";
import Checkbox from "../../Atoms/Checkbox/Checkbox";
import Button2 from "../../Atoms/Button/Button2/Button2";
import { GroupDataType } from "../../Templates/DashboardTemplate/DashboardTemplate";
import PostExpense from "../../../APIs/PostExpense";
import moment from "moment";
import { toast } from "react-toastify";
import { ErroToast } from "../../../utils/ToastStyle";
import { request_succesfully } from "../../../utils/Constants";
import PutPairs, { PutPairsType } from "../../../APIs/PutPairs";

type PaymentForType = {
  member_id: string;
  member_name: string;
  checked: boolean;
};
type MainProps = {
  GroupData: GroupDataType;
};

function Spliter(props: MainProps) {
  const { group_id, group_members, group_name } = props.GroupData;

  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>(group_members[0].member_id);
  const [paymentFor, setPaymentFor] = useState<PaymentForType[] | []>([]);
  const [error, setError] = useState({
    amount: true,
    member: true,
    show: false,
  });

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSelectBox = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaidBy(e.target.value);
  };

  const handleCheckBox = (e: string) => {
    let temp = paymentFor.map((item) => {
      if (item.member_id === e) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setPaymentFor(temp);
  };

  const UpdatePairs = async (updatedObject: PutPairsType) => {
    let res = await PutPairs(updatedObject);
    if (res.status == request_succesfully) {
      alert("expense added sucessfully");
    } else {
      toast.error(
        res.response.data.message ?? "Something went wrong",
        ErroToast
      );
    }
  };

  const handleHisab = async () => {
    setError((prev) => {
      return { ...prev, show: true };
    });

    if (!error.amount && !error.member) {
      let memberActive = paymentFor
        .filter((item) => item.checked === true)
        .map((item) => {
          return item.member_id;
        });

      let object = {
        group_id,
        amount: parseInt(amount),
        paidBy: paidBy,
        members: memberActive,
        timestamp: moment(),
      };
      let perPersonAmount = Math.ceil(parseInt(amount) / memberActive.length);

      let updatedObject = {
        amount: Number(perPersonAmount),
        paidBy,
        group_id,
        members: memberActive,
      };
      let res = await PostExpense(object);
      if (res.status == request_succesfully) {
        UpdatePairs(updatedObject);
      } else {
        toast.error(
          res.response.data.message ?? "Something went wrong",
          ErroToast
        );
      }
    }
  };

  useEffect(() => {
    let MemberData = group_members.map((item: any) => {
      return { ...item, checked: true };
    });
    setPaymentFor(MemberData);
  }, [group_members]);

  useEffect(() => {
    if (amount.length > 0) {
      setError((prev) => {
        return { ...prev, amount: false };
      });
    } else {
      setError((prev) => {
        return { ...prev, amount: true };
      });
    }
    if (paymentFor.some((item) => item.checked === true)) {
      setError((prev) => {
        return { ...prev, member: false };
      });
    } else {
      setError((prev) => {
        return { ...prev, member: true };
      });
    }
  }, [amount, paymentFor]);

  return (
    <div className={styles.container}>
      <InputBox1
        value={amount}
        handleChange={handleAmountChange}
        placeholder="Amount"
        type="number"
      />
      {error.amount && error.show && <div>Please add amount</div>}
      <div className={styles.line}></div>
      <div className={styles.paid}>
        <div className={styles.paidText}>Paid By</div>
        <SelectBox
          handleChange={handleSelectBox}
          value={paidBy}
          options={group_members}
        />
      </div>
      <div className={styles.line}></div>
      <div className={styles.paid}>
        <div className={styles.paidText}>Payment for</div>
        <div className={styles.list}>
          {paymentFor.map((item) => (
            <div className={styles.checkCon} key={item.member_id}>
              <div>
                <Checkbox
                  id={item.member_id}
                  handleClick={handleCheckBox}
                  checked={item.checked}
                />
              </div>
              <div className={styles.checkName}>{item.member_name}</div>
            </div>
          ))}
        </div>
        {error.member && error.show && <div>Please add amount</div>}
      </div>
      <div className={styles.line}></div>
      <div className={styles.btn}>
        <Button2 handleClick={handleHisab} />
      </div>
    </div>
  );
}

export default Spliter;

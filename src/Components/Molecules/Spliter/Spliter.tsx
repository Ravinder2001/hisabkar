import { useState, useEffect, ChangeEvent } from "react";
import InputBox1 from "../../Atoms/InputBox/InputBox1/InputBox1";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import SelectBox from "../../Atoms/SelectBox/SelectBox";
import Checkbox from "../../Atoms/Checkbox/Checkbox";
import Button2 from "../../Atoms/Button/Button2/Button2";
import { addExpense, tooglePairs } from "../../../store/slices/SplitSlice";

type PaymentForType = {
  id: string;
  name: string;
  checked: boolean;
};

function Spliter() {
  const dispatch = useDispatch();
  const MemberList = useSelector(
    (state: RootState) => state.AddGroupSlice.MemberList
  );
  const MemberPairs = useSelector((state: RootState) => state.SplitSlice.pairs);

  const [amount, setAmount] = useState<string>("111");
  const [paidBy, setPaidBy] = useState<string>(MemberList?.[0].name);
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
      if (item.id === e) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setPaymentFor(temp);
  };

  const FetchName = (e: string) => {
    const member = MemberList.find((item) => item.id === e);
    const name = member ? member.name : "";
    return name;
  };

  const handleHisab = () => {
    setError((prev) => {
      return { ...prev, show: true };
    });

    if (!error.amount && !error.member) {
      let memberActive = paymentFor
        .filter((item) => item.checked === true)
        .map((item) => {
          return { id: item.id, name: item.name };
        });

      let object = {
        amount: parseInt(amount),
        paidBy: paidBy,
        member: memberActive,
      };
      let perPersonAmount = (parseInt(amount) / memberActive.length).toFixed(2);

      let updatedMemberPairs = MemberPairs.map((memberPair) => {
        if (memberPair.receiver === paidBy) {
          let index = memberActive.findIndex(
            (item: any) => item.name === memberPair.sender
          );

          if (index !== -1) {
            return {
              ...memberPair,
              amount: memberPair.amount + Number(perPersonAmount),
            };
            // MemberPairs[i].amount += Number(perPersonAmount);
          }
        }
        return memberPair;
      });
      dispatch(tooglePairs(updatedMemberPairs));
      dispatch(addExpense(object));
    }
  };

  useEffect(() => {
    let MemberData = MemberList.map((item) => {
      return { ...item, checked: true };
    });
    setPaymentFor(MemberData);
  }, [MemberList]);

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
          options={MemberList}
        />
      </div>
      <div className={styles.line}></div>
      <div className={styles.paid}>
        <div className={styles.paidText}>Payment for</div>
        <div className={styles.list}>
          {paymentFor.map((item) => (
            <div className={styles.checkCon} key={item.id}>
              <div>
                <Checkbox
                  id={item.id}
                  handleClick={handleCheckBox}
                  checked={item.checked}
                />
              </div>
              <div className={styles.checkName}>{item.name}</div>
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

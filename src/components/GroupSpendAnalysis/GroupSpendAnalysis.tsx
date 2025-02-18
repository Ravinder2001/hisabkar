import React, { useEffect, useState } from "react";
import ModalComponent from "../ModalComponent/ModalComponent";
import useApiFetch from "../../hooks/useAPIFetch";
import CONSTANTS from "../../utils/constant/Constant";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";
import styles from "./style.module.css";
import BarChart from "../ChartComponents/BarChart";
import CustomSelect from "../CustomSelect/CustomSelect";
import { MemberType, OptionType } from "../../utils/comman/CommanTypes";

type PropsType = {
  groupId: string;
  isOpen: boolean;
  setIsOpen: () => void;
  groupMembers: MemberType;
};

type LogType = {
  expense_type: string;
  total_amount_spent: string;
};

function GroupSpendAnalysis(props: PropsType) {
  const groupMembersWithAll: MemberType = [{ id: "-1", name: "All", avatar: "", total_spent: 0, is_available: true }, ...props.groupMembers];

  const { fetchData, response, isLoading } = useApiFetch("");

  const [barData, setBarData] = useState<LogType[]>([]);
  const [selectedMember, setSelectedMember] = useState<OptionType>({
    value: "-1",
    label: "All",
  });

  useEffect(() => {
    fetchData(CONSTANTS.API_ROUTES.SPEND_ANALYSIS + "/" + props.groupId + "/" + selectedMember.value);
  }, [props.groupId, selectedMember]);

  useEffect(() => {
    if (response?.success == 1) {
      setBarData(response.data);
    }
  }, [response]);
  return (
    <ModalComponent isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <div className={styles.container}>
        <h1 className="text-3xl font-bold mb-2 text-center">Spend Analysis</h1>
        <div className={styles.selectBox}>
          <CustomSelect
            options={groupMembersWithAll.map((type) => ({
              value: type.id,
              label: type.name,
            }))}
            onChange={(option: OptionType) => setSelectedMember(option)}
            placeholder="Select expense type"
            value={selectedMember}
            isSearchable={false}
          />
        </div>
        {isLoading ? (
          <div className="w-full h-full flex justify-center">
            <CustomCircularLoading />
          </div>
        ) : (
          <BarChart data={barData} />
        )}
      </div>
    </ModalComponent>
  );
}

export default GroupSpendAnalysis;

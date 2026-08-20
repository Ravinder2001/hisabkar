import React, { useState, useEffect } from "react";
import { Target } from "lucide-react";
import useApiFetch from "../../hooks/useAPIFetch";
import CircularProgress from "./CircularProgress";
import ModalComponent from "../ModalComponent/ModalComponent";
import CustomCircularLoading from "../Atoms/CustomCircularLoading/CustomCircularLoading";
import styles from "./style.module.css";

interface BudgetSetterProps {
  groupId: string;
  onBudgetSet: () => void;
}

export default function BudgetSetter({ groupId, onBudgetSet }: BudgetSetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [budgetVal, setBudgetVal] = useState("");
  const [budgetData, setBudgetData] = useState({ budget: 0, total_spent: 0 });

  const { fetchData: fetchBudgetDetails, response: budgetRes } = useApiFetch("/group/budgetDetails/" + groupId);
  const { fetchData: updateBudget, response: updateRes, isLoading } = useApiFetch("/group/setBudget/" + groupId);

  useEffect(() => {
    fetchBudgetDetails();
  }, [groupId]);

  useEffect(() => {
    if (budgetRes?.success === 1) {
      setBudgetData(budgetRes.data);
      setBudgetVal(budgetRes.data.budget > 0 ? budgetRes.data.budget.toString() : "");
    }
  }, [budgetRes]);

  const handleSave = async () => {
    if (!budgetVal || isNaN(Number(budgetVal))) return;
    await updateBudget(undefined, {
      method: "POST",
      data: { budget: Number(budgetVal) },
    });
  };

  useEffect(() => {
    if (updateRes?.success === 1) {
      setIsOpen(false);
      fetchBudgetDetails();
      onBudgetSet();
    }
  }, [updateRes]);

  const currentBudget = budgetData.budget;
  const totalSpent = budgetData.total_spent;
  const percentage = currentBudget > 0 ? Math.min(100, Math.round((totalSpent / currentBudget) * 100)) : 0;
  const remaining = currentBudget > 0 ? Math.max(0, currentBudget - totalSpent) : 0;

  return (
    <>
      <button
        type="button"
        className={`hk-icon-btn ${styles.trigger} ${currentBudget > 0 ? styles.triggerRing : ""}`}
        title="Group Budget"
        onClick={() => setIsOpen(true)}
      >
        {currentBudget > 0 ? <CircularProgress percentage={percentage} /> : <Target size={16} />}
      </button>

      <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={styles.container}>
          <div className={styles.title}>Your Group Budget</div>

          {currentBudget > 0 && (
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Total Budget</span>
                <span style={{ color: "var(--hk-ink)" }}>₹{Number(currentBudget).toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Spent</span>
                <span style={{ color: "var(--hk-negative)" }}>₹{Number(totalSpent).toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Remaining</span>
                <span style={{ color: "var(--hk-positive)" }}>₹{Number(remaining).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className={styles.form}>
            <input
              type="number"
              placeholder="Budget amount"
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className={styles.input}
            />
            <button type="button" className={`hk-btn-primary ${styles.saveBtn}`} onClick={handleSave} disabled={isLoading}>
              {isLoading ? <CustomCircularLoading /> : "Save"}
            </button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
}

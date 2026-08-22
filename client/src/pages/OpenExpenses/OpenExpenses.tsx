import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CONSTANTS from "../../utils/constant/Constant";
import GroupsView from "../../components/OpenExpenses/GroupsView";
import GroupView from "../../components/OpenExpenses/GroupView";
import ExpenseForm from "../../components/OpenExpenses/ExpenseForm";
import SettlementsView from "../../components/OpenExpenses/SettlementsView";
import styles from "./style.module.css";

// Types
interface Member {
  id: string;
  name: string;
}

interface ExpenseShare {
  memberId: string;
  amount: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  shares: ExpenseShare[];
  date: string;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

// Utility functions
export const generateId = () => Math.random().toString(36).substr(2, 9);

const saveToStorage = (groups: Group[]) => {
  localStorage.setItem("expenseTrackerGroups", JSON.stringify(groups));
};

const loadFromStorage = (): Group[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("expenseTrackerGroups");
  return stored ? JSON.parse(stored) : [];
};

// Settlement calculation algorithm
export const calculateSettlements = (group: Group): Settlement[] => {
  const balances: { [memberId: string]: number } = {};

  // Initialize balances
  group.members.forEach((member) => {
    balances[member.id] = 0;
  });

  // Calculate net balances
  group.expenses.forEach((expense) => {
    // Add amount paid
    balances[expense.paidBy] += expense.amount;

    // Subtract shares owed
    expense.shares.forEach((share) => {
      balances[share.memberId] -= share.amount;
    });
  });

  // Separate creditors and debtors
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ id: memberId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id: memberId, amount: -balance });
    }
  });

  // Calculate settlements using greedy algorithm
  const settlements: Settlement[] = [];
  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    if (settleAmount > 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: settleAmount,
      });
    }

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
};

export default function ExpenseTracker() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentView, setCurrentView] = useState<"groups" | "group" | "addExpense" | "editExpense" | "settlements">("groups");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Load data on mount
  useEffect(() => {
    setGroups(loadFromStorage());
  }, []);

  // Save data whenever groups change
  useEffect(() => {
    if (groups.length > 0) {
      saveToStorage(groups);
    }
  }, [groups]);

  const createGroup = (name: string, memberNames: string[]) => {
    const members: Member[] = memberNames
      .map((name) => ({
        id: generateId(),
        name: name.trim(),
      }))
      .filter((member) => member.name);

    const newGroup: Group = {
      id: generateId(),
      name,
      members,
      expenses: [],
    };

    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroup(newGroup);
    setCurrentView("group");
  };

  const addExpense = (expense: Omit<Expense, "id" | "date">) => {
    if (!selectedGroup) return;

    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      date: new Date().toISOString(),
    };

    const updatedGroup = {
      ...selectedGroup,
      expenses: [...selectedGroup.expenses, newExpense],
    };

    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
    setCurrentView("group");
  };

  const updateExpense = (expense: Omit<Expense, "date">) => {
    if (!selectedGroup) return;

    const updatedGroup = {
      ...selectedGroup,
      expenses: selectedGroup.expenses.map((e) => (e.id === expense.id ? { ...expense, date: e.date } : e)),
    };

    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
    setEditingExpense(null);
    setCurrentView("group");
  };

  const deleteExpense = (expenseId: string) => {
    if (!selectedGroup) return;

    const updatedGroup = {
      ...selectedGroup,
      expenses: selectedGroup.expenses.filter((e) => e.id !== expenseId),
    };

    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
  };

  const addMember = (name: string) => {
    if (!selectedGroup) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const updatedGroup = {
      ...selectedGroup,
      members: [...selectedGroup.members, { id: generateId(), name: trimmedName }],
    };

    setGroups((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
      setCurrentView("groups");
    }
  };

  const getMemberName = (memberId: string) => {
    return selectedGroup?.members.find((m) => m.id === memberId)?.name || "Unknown";
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          aria-label="Go back"
          onClick={() => {
            if (currentView === "groups") {
              navigate(CONSTANTS.PROJECT_ROUTES.HOME);
            } else if (currentView === "group") {
              setCurrentView("groups");
              setSelectedGroup(null);
            } else {
              setCurrentView("group");
            }
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className={styles.title}>
          {currentView === "groups" && "Expense Tracker"}
          {currentView === "group" && selectedGroup?.name}
          {currentView === "addExpense" && "Add Expense"}
          {currentView === "editExpense" && "Edit Expense"}
          {currentView === "settlements" && "Settle Up"}
        </h1>
      </header>

      <main className={styles.main}>
        {currentView === "groups" && (
          <GroupsView
            groups={groups}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setCurrentView("group");
            }}
            onCreateGroup={createGroup}
            onDeleteGroup={deleteGroup}
          />
        )}

        {currentView === "group" && selectedGroup && (
          <GroupView
            group={selectedGroup}
            onAddExpense={() => setCurrentView("addExpense")}
            onEditExpense={(expense) => {
              setEditingExpense(expense);
              setCurrentView("editExpense");
            }}
            onDeleteExpense={deleteExpense}
            onAddMember={addMember}
            onSettleUp={() => setCurrentView("settlements")}
            getMemberName={getMemberName}
          />
        )}

        {currentView === "addExpense" && selectedGroup && <ExpenseForm group={selectedGroup} onSubmit={addExpense} />}

        {currentView === "editExpense" && selectedGroup && editingExpense && (
          <ExpenseForm group={selectedGroup} expense={editingExpense} onSubmit={updateExpense} />
        )}

        {currentView === "settlements" && selectedGroup && <SettlementsView group={selectedGroup} getMemberName={getMemberName} />}
      </main>
    </div>
  );
}

export type { Member, ExpenseShare, Expense, Group, Settlement };

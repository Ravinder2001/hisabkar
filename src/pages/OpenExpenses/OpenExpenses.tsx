import type React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import GroupsView from "../../components/OpenExpenses/GroupsView";
import GroupView from "../../components/OpenExpenses/GroupView";
import ExpenseForm from "../../components/OpenExpenses/ExpenseForm";
import SettlementsView from "../../components/OpenExpenses/SettlementsView";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== "groups" && (
                <button
                  onClick={() => {
                    if (currentView === "group") {
                      setCurrentView("groups");
                      setSelectedGroup(null);
                    } else {
                      setCurrentView("group");
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {currentView === "groups" && "Expense Tracker"}
                {currentView === "group" && selectedGroup?.name}
                {currentView === "addExpense" && "Add Expense"}
                {currentView === "editExpense" && "Edit Expense"}
                {currentView === "settlements" && "Settle Up"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
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

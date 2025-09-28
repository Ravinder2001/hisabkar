import React, { useState, useEffect } from "react";
import { Users, Receipt, Calculator, Plus, Edit2, Trash2 } from "lucide-react";
import Modal from "react-modal";
import type { Group, Expense } from "../../pages/OpenExpenses/OpenExpenses";

interface GroupViewProps {
  group: Group;
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onSettleUp: () => void;
  getMemberName: (memberId: string) => string;
}

export default function GroupView({ group, onAddExpense, onEditExpense, onDeleteExpense, onSettleUp, getMemberName }: GroupViewProps) {
  const totalExpenses = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openDeleteModal = (expense: Expense) => {
    setExpenseToDelete(expense);
    setModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setModalIsOpen(false);
    setExpenseToDelete(null);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      onDeleteExpense(expenseToDelete.id);
      closeDeleteModal();
    }
  };

  // Function to calculate total spent by a member
  const getTotalSpent = (memberId: string) => {
    return group.expenses
      .filter((exp) => exp.paidBy === memberId)
      .reduce((sum, exp) => sum + exp.amount, 0)
      .toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Group Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Members</p>
              <p className="text-xl font-semibold">{group.members.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <Receipt className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-xl font-semibold">{group.expenses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-semibold">₹{totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onAddExpense}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
        <button
          onClick={onSettleUp}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Calculator className="w-5 h-5" />
          <span>Settle Up</span>
        </button>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Members</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {group.members.map((member) => (
            <div key={member.id} className={`bg-gray-50 rounded-lg p-3 text-center`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-semibold">{member.name.charAt(0).toUpperCase()}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500 mt-1">Spent: ₹{getTotalSpent(member.id)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Expenses</h3>
        </div>
        {group.expenses.length === 0 ? (
          <div className="p-6 text-center">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No expenses yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {group.expenses
              .slice()
              .reverse()
              .map((expense) => (
                <div key={expense.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{expense.description}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Paid by {getMemberName(expense.paidBy)} • ₹{expense.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button onClick={() => onEditExpense(expense)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => openDeleteModal(expense)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* React Modal for Delete Confirmation */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className={`bg-white rounded-lg shadow-lg p-6 outline-none ${isMobile ? "mx-4 w-[90%] mt-40" : "max-w-md mx-auto mt-40"}`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
        ariaHideApp={false}
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">
          Are you sure you want to delete <strong>{expenseToDelete?.description}</strong> expense? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button onClick={closeDeleteModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

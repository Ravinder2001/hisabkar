import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  group_name: string;
  group_type: string;
  group_members: { id: string; name: string; avatar: string }[];
  expenses: {
    id: string;
    amount: number;
    paidByName: string;
    paidById: string;
    amountPerPerson: number;
    members: { id: string; name: string; avatar: string; amount: number }[];
  }[];
  pairs: {
    id: string;
    sender: string;
    receiver: string;
    amount: number;
  }[];
}

const initialState: UserState = {
  group_name: "",
  group_type: "",
  group_members: [],
  expenses: [],
  pairs: [],
};

const ExpenseSlice = createSlice({
  name: "ExpenseSlice",
  initialState,
  reducers: {
    CreateGroup: (state, action: PayloadAction<{ name: string; type: string }>) => {
      state.group_name = action.payload.name;
      state.group_type = action.payload.type;
    },
    AddGroupMembers: (state, action: PayloadAction<{ id: string; name: string; avatar: string }[]>) => {
      state.group_members = action.payload;
    },

    AddExpense: (
      state,
      action: PayloadAction<{
        id: string;
        amount: number;
        paidByName: string;
        paidById: string;
        amountPerPerson: number;
        members: { id: string; name: string; avatar: string; amount: number }[];
      }>
    ) => {
      state.expenses.push(action.payload);
    },
    AddPairs: (
      state,
      action: PayloadAction<
        {
          id: string;
          sender: string;
          receiver: string;
          amount: number;
        }[]
      >
    ) => {
      state.pairs = action.payload;
    },
    TooglePairs: (
      state,
      action: PayloadAction<{
        ids: string[]; // Change to an array of strings
        paidby: string;
        amount: number;
      }>
    ) => {
      const { ids, paidby, amount } = action.payload;
      ids.forEach((id) => {
        state.pairs = state.pairs.map((pair) => {
          if (pair.id == id) {
            return {
              ...pair,
              amount: pair.receiver === paidby ? pair.amount + amount : pair.sender === paidby ? pair.amount - amount : pair.amount,
            };
          }
          return pair;
        });
      });
    },
    DeleteExpense: (state, action: PayloadAction<string>) => {
      const updatedExpenses = state.expenses.filter((expense) => expense.id !== action.payload);
      return {
        ...state,
        expenses: updatedExpenses,
      };
    },
    SubtractPairs: (
      state,
      action: PayloadAction<{
        ids: string[]; // Array of member IDs
        paidby: string;
        amount: number;
      }>
    ) => {
      const { ids, paidby, amount } = action.payload;

      state.pairs = state.pairs.map((pair) => {
        if ((pair.receiver === paidby && ids.includes(pair.sender)) || (pair.sender === paidby && ids.includes(pair.receiver))) {
          return {
            ...pair,
            amount: pair.receiver === paidby ? pair.amount - amount : pair.sender === paidby ? pair.amount + amount : pair.amount,
          };
        }
        return pair;
      });
    },
  },
});

export const { CreateGroup, AddGroupMembers, AddExpense, AddPairs, TooglePairs, DeleteExpense, SubtractPairs } = ExpenseSlice.actions;
export default ExpenseSlice.reducer;

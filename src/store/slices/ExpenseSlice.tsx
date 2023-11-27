import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  group_name: string;
  group_type: string;
  group_members: { id: string; name: string; avatar: string; checked: boolean }[];
  expenses: {
    id: string;
    amount: number;
    paidByName: string;
    paidById: string;
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
    AddGroupMembers: (state, action: PayloadAction<{ id: string; name: string; avatar: string; checked: boolean }[]>) => {
      state.group_members = action.payload;
    },
    ToogleCheck: (state, action: PayloadAction<string>) => {
      state.group_members.map((member) => {
        if (member.id == action.payload) {
          member.checked = !member.checked;
        }
      });
    },
    AddExpense: (
      state,
      action: PayloadAction<{
        id: string;
        amount: number;
        paidByName: string;
        paidById: string;
        members: { id: string; name: string; avatar: string; amount: number }[];
      }>
    ) => {
      console.log("action", action.payload);
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
        ids: { id: string; amount: number }[]; // Change to an array of strings
        paidby: string;
      }>
    ) => {
      const { ids, paidby } = action.payload;
      ids.forEach((id) => {
        state.pairs = state.pairs.map((pair) => {
          if (pair.id == id.id) {
            return {
              ...pair,
              amount: pair.receiver === paidby ? pair.amount + id.amount : pair.sender === paidby ? pair.amount - id.amount : pair.amount,
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
        ids: { id: string; amount: number }[]; // Updated structure for member IDs
        paidby: string;
      }>
    ) => {
      const { ids, paidby } = action.payload;

      state.pairs = state.pairs.map((pair) => {
        const isReceiver = pair.receiver === paidby;
        const isSender = pair.sender === paidby;

        if ((isReceiver || isSender) && ids.some((member) => member.id === pair.sender || member.id === pair.receiver)) {
          const senderAmount = ids.find((member) => member.id === pair.sender)?.amount || 0;
          const receiverAmount = ids.find((member) => member.id === pair.receiver)?.amount || 0;

          return {
            ...pair,
            amount: isReceiver ? pair.amount - senderAmount : isSender ? pair.amount + receiverAmount : pair.amount,
          };
        }

        return pair;
      });
    },
    HandleDelete: (state) => {
      state.group_name = "";
      state.group_type = "";
      state.group_members = [];
      state.expenses = [];
      state.pairs = [];
    },
    HandleRecover: (
      state,
      action: PayloadAction<{
        group_name: string;
        group_type: string;
        group_members: { id: string; name: string; avatar: string; checked: boolean }[];
        expenses: {
          id: string;
          amount: number;
          paidByName: string;
          paidById: string;
          members: { id: string; name: string; avatar: string; amount: number }[];
        }[];
        pairs: {
          id: string;
          sender: string;
          receiver: string;
          amount: number;
        }[];
      }>
    ) => {
      state.group_name = action.payload.group_name;
      state.group_type = action.payload.group_type;
      state.group_members =action.payload.group_members;
      state.expenses = action.payload.expenses;
      state.pairs = action.payload.pairs;
    },
  },
});

export const {
  CreateGroup,
  AddGroupMembers,
  AddExpense,
  AddPairs,
  TooglePairs,
  DeleteExpense,
  SubtractPairs,
  ToogleCheck,
  HandleDelete,
  HandleRecover,
} = ExpenseSlice.actions;
export default ExpenseSlice.reducer;

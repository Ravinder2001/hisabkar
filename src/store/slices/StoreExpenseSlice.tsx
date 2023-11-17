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

const StoreExpenseSlice = createSlice({
  name: "StoreExpenseSlice",
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
      console.log("🚀  file: StoreExpenseSlice.tsx:78  amount:", amount)
      console.log("🚀  file: StoreExpenseSlice.tsx:78  paidby:", paidby)
      console.log("🚀  file: StoreExpenseSlice.tsx:78  ids:", ids)
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
  },
});

export const { CreateGroup, AddGroupMembers, AddExpense, AddPairs, TooglePairs } = StoreExpenseSlice.actions;
export default StoreExpenseSlice.reducer;

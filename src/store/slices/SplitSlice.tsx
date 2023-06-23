import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SplitState {
  pairs: { id: number; receiver: string; sender: string; amount: number }[];
  expenses: {
    amount: number;
    paidBy: string;
    memberList: { id: string; name: string; amount: number }[];
  }[];
  billList: { receiver: string; sender: string; amount: number }[];
}
const initialState: SplitState = {
  pairs: [],
  expenses: [],
  billList: [],
};

type expensePayloadType = {
  amount: number;
  member: { id: string; name: string }[];
  paidBy: string;
};
type PairsPayloadType = {
  id: string;
  name: string;
};
type TooglePairsPayloadType = {
  id: number;
  receiver: string;
  sender: string;
  amount: number;
};
type BillListPayloadType = {
  receiver: string;
  sender: string;
  amount: number;
};

export const SplitSlice = createSlice({
  name: "Split",
  initialState,
  reducers: {
    addPairs: (state, action: PayloadAction<PairsPayloadType[]>) => {
      const MemberList = action.payload;
      const pairs = [];
      for (let i = 0; i < MemberList.length; i++) {
        for (let j = 0; j < MemberList.length; j++) {
          if (MemberList[i].id != MemberList[j].id) {
            let object: any = {
              id: pairs.length + 1,
              sender: MemberList[i].name,
              receiver: MemberList[j].name,
              amount: 0,
            };
            pairs.push(object);
            state.pairs.push(object);
          }
        }
      }

      // console.log(pairs);
    },
    addExpense: (state, action: PayloadAction<expensePayloadType>) => {
      const { amount, member, paidBy } = action.payload;
      let perPersonAmount = (amount / member.length).toFixed(2);
      let temp = member.map((item) => {
        return {
          id: item.id,
          name: item.name,
          amount: Number(perPersonAmount),
        };
      });
      let data = { amount, paidBy, memberList: temp };
      state.expenses.push(data);
    },
    tooglePairs: (state, action: PayloadAction<TooglePairsPayloadType[]>) => {
      state.pairs = action.payload;
    },
    addBillList: (state, action: PayloadAction<BillListPayloadType[]>) => {
      state.billList = action.payload;
    },
  },
});

export const { addExpense, addPairs, tooglePairs, addBillList } =
  SplitSlice.actions;
export default SplitSlice.reducer;

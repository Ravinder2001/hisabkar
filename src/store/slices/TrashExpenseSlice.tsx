import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type deleteGroup = {
  id: string;
  createdAt: string;
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
};

interface UserState {
  List: deleteGroup[];
}

const initialState: UserState = {
  List: [],
};

const TrashExpenseSlice = createSlice({
  name: "TrashExpenseSlice",
  initialState,
  reducers: {
    AddTrashGroup: (state, action: PayloadAction<deleteGroup>) => {
      state.List.push(action.payload);
    },
    DeleteGroup: (state, action: PayloadAction<string>) => {
      state.List = state.List.filter((item) => item.id !== action.payload);
    },
    
  },
});

export const { AddTrashGroup, DeleteGroup } = TrashExpenseSlice.actions;
export default TrashExpenseSlice.reducer;

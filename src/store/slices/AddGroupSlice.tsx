import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
const shortid = require("shortid");
export interface AddGroupState {
  GroupName: string;
  MemberList: { id: string; name: string }[];
  GroupError: boolean;
  MemberError: boolean;
  ErrorShow: boolean;
}

const initialState: AddGroupState = {
  GroupName: "",
  MemberList: [],
  GroupError: true,
  MemberError: true,
  ErrorShow: false,
};

export const AddGroupSlice = createSlice({
  name: "AddGroup",
  initialState,
  reducers: {
    addGroupName: (state, action: PayloadAction<string>) => {
      state.GroupName = action.payload;
      state.GroupError = false;
      if (state.GroupName === "") {
        state.GroupError = true;
      }
    },
    addGroupMember: (state, action: PayloadAction<string>) => {
      let id = shortid.generate();
      let data = { id, name: action.payload };
      state.MemberList = [...state.MemberList, data];
      if (state.MemberList.length > 1) {
        state.MemberError = false;
      }
    },
    removeGroupMember: (state, action: PayloadAction<string>) => {
      let data = state.MemberList.filter((item) => item.id !== action.payload);
      state.MemberList = data;
      if (state.MemberList.length <= 1) {
        state.MemberError = true;
      }
    },
    toogleErrorShow: (state) => {
      state.ErrorShow = true;
    },

  },
});

export const {
  addGroupName,
  addGroupMember,
  removeGroupMember,
  toogleErrorShow,
} = AddGroupSlice.actions;
export default AddGroupSlice.reducer;

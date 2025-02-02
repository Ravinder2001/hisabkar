import { Dispatch, SetStateAction } from "react";

export type GroupType = {
  group_id: number;
  group_name: string;
  total_amount: number;
  group_type_id: string;
  is_settled: boolean;
  total_members_count: number;
  remaining_members: number;
  is_you_admin: boolean;
  members: string[];
};

export type ModalType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export type OptionType = {
  value: string;
  label: string;
};

export type MemberType = {
  id: string;
  name: string;
  avatar: string;
  total_spent: number;
}[];

export type GroupDataType = {
  group_name: string;
  group_type_id: string;
  created_at: string;
  total_amount: number;
  is_settled: boolean;
  total_members_count: number;
  total_expenses_count: number;
  is_you_admin: boolean;
  members: MemberType;
};

export type ExpenseType = {
  expense_id: number;
  expense_name: string;
  expense_type_id: string;
  description: string | null;
  amount: number;
  paid_by: string;
  members_count: string;
  created_at: string;
  members: {
    id: string;
    amount: number;
  }[];
  is_own_expense: boolean;
};

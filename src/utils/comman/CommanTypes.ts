/* eslint-disable @typescript-eslint/no-explicit-any */
export type GroupType = {
  group_id: number;
  group_name: string;
  code: string;
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
  setIsOpen: any;
};

export type OptionType = {
  value: string | number;
  label: string;
};

export type MemberType = {
  id: string;
  name: string;
  avatar: string;
  total_spent: number;
  is_available: boolean;
  is_current_user: boolean;
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

export type SplitType = "EQUAL" | "PERCENTAGE" | "CUSTOM";

export type ExpenseType = {
  expense_id: number;
  expense_name: string;
  description: string;
  amount: number;
  paid_by: string;
  members_count: string;
  split_type: SplitType;
  created_at: string;
  expense_type: string;
  members: {
    id: string;
    amount: number;
  }[];
  is_own_expense: boolean;
};

export type GroupPairsData = {
  send: Array<{
    user_id: string;
    amount: string;
  }>;
  receive: Array<{
    user_id: string;
    amount: string;
  }>;
};

export type SupportType = "SUPPORT" | "FEEDBACK" | "BUG" | null;

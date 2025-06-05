import { IParentHistoryType } from "@/components/AddHistory/types";

export interface ITransactionSummaryResponseDto {
  incomeAmount: number;
  expenseAmount: number;
  expenseLength: number;
  categoryData: ICategoryDataType[];
}

export interface IGetMonthlySummaryResponseDto {
  data: { year_month: string; income: number; expense: number }[];
}

export interface IGetTransactionDto {
  categoryData: ICategoryDataType[];
  data: IParentHistoryType[];
  expenseAmount: number;
  expenseLength: number;
  incomeAmount: number;
}

export interface ICategoryDataType {
  type: string;
  amount: number;
}

export interface IMonthSummaryDataDto {
  year_month: string;
  income: number;
  expense: number;
}

export interface KakaoLoginResponseDto {
  data: string;
}

export interface IAllTransactionResponseDto {
  categoryData: { type: string; amount: any }[];
  data: IParentHistoryType[];
  incomeAmount: number;
  expenseAmount: number;
  expenseLength: number;
  totalCount: number;
}

export interface ITransactionResponseDto {
  categoryData: { type: string; amount: any }[];
  data: IParentHistoryType[];
  incomeAmount: number;
  expenseAmount: number;
  expenseLength: number;
}

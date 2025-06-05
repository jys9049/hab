import { UseMutateFunction } from "@tanstack/react-query";

export interface IAddHistoryProps {
  onSubmit: UseMutateFunction<Response, Error, IHistoryType, unknown>;
  date: string;
}

export interface IHistoryType {
  amount: string;
  category: string;
  date: string;
  time: {
    hour: string;
    minute: string;
  };
  memo: string;
}

export interface IParentHistoryType {
  id: string;
  amount: string;
  category: string;
  date: string;
  memo: string;
}

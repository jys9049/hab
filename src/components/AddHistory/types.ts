import { UseMutateFunction } from "@tanstack/react-query";
import { Dayjs } from "dayjs";

export interface IAddHistoryProps {
  onSubmit: UseMutateFunction<Response, Error, IHistoryType, unknown>;
  date: Date;
}

export interface IHistoryType {
  amount: string;
  category: string;
  date: Dayjs;
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
  date: Dayjs;
  memo: string;
}

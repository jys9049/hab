import { IParentHistoryType } from "../AddHistory/types";

export interface IHistoryDetailProps {
  isOpen: boolean;
  history: IParentHistoryType | null;
  handleClose: () => void;
  date: string;
}

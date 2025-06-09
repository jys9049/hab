export interface ICalendarProps {
  historyData?: ITransactionByMonth[];
  disabledModalStyle?: boolean;
  isOpen: boolean;
  value: string;
  handleClose: () => void;
  handleChange: (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleMonthChange?: (type: string) => void;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface ITransactionByMonth {
  date: string;
  income: number;
  expense: number;
}

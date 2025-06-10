export interface ICalendarProps {
  isOpen: boolean;
  value: string;
  handleClose: () => void;
  handleChange: (
    value: Value,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface ITransactionByMonth {
  date: string;
  income: number;
  expense: number;
}

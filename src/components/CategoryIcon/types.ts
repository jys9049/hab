export interface ICategoryProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  variant?: string;
  //   variant?: "FOOD" | "BUS" | "PAY" | "SAVE" | "ETC" | "SHOPPING";
  showText?: boolean;
  size?: "SMALL" | "BIG";
  color?: "default" | "black";
}

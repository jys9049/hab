import { PropsWithChildren } from "react";

export interface ITypographyProps extends PropsWithChildren {
  as?: "p" | "span" | "h1";
  variant?: TVariant;
  color?: TColor;
  bold?: boolean;
}

type TVariant = "headerTitle" | "title" | "subTitle" | "body" | "small";
type TColor = "black" | "gray" | "green" | "red" | "white" | "point";

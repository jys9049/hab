import { PropsWithChildren } from "react";

export interface IModalProps extends PropsWithChildren {
  isOpen: boolean;
  handleClose: () => void;
  slideTop?: boolean;
}

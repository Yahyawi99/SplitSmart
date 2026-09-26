import type { ReactNode } from "react";

export type authOptionsType = {
  type: "Email" | "Google" | "Github";
  icon: ReactNode;
  label: string;
};

export interface AuthOptionsSelectorProps {
  selectedOption: "Email" | "Google" | "Github";
  onSelectOption: (option: "Email" | "Google" | "Github") => void;
}

export interface AuthOptionProps extends AuthOptionsSelectorProps {
  option: authOptionsType;
}

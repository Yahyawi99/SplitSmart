export type authOptionsType = {
  type: "Email" | "Google" | "Github";
  icon: string;
  label: string;
};

export interface AuthOptionsSelectorProps {
  selectedOption: "Email" | "Google" | "Github";
  onSelectOption: (option: "Email" | "Google" | "Github") => void;
}

export interface AuthOptionProps extends AuthOptionsSelectorProps {
  option: authOptionsType;
}

// export interface User {
//   id: string | undefined;
//   name: string;
//   email: string;
// }

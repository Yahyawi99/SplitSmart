import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Mail } from "lucide-react";
import { authOptionsType, AuthOptionsSelectorProps } from "@/types/auth";
import AuthOption from "./AuthOption";

const authOptions: authOptionsType[] = [
  { type: "Email", icon: <Mail aria-hidden="true" size={16} />, label: "Email" },
  {
    type: "Google",
    icon: <FontAwesomeIcon icon={faGoogle} aria-hidden="true" />,
    label: "Google",
  },
  {
    type: "Github",
    icon: <FontAwesomeIcon icon={faGithub} aria-hidden="true" />,
    label: "GitHub",
  },
];

export default function AuthOptionsSelector({
  selectedOption,
  onSelectOption,
}: AuthOptionsSelectorProps) {
  return (
    <div className="mb-6 rounded-xl border border-(--text-dim)/50 bg-(--bg-base) p-4">
      <h3 className="mb-1 text-base font-semibold text-(--text-primary)">
        Continue with
      </h3>

      <p className="mb-4 text-sm text-(--text-secondary)">
        Choose how you want to create your SplitSmart account.
      </p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {authOptions.map((option) => (
          <AuthOption
            key={option.type}
            option={option}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
}

import { authOptionsType, AuthOptionsSelectorProps } from "@/types/auth";
import AuthOption from "./AuthOption";

const authOptions: authOptionsType[] = [
  { type: "Email", icon: "", label: "Email" },
  { type: "Google", icon: "", label: "Google" },
  { type: "Github", icon: "", label: "Phone" },
];

export default function AuthOptionsSelector({
  selectedOption,
  onSelectOption,
}: AuthOptionsSelectorProps) {
  return (
    <div className="mb-8 p-4 border border-border rounded-md bg-background">
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
        Authentication Options
      </h3>

      <p className="text-sm text-muted-foreground mb-4">
        Choose your preferred method. Email & Password registration is always
        available.
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {authOptions.map((option, i) => (
          <AuthOption
            key={i}
            option={option}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
}

import { AuthOptionsSelectorProps } from "@/types/auth";
import { authOptions } from "@/constants/AuthOptions";
import AuthOption from "./AuthOption";

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
        Choose how you want to continue to your SplitSmart account.
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

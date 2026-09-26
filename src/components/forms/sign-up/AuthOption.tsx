import { Button } from "@/components/ui/button";
import { AuthOptionProps } from "@/types/auth";

export default function AuthOption({
  option,
  selectedOption,
  onSelectOption,
}: AuthOptionProps) {
  return (
    <Button
      key={option.type}
      type="button"
      variant={selectedOption === option.type ? "default" : "outline"}
      className={`flex h-10 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium transition-colors sm:px-3 ${
        selectedOption === option.type
          ? "border border-(--accent-btn) bg-(--accent-btn) text-(--text-primary) hover:bg-(--accent-btn-hover)"
          : "border border-(--text-dim)/50 bg-(--bg-sidebar) text-(--text-secondary) hover:border-(--accent-btn) hover:text-(--text-primary)"
      }`}
      onClick={() => onSelectOption(option.type)}
    >
      <span className="text-base leading-none">{option.icon}</span>
      <span>{option.label}</span>
    </Button>
  );
}

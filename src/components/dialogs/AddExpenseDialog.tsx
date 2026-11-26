"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Camera, Check, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";
import { fetchGroups } from "@/services/groups/fetch-groups";
import type { GroupListItem } from "@/types/group";
import {
  dialogContentClass,
  dialogErrorClass,
  dialogFieldClass,
  fetchGroupMembers,
  type GroupMemberOption,
} from "./dialog-styles";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

type SplitMode = "EQUAL" | "EXACT" | "PERCENTAGE" | "SHARES";

const SPLIT_TABS: { value: SplitMode; label: string }[] = [
  { value: "EQUAL", label: "Equal" },
  { value: "EXACT", label: "Exact" },
  { value: "PERCENTAGE", label: "Percent" },
  { value: "SHARES", label: "Shares" },
];

const DEFAULT_CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Housing",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Travel",
  "Other",
];

const AVATAR_COLORS = [
  "#0f9d8a",
  "#a855f7",
  "#ef1c1c",
  "#2f6df6",
  "#c47f0a",
  "#ec4899",
];

// Selected chips, rows and the primary button use the orange accent #fb923c.
const idleChip =
  "border-(--text-dim)/50 bg-(--bg-base) text-(--text-secondary) hover:border-(--text-muted)";

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

/** Largest-remainder allocation. Display only: the server is authoritative. */
function allocate(totalCents: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0 || totalCents <= 0) return weights.map(() => 0);
  const raw = weights.map((weight) => (totalCents * weight) / sum);
  const floors = raw.map(Math.floor);
  let remainder = totalCents - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - floors[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  for (const { index } of order) {
    if (remainder <= 0) break;
    floors[index] += 1;
    remainder -= 1;
  }
  return floors;
}

function MemberAvatar({ name, index }: { name: string; index: number }) {
  return (
    <span
      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onSaved,
}: AddExpenseDialogProps) {
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [members, setMembers] = useState<GroupMemberOption[]>([]);
  const [groupId, setGroupId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [splitMode, setSplitMode] = useState<SplitMode>("EQUAL");
  const [splitValues, setSplitValues] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetchGroups(1)
      .then(({ groups: result }) => {
        if (!active) return;
        setGroups(result);
        setGroupId((current) => current || result[0]?.id || "");
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load groups",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !groupId) return;
    let active = true;
    fetchGroupMembers(groupId)
      .then((result) => {
        if (!active) return;
        setMembers(result);
        setPayerId((current) =>
          result.some(({ id }) => id === current)
            ? current
            : (result[0]?.id ?? ""),
        );
        setParticipantIds(result.map(({ id }) => id));
        setSplitValues({});
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load members",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [groupId, open]);

  const selectedGroup = groups.find(({ id }) => id === groupId);
  const currency = selectedGroup?.currency ?? "USD";
  const categories = [...DEFAULT_CATEGORIES, ...customCategories];

  const totalCents = Math.round((Number(amount) || 0) * 100);
  const included = members.filter(({ id }) => participantIds.includes(id));

  const valueOf = (id: string) =>
    splitValues[id] ?? (splitMode === "SHARES" ? "1" : "");

  // Per-member amount shown on the right of each row.
  const owedCents = useMemo(() => {
    const result: Record<string, number> = {};
    if (included.length === 0) return result;

    let amounts: number[];
    if (splitMode === "EQUAL") {
      amounts = allocate(
        totalCents,
        included.map(() => 1),
      );
    } else if (splitMode === "EXACT") {
      amounts = included.map(({ id }) =>
        Math.round((Number(splitValues[id]) || 0) * 100),
      );
    } else if (splitMode === "PERCENTAGE") {
      amounts = allocate(
        totalCents,
        included.map(({ id }) => Number(splitValues[id]) || 0),
      );
    } else {
      amounts = allocate(
        totalCents,
        included.map(({ id }) => Number(splitValues[id] ?? "1") || 0),
      );
    }
    included.forEach(({ id }, index) => {
      result[id] = amounts[index];
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    included.map(({ id }) => id).join(","),
    splitMode,
    splitValues,
    totalCents,
  ]);

  // Returns a hint to show under the list, and whether the split is valid.
  const splitStatus = useMemo(() => {
    if (included.length === 0) {
      return { valid: false, hint: "Select at least one person." };
    }
    if (splitMode === "EXACT") {
      const sum = included.reduce(
        (total, { id }) =>
          total + Math.round((Number(splitValues[id]) || 0) * 100),
        0,
      );
      const diff = totalCents - sum;
      return diff === 0 && totalCents > 0
        ? { valid: true, hint: "" }
        : {
            valid: false,
            hint:
              diff > 0
                ? `${formatCurrency(diff, currency)} left to assign`
                : `${formatCurrency(diff, currency)} over the total`,
          };
    }
    if (splitMode === "PERCENTAGE") {
      const sum = included.reduce(
        (total, { id }) => total + (Number(splitValues[id]) || 0),
        0,
      );
      return Math.abs(sum - 100) < 0.0001
        ? { valid: true, hint: "" }
        : { valid: false, hint: `Percentages total ${sum}% of 100%` };
    }
    if (splitMode === "SHARES") {
      const ok = included.every(({ id }) => {
        const shares = Number(splitValues[id] ?? "1");
        return Number.isInteger(shares) && shares >= 1;
      });
      return ok
        ? { valid: true, hint: "" }
        : { valid: false, hint: "Shares must be whole numbers of 1 or more." };
    }
    return { valid: true, hint: "" };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    included.map(({ id }) => id).join(","),
    splitMode,
    splitValues,
    totalCents,
    currency,
  ]);

  function changeSplitMode(mode: SplitMode) {
    setSplitMode(mode);
    setSplitValues({});
  }

  function toggleParticipant(id: string) {
    setParticipantIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function commitCategory() {
    const value = newCategory.trim();
    if (value) {
      if (
        !categories.some((item) => item.toLowerCase() === value.toLowerCase())
      ) {
        setCustomCategories((current) => [...current, value]);
      }
      setCategory(
        categories.find((item) => item.toLowerCase() === value.toLowerCase()) ??
          value,
      );
    }
    setNewCategory("");
    setAddingCategory(false);
  }

  function resetForm() {
    setDescription("");
    setCategory("Other");
    setAmount("");
    setDate(today());
    setSplitMode("EQUAL");
    setSplitValues({});
    setParticipantIds(members.map(({ id }) => id));
    setAddingCategory(false);
    setNewCategory("");
  }

  const canSubmit =
    !loading &&
    groups.length > 0 &&
    members.length > 0 &&
    totalCents > 0 &&
    description.trim().length > 0 &&
    splitStatus.valid;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const participants = included.map(({ id }) => {
        switch (splitMode) {
          case "EXACT":
            return { userId: id, owedCents: owedCents[id] };
          case "PERCENTAGE":
            return {
              userId: id,
              percentage: String(Number(splitValues[id]) || 0),
            };
          case "SHARES":
            return { userId: id, shares: Number(splitValues[id] ?? "1") };
          default:
            return { userId: id };
        }
      });

      await axios.post("/api/expenses", {
        groupId,
        payerId,
        description: description.trim(),
        category,
        amount: Number(amount),
        currency: selectedGroup?.currency,
        date: new Date(`${date}T12:00:00`).toISOString(),
        splitType: splitMode,
        participants,
      });
      onOpenChange(false);
      onSaved?.();
      resetForm();
    } catch (submitError: unknown) {
      setError(
        axios.isAxiosError(submitError)
          ? (submitError.response?.data?.error ?? "Could not save expense")
          : "Could not save expense",
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldLabel = "flex items-center gap-1 text-sm font-medium";
  const required = <span className="font-bold text-(--accent-red)">*</span>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(dialogContentClass, "sm:max-w-2xl")}>
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
          <DialogDescription>
            {groups.length === 1 && selectedGroup
              ? `Record a shared expense in ${selectedGroup.name}.`
              : "Record a shared group expense."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {groups.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="expense-group" className={fieldLabel}>
                Group {required}
              </Label>
              <select
                id="expense-group"
                className={dialogFieldClass}
                value={groupId}
                onChange={(event) => setGroupId(event.target.value)}
                required
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Receipt */}
          <div className="space-y-2">
            <Label className={fieldLabel}>Receipt</Label>
            <Button
              type="button"
              variant="outline"
              disabled
              title="Receipt scanning is coming soon"
              className="h-10 w-full gap-2 rounded-lg border-(--text-dim)/50 bg-(--bg-base) text-sm font-medium text-(--text-primary)"
            >
              <Camera className="h-4 w-4" />
              Scan receipt
            </Button>
          </div>

          {/* Amount + currency */}
          <div className="space-y-2">
            <Label htmlFor="expense-amount" className={fieldLabel}>
              Amount {required}
            </Label>
            <div className="flex gap-2">
              <Input
                id="expense-amount"
                className={cn(dialogFieldClass, "flex-1 font-mono")}
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
              <select
                aria-label="Currency"
                title="Expenses use the group's currency"
                className={cn(dialogFieldClass, "w-28 shrink-0")}
                value={currency}
                disabled
              >
                <option value={currency}>{currency}</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="expense-description" className={fieldLabel}>
              Description {required}
            </Label>
            <Input
              id="expense-description"
              className={dialogFieldClass}
              placeholder="Dinner at..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              maxLength={120}
            />
          </div>

          {/* Date + category */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-date" className={fieldLabel}>
                Date
              </Label>
              <Input
                id="expense-date"
                className={dialogFieldClass}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-category" className={fieldLabel}>
                Category
              </Label>
              <div className="flex items-center gap-2">
                {addingCategory ? (
                  <Input
                    id="expense-category"
                    autoFocus
                    className={dialogFieldClass}
                    placeholder="New category"
                    value={newCategory}
                    maxLength={40}
                    onChange={(event) => setNewCategory(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        commitCategory();
                      }
                      if (event.key === "Escape") {
                        event.stopPropagation();
                        setAddingCategory(false);
                        setNewCategory("");
                      }
                    }}
                  />
                ) : (
                  <select
                    id="expense-category"
                    className={dialogFieldClass}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={addingCategory ? "Save category" : "Add category"}
                  className="h-10 w-10 shrink-0 text-(--text-secondary) hover:text-(--text-primary)"
                  onClick={() =>
                    addingCategory ? commitCategory() : setAddingCategory(true)
                  }
                >
                  {addingCategory ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Paid by */}
          <fieldset className="space-y-2">
            <legend className={fieldLabel}>Paid by</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup">
              {members.map((member, index) => {
                const on = member.id === payerId;
                return (
                  <button
                    key={member.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPayerId(member.id)}
                    className={cn(
                      "flex h-8 items-center gap-2 rounded-full border px-2.5 pr-3 text-xs font-medium transition-colors",
                      on
                        ? "text-(--text-primary) border-[#fb923c] bg-[#fb923c]/15"
                        : idleChip,
                    )}
                  >
                    <MemberAvatar name={member.name} index={index} />
                    {member.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Split */}
          <fieldset className="space-y-3">
            <legend className={fieldLabel}>Split</legend>

            <div
              role="tablist"
              className="grid grid-cols-4 rounded-lg bg-(--bg-base) p-1"
            >
              {SPLIT_TABS.map((tab) => {
                const on = tab.value === splitMode;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => changeSplitMode(tab.value)}
                    className={cn(
                      "h-8 rounded-md border text-sm font-medium transition-colors",
                      on
                        ? "border-(--text-dim)/50 bg-(--bg-sidebar) text-(--text-primary)"
                        : "border-transparent text-(--text-muted) hover:text-(--text-secondary)",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              {members.map((member, index) => {
                const on = participantIds.includes(member.id);
                const cents = on ? (owedCents[member.id] ?? 0) : 0;
                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleParticipant(member.id)}
                      className={cn(
                        "flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border px-2 text-left text-xs font-medium transition-colors",
                        on
                          ? "text-(--text-primary) border-[#fb923c] bg-[#fb923c]/15"
                          : cn(idleChip, "opacity-70"),
                      )}
                    >
                      <MemberAvatar name={member.name} index={index} />
                      <span className="truncate">{member.name}</span>
                    </button>

                    <div className="flex w-36 shrink-0 items-center justify-end gap-2 text-sm">
                      {on && splitMode === "EXACT" && (
                        <Input
                          aria-label={`${member.name} exact amount`}
                          className="h-8 w-full rounded-md border-(--text-dim)/50 bg-(--bg-base) px-2 text-right font-mono text-xs"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={valueOf(member.id)}
                          onChange={(event) =>
                            setSplitValues((current) => ({
                              ...current,
                              [member.id]: event.target.value,
                            }))
                          }
                        />
                      )}

                      {on &&
                        (splitMode === "PERCENTAGE" ||
                          splitMode === "SHARES") && (
                          <>
                            <div className="relative w-16">
                              <Input
                                aria-label={`${member.name} ${
                                  splitMode === "PERCENTAGE"
                                    ? "percentage"
                                    : "shares"
                                }`}
                                className={cn(
                                  "h-8 w-full rounded-md border-(--text-dim)/50 bg-(--bg-base) px-2 text-right font-mono text-xs",
                                  splitMode === "PERCENTAGE" && "pr-5",
                                )}
                                type="number"
                                inputMode={
                                  splitMode === "PERCENTAGE"
                                    ? "decimal"
                                    : "numeric"
                                }
                                min={splitMode === "PERCENTAGE" ? "0" : "1"}
                                max={
                                  splitMode === "PERCENTAGE" ? "100" : undefined
                                }
                                step={splitMode === "PERCENTAGE" ? "any" : "1"}
                                placeholder={
                                  splitMode === "PERCENTAGE" ? "0" : "1"
                                }
                                value={valueOf(member.id)}
                                onChange={(event) =>
                                  setSplitValues((current) => ({
                                    ...current,
                                    [member.id]: event.target.value,
                                  }))
                                }
                              />
                              {splitMode === "PERCENTAGE" && (
                                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-(--text-muted)">
                                  %
                                </span>
                              )}
                            </div>
                            <span className="w-16 text-right font-mono text-xs text-(--text-muted)">
                              {formatCurrency(cents, currency)}
                            </span>
                          </>
                        )}

                      {(splitMode === "EQUAL" || !on) && (
                        <span
                          className={cn(
                            "font-mono text-xs",
                            on && cents > 0
                              ? "text-(--text-primary)"
                              : "text-(--text-muted)",
                          )}
                        >
                          {formatCurrency(cents, currency)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {splitStatus.hint && totalCents > 0 && (
              <p className="text-xs text-(--text-muted)" aria-live="polite">
                {splitStatus.hint}
              </p>
            )}
          </fieldset>

          {error && (
            <p role="alert" className={dialogErrorClass}>
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg border-(--text-dim)/50 bg-(--bg-base) px-4 text-sm text-(--text-primary)"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-9 rounded-lg bg-[#fb923c] px-4 text-sm font-semibold text-[#1a1208] hover:bg-[#fdab68] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Add expense"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

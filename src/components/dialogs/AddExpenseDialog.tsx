"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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
import { fetchGroups } from "@/services/groups/fetch-groups";
import type { GroupListItem } from "@/types/group";
import {
  dialogContentClass,
  dialogErrorClass,
  dialogFieldClass,
  dialogPrimaryButtonClass,
  fetchGroupMembers,
  type GroupMemberOption,
} from "./dialog-styles";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

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
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const selectedGroup = groups.find(({ id }) => id === groupId);
      await axios.post("/api/expenses", {
        groupId,
        payerId,
        description,
        category,
        amount: Number(amount),
        currency: selectedGroup?.currency,
        date: new Date(`${date}T12:00:00`).toISOString(),
        participants: participantIds,
      });
      onOpenChange(false);
      onSaved?.();
      setDescription("");
      setCategory("");
      setAmount("");
      setDate(today());
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
          <DialogDescription>Record a shared group expense.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="expense-group">Group</Label>
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
          <div className="space-y-2">
            <Label htmlFor="expense-description">Description</Label>
            <Input
              id="expense-description"
              className={dialogFieldClass}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              maxLength={120}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">
                Amount {groups.find(({ id }) => id === groupId)?.currency}
              </Label>
              <Input
                id="expense-amount"
                className={dialogFieldClass}
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Input
                id="expense-category"
                className={dialogFieldClass}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                maxLength={40}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expense-payer">Paid by</Label>
              <select
                id="expense-payer"
                className={dialogFieldClass}
                value={payerId}
                onChange={(event) => setPayerId(event.target.value)}
                required
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                className={dialogFieldClass}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Split between</legend>
            <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border border-(--text-dim)/40 p-3">
              {members.map((member) => (
                <Label
                  key={member.id}
                  className="flex items-center gap-2 text-sm font-normal"
                >
                  <input
                    type="checkbox"
                    checked={participantIds.includes(member.id)}
                    onChange={(event) =>
                      setParticipantIds((current) =>
                        event.target.checked
                          ? [...current, member.id]
                          : current.filter((id) => id !== member.id),
                      )
                    }
                  />
                  {member.name}
                </Label>
              ))}
            </div>
          </fieldset>
          {error && (
            <p role="alert" className={dialogErrorClass}>
              {error}
            </p>
          )}
          <Button
            type="submit"
            className={dialogPrimaryButtonClass}
            disabled={
              loading ||
              groups.length === 0 ||
              members.length === 0 ||
              participantIds.length === 0
            }
          >
            {loading ? "Saving..." : "Save expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

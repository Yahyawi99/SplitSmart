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
import { ConfirmDialog } from "./ConfirmDialog";
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

interface SettleUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export function SettleUpDialog({
  open,
  onOpenChange,
  onSaved,
}: SettleUpDialogProps) {
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [members, setMembers] = useState<GroupMemberOption[]>([]);
  const [groupId, setGroupId] = useState("");
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load groups",
          );
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
        setFromUserId(result[0]?.id ?? "");
        setToUserId(result[1]?.id ?? "");
      })
      .catch((loadError: unknown) => {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load members",
          );
      });
    return () => {
      active = false;
    };
  }, [groupId, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setConfirmOpen(true);
  }

  async function confirmSettlement() {
    setLoading(true);
    try {
      await axios.post("/api/settlements", {
        groupId,
        fromUserId,
        toUserId,
        amount: Number(amount),
        note,
        date: new Date(`${date}T12:00:00`).toISOString(),
      });
      onOpenChange(false);
      setConfirmOpen(false);
      onSaved?.();
      setAmount("");
      setNote("");
    } catch (submitError: unknown) {
      setError(
        axios.isAxiosError(submitError)
          ? (submitError.response?.data?.error ?? "Could not record settlement")
          : "Could not record settlement",
      );
    } finally {
      setLoading(false);
    }
  }

  const currency = groups.find(({ id }) => id === groupId)?.currency;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Settle up</DialogTitle>
          <DialogDescription>
            Record a payment between group members.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="settlement-group">Group</Label>
            <select
              id="settlement-group"
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="settlement-from">Paid by</Label>
              <select
                id="settlement-from"
                className={dialogFieldClass}
                value={fromUserId}
                onChange={(event) => setFromUserId(event.target.value)}
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
              <Label htmlFor="settlement-to">Paid to</Label>
              <select
                id="settlement-to"
                className={dialogFieldClass}
                value={toUserId}
                onChange={(event) => setToUserId(event.target.value)}
                required
              >
                {members
                  .filter(({ id }) => id !== fromUserId)
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="settlement-amount">Amount {currency}</Label>
              <Input
                id="settlement-amount"
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
              <Label htmlFor="settlement-date">Date</Label>
              <Input
                id="settlement-date"
                className={dialogFieldClass}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settlement-note">Note</Label>
            <Input
              id="settlement-note"
              className={dialogFieldClass}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={160}
            />
          </div>
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
              members.length < 2 ||
              !fromUserId ||
              !toUserId ||
              fromUserId === toUserId
            }
          >
            {loading ? "Saving..." : "Record settlement"}
          </Button>
        </form>
      </DialogContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm settlement"
        description={`${members.find(({ id }) => id === fromUserId)?.name ?? "The payer"} will pay ${members.find(({ id }) => id === toUserId)?.name ?? "the recipient"} ${amount || "0"} ${currency ?? ""}.`}
        confirmLabel={loading ? "Recording..." : "Confirm payment"}
        onConfirm={confirmSettlement}
      />
    </Dialog>
  );
}

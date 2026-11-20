"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGroup } from "@/services/groups/create-group";
import { CURRENCIES } from "@/constants/currency";
import {
  dialogContentClass,
  dialogErrorClass,
  dialogPrimaryButtonClass,
} from "./dialog-styles";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: (group: { id: string; name: string }) => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onGroupCreated,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const group = await createGroup({
        creatorId: "",
        name,
        description: description || null,
        currency,
      });
      onGroupCreated?.(group);
      onOpenChange(false);
      setName("");
      setDescription("");
      setCurrency("USD");
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create group",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription>
            Set up a group to track shared expenses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="flex items-center gap-1">
              Group name
              <span className="text-(--accent-red) font-bold">*</span>
            </Label>
            <Input
              id="group-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={loading}
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-description">Description</Label>
            <Input
              id="group-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
              maxLength={160}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-currency" className="flex items-center gap-1">
              Currency
              <span className="text-(--accent-red) font-bold">*</span>
            </Label>
            <Select
              onValueChange={(value) => value && setCurrency(value)}
              value={currency}
              disabled={loading}
            >
              <SelectTrigger
                id="group-currency"
                className="h-10 w-full rounded-md border border-(--text-dim)/50 bg-(--bg-base) text-(--text-primary) focus-visible:border-(--accent-btn) focus-visible:ring-0"
              >
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-(--text-dim)/50 bg-(--bg-base) p-1 text-(--text-primary)">
                {CURRENCIES.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer rounded-md text-(--text-secondary) focus:bg-(--bg-active) focus:text-(--text-primary)"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p role="alert" className={dialogErrorClass}>
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading || !name || !currency}
            className={dialogPrimaryButtonClass}
          >
            {loading ? "Creating..." : "Create group"}
          </Button>
        </form>
        <p className="border-t border-(--text-dim)/20 pt-4 text-xs leading-relaxed text-(--text-muted)">
          You&apos;ll be added as the group owner. Members can be added later.
        </p>
      </DialogContent>
    </Dialog>
  );
}

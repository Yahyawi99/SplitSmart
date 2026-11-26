"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Loader2 } from "lucide-react";
import { CURRENCIES } from "@/constants/currency";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const group = await createGroup({
        creatorId: "", // Will be set by the server from session
        name,
        description: description || null,
        currency,
      });
      onGroupCreated?.(group);
      onOpenChange(false);
      setName("");
      setDescription("");
      setCurrency("USD");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-medium"
        >
          <Plus className="h-3 w-3 mr-1" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Set up a new group to track shared expenses with friends.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4"
        >
          <div className="space-y-1">
            <Label className="flex items-center gap-1">
              Group name
              <span className="text-(--accent-red) font-bold">*</span>
            </Label>
            <Input
              placeholder="e.g. Trip to Japan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Input
              placeholder="e.g. Vacation, apartment, weekend trip..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1">
              Currency
              <span className="text-(--accent-red) font-bold">*</span>
            </Label>
            <Select
              onValueChange={(value) => setCurrency(value as string)}
              value={currency}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg border border-(--accent-red)/30 bg-(--accent-red)/10 p-3 text-center text-sm font-medium text-(--accent-red-hover)">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !name || !currency}
            className="h-10 w-full cursor-pointer rounded-lg border border-transparent bg-(--accent-btn) px-5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--accent-btn-hover)/75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Group"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
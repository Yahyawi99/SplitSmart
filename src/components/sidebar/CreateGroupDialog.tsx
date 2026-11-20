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
import { Plus } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";

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
        <Button variant="outline" size="sm" className="text-xs font-medium">
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
          className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Label>Group name</Label>
            <Input
              placeholder="e.g. Trip to Japan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <Label>Currency</Label>
            <Select
              defaultValue={currency}
              disabled={loading}
              onValueChange={(value) => setCurrency(value as string)}
            >
              <SelectTrigger>
                <SelectValue placeholder="USD" />
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
          <Button
            type="submit"
            disabled={loading || !name}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </form>
        {error && (
          <div className="mt-2 p-2 rounded-md bg-(--accent-red)/20 border border-(--accent-red)/30 text-(--accent-red) text-xs">
            {error}
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-(--text-dim)/20">
          <p className="text-xs text-(--text-muted)">
            You'll be added as the group owner. You can add members later from
            the group page.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

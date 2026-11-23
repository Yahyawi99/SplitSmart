import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/utils/currency";
import { getInitials } from "@/utils/initials";
import { getAvatarColor } from "@/utils/avatar-color";
import type { GroupMemberInfo } from "@/types/group";

interface GeneralInfoProps {
  title: string;
  description: string | null;
  totalSpentCents: number;
  expenseCount: number;
  currency: string;
  members: GroupMemberInfo[];
}

export function GeneralInfo({
  title = "Untitled Group",
  description = null,
  totalSpentCents = 0,
  expenseCount = 0,
  currency = "USD",
  members = [],
}: Partial<GeneralInfoProps>) {
  return (
    <div className="w-full bg-(--bg-base) text-(--text-primary) ">
      <div className="pl-4 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-(--text-secondary)">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-(--text-secondary)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="3" y="6" width="18" height="12" rx="2" />
              <path d="M3 10h18" />
              <path d="M7 15h.01" />
            </svg>
            <span className="font-semibold text-(--text-primary)">
              {formatCurrency(totalSpentCents, currency)}
            </span>
            <span>total spent</span>
          </div>

          <div className="text-(--text-secondary)">
            <span className="font-semibold text-(--text-primary)">
              {expenseCount}
            </span>{" "}
            expenses
          </div>

          <div className="flex items-center">
            <div className="flex -space-x-2">
              {members.map((member) => (
                <Avatar
                  key={member.id}
                  className="h-7 w-7 border-2 border-(--bg-base)"
                >
                  <AvatarFallback
                    className={`${getAvatarColor(member.id)} text-[10px] font-semibold text-white`}
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="ml-3 text-(--text-secondary)">
              {members.length} members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

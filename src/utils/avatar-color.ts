const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-fuchsia-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-orange-400",
  "bg-emerald-400",
  "bg-purple-400",
];

export function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

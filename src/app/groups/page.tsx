export default function GroupsHome() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-(--bg-base) text-(--text-primary) p-8">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Choose a group</h1>
        <p className="text-(--text-secondary) mb-6">
          Select a group from the sidebar to view expenses, balances, and activity.
        </p>
      </div>
    </div>
  );
}
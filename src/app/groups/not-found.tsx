export default function GroupNotFound() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-(--bg-base) text-(--text-primary) p-8">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-(--text-secondary) mb-6">
          Group not found or you don't have access to this group.
        </p>
      </div>
    </div>
  );
}
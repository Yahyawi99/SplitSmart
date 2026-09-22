import { Divide } from "lucide-react";

export default () => {
  return (
    <header className="text-(--text-primary) flex justify-start items-center gap-4 mb-1.5 pt-4">
      <div className="bg-(--accent-btn) w-12 h-10 rounded-sm flex justify-center items-center">
        <Divide />
      </div>

      <h1 className="text-3xl">SplitSmart</h1>
    </header>
  );
};

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function NotFound() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-(--bg-base) text-(--text-primary)">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-(--text-secondary) mb-6">
          Group not found or you don't have access to this page.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-(--accent-btn) hover:bg-(--accent-btn-hover)/75 text-primary rounded-md font-medium"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
import { Link, Outlet, createFileRoute, redirect, useRouter, useLoaderData } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { users } from "~/server/db/schema";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: ({context}) => {
    return context.user
  }
});

function DashboardLayout() {
  const user = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-bold">Hello {user?.id}</h1>
      <div className="flex items-center gap-2">
        This is a protected layout:
        <pre className="p-1 border rounded-md bg-slate-50">routes/dashboard.tsx</pre>
      </div>

      <Button type="button" asChild className="w-fit" size="lg">
        <Link to="/">Back to Home</Link>
      </Button>

      <Outlet />
    </div>
  );
}

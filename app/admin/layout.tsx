import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: only superadmins may access /admin
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--bg-base)" }}>
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

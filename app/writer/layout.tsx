import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { WriterSidebar } from "@/components/writer/WriterSidebar";

export default async function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "writer" && session.role !== "superadmin") {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--bg-base)" }}>
      <WriterSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-4 md:p-5 lg:p-8 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const dbUser = await User.findById(session.userId).lean();

  const clientSession = {
    user: {
      name: dbUser?.name || session.name,
      email: dbUser?.email || session.email,
      role: dbUser?.role || session.role,
      image: (dbUser as typeof dbUser & { avatar?: string })?.avatar || null,
      writerStatus: (dbUser as any)?.writerStatus || "none",
      writerApplicationMessage: (dbUser as any)?.writerApplicationMessage || "",
      joinedAt: dbUser?.createdAt
        ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })
        : undefined,
    },
  };

  return <ProfileClient session={clientSession} />;
}
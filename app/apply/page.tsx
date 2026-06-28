import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { WriterApplicationForm } from "@/components/writer/WriterApplicationForm";
import { PenLine, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Writer — Learno-Boy",
  description:
    "Apply to become a writer on Learno-Boy and share your knowledge with thousands of learners.",
};

export default async function ApplyPage() {
  const session = await getSession();

  
  if (!session) {
    redirect("/login?redirect=/apply");
  }

  
  if (session.role === "writer" || session.role === "superadmin") {
    redirect("/writer");
  }

  await connectDB();
  const user = await User.findById(session.userId)
    .select("writerStatus writerApplication")
    .lean();

  const status = user?.writerStatus ?? "none";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {}
      <div className="text-center mb-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
          }}
        >
          <PenLine size={28} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
          Become a Writer
        </h1>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Share your knowledge with thousands of learners. Join our community of technical writers
          and help shape the future of learning.
        </p>
      </div>

      {}
      {status === "pending" && (
        <StatusBanner
          icon={<Clock size={22} />}
          title="Application Under Review"
          message="Your application has been submitted and is being reviewed by our team. We'll notify you once a decision is made."
          color="#f59e0b"
          bg="rgba(245,158,11,0.06)"
          border="rgba(245,158,11,0.25)"
        />
      )}

      {status === "needs-review" && (
        <StatusBanner
          icon={<AlertTriangle size={22} />}
          title="Additional Review Needed"
          message="Our team has flagged your application for additional review. We may reach out to you for more information."
          color="#6366f1"
          bg="rgba(99,102,241,0.06)"
          border="rgba(99,102,241,0.25)"
        />
      )}

      {status === "rejected" && (
        <StatusBanner
          icon={<XCircle size={22} />}
          title="Application Not Approved"
          message="Unfortunately your application was not approved at this time. You're welcome to reapply in the future."
          color="#dc2626"
          bg="rgba(239,68,68,0.06)"
          border="rgba(239,68,68,0.25)"
        />
      )}

      {status === "approved" && (
        <StatusBanner
          icon={<CheckCircle size={22} />}
          title="Application Approved!"
          message="Congratulations! Your application has been approved. Your account is being upgraded."
          color="#10b981"
          bg="rgba(16,185,129,0.06)"
          border="rgba(16,185,129,0.25)"
        />
      )}

      {}
      {(status === "none" || status === "rejected") && (
        <>
          {}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-5 rounded-2xl border border-[var(--border-color)]"
            style={{ background: "var(--bg-surface)" }}
          >
            {[
              { icon: "📚", title: "Share Knowledge", desc: "Reach thousands of eager learners daily." },
              { icon: "🏅", title: "Get Recognised", desc: "Build your personal brand as a tech expert." },
              { icon: "🚀", title: "Grow Together", desc: "Connect with a community of developers." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-1.5">
                <span className="text-3xl">{icon}</span>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>

          <WriterApplicationForm />
        </>
      )}

      {}
      <p className="text-center text-xs text-[var(--text-tertiary)] mt-8">
        Changed your mind?{" "}
        <Link href="/" className="text-[var(--link-color)] hover:underline font-medium">
          Go back to Home
        </Link>
      </p>
    </div>
  );
}

function StatusBanner({
  icon,
  title,
  message,
  color,
  bg,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="flex items-start gap-4 p-5 rounded-2xl border mb-8"
      style={{ background: bg, borderColor: border }}
    >
      <span style={{ color, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <p className="font-bold text-base" style={{ color }}>
          {title}
        </p>
        <p className="text-sm mt-1 text-[var(--text-secondary)] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

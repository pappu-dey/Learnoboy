import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) {
    if (session.role === "superadmin") {
      redirect("/admin");
    } else if (session.role === "writer") {
      redirect("/writer");
    } else {
      redirect("/home");
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>
      {}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #1e3a8a 0%, #4338ca 55%, #6d28d9 100%)",
        }}
      >
        {}
        <div
          className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)",
          }}
        />

        {}
        <Link href="/" className="flex items-center gap-3 z-10">
          <div
            className="rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: "#fff", padding: "6px 14px", height: "40px" }}
          >
            <Image
              src="/images/logo.png"
              alt="LearnoBoy"
              width={120}
              height={22}
              unoptimized
              style={{ height: "auto" }}
            />
          </div>
        </Link>

        {}
        <div className="z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Learn, Write,
              <br />
              <span style={{ opacity: 0.82 }}>Inspire.</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-xs">
              A community of developers and students sharing knowledge that matters.
            </p>
          </div>

          {}
          <div className="flex gap-6">
            {[
              { value: "10K+", label: "Readers" },
              { value: "500+", label: "Articles" },
              { value: "50+", label: "Writers" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {}
        <p className="text-white/35 text-xs z-10">
          © {new Date().getFullYear()} LearnoBoy. All rights reserved.
        </p>
      </div>

      {}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

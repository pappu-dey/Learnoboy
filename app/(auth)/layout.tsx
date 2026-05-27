import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #4f46e5 50%, #7c3aed 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-10">
          <div
            className="rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: "#fff", padding: "6px 12px", height: "40px" }}
          >
            <Image src="/images/logo.png" alt="LearnoBoy" width={120} height={22} unoptimized style={{ height: "auto" }} />
          </div>
        </Link>

        {/* Center tagline */}
        <div className="z-10">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Learn, Write,<br />
            <span style={{ opacity: 0.85 }}>Inspire.</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            Join a community of developers and students sharing knowledge that matters.
          </p>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            {[
              { value: "10K+", label: "Readers" },
              { value: "500+", label: "Articles" },
              { value: "50+", label: "Writers" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <p className="text-white/40 text-xs z-10">
          © {new Date().getFullYear()} LearnoBoy. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

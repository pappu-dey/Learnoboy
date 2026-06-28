import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users, FileText, Globe, ChevronRight } from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Author } from "@/lib/models";
import { getBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";


export const revalidate = 300;

export const metadata: Metadata = {
  title: "Meet Our Writers & Authors | Learno-Boy",
  description: "Browse our directory of developers, experts, and technical writers contributing high-quality tutorials and guides to Learno-Boy.",
  alternates: {
    canonical: `${BASE_URL}/author`,
  },
  openGraph: {
    title: "Meet Our Writers | Learno-Boy",
    description: "Explore developer tutorials and articles written by our talented technical authors.",
    url: `${BASE_URL}/author`,
    type: "website",
  },
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
  </svg>
);

export default async function AuthorsDirectoryPage() {
  await connectDB();
  
  
  const authors = await Author.find({}).sort({ articleCount: -1, name: 1 }).lean();

  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Authors", url: `${BASE_URL}/author` },
  ]);

  return (
    <>
      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-[var(--link-color)] mb-4 shadow-sm border border-blue-500/10">
            <Users size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
            Meet Our Authors
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            Discover articles, tutorials, and developer-focused guides written by our exceptionally talented team of developers and technical writers.
          </p>
        </div>

        {}
        {authors.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border border-[var(--border-color)]"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              No authors found
            </h3>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              We are currently onboarding technical writers. Check back soon to meet our team!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {authors.map((author) => (
              <div
                key={String(author._id)}
                className="group rounded-2xl border border-[var(--border-color)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                style={{
                  background: "var(--bg-surface)",
                }}
              >
                <div>
                  {}
                  <div className="flex items-start gap-4 mb-4">
                    {}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-color)] relative">
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--link-color), #60a5fa)" }}>
                          <svg viewBox="0 0 24 24" style={{ width: "55%", height: "55%", fill: "#fff", opacity: 0.9 }}>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {}
                    <div className="min-w-0 flex-1">
                      <Link href={`/author/${author.slug}`}>
                        <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors truncate flex items-center gap-1.5 flex-wrap">
                          {author.name}
                          {author.isVerified && <VerifiedBadge size="sm" showLabel={false} />}
                        </h2>
                      </Link>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                        <FileText size={10} className="text-[var(--link-color)]" />
                        {author.articleCount || 0} {author.articleCount === 1 ? "Article" : "Articles"}
                      </span>
                    </div>
                  </div>

                  {}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">
                    {author.bio || "An active technical writer sharing knowledge and developer guides on the Learno-Boy platform."}
                  </p>
                  {}
                  {(author.expertise?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {author.expertise!.slice(0, 3).map((exp: string) => (
                        <span key={exp} className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(37,99,235,0.08)", color: "var(--link-color)" }}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  {}
                  <div className="flex items-center gap-2">
                    {author.social?.github && (
                      <a
                        href={`https://github.com/${author.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                        aria-label="GitHub Profile"
                      >
                        <GithubIcon />
                      </a>
                    )}
                    {author.social?.twitter && (
                      <a
                        href={`https://twitter.com/${author.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                        aria-label="Twitter Profile"
                      >
                        <TwitterIcon />
                      </a>
                    )}
                    {author.social?.linkedin && (
                      <a
                        href={author.social.linkedin.startsWith("http") ? author.social.linkedin : `https://linkedin.com/in/${author.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                        aria-label="LinkedIn Profile"
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                    {author.social?.website && (
                      <a
                        href={author.social.website.startsWith("http") ? author.social.website : `https://${author.social.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                        aria-label="Website"
                      >
                        <Globe size={14} />
                      </a>
                    )}
                  </div>

                  {}
                  <Link
                    href={`/author/${author.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--link-color)] hover:opacity-85 transition-opacity group/btn"
                  >
                    View Profile
                    <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Globe, Calendar, FileText, MapPin, Briefcase, GraduationCap, Building2, Eye } from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Author, Article } from "@/lib/models";
import { getArticles } from "@/lib/services/articleService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { getBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";
import { format } from "date-fns";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
  </svg>
);

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

// Pre-render known authors at build time
export async function generateStaticParams() {
  try {
    await connectDB();
    const authors = await Author.find().select("slug").lean();
    return authors.map((auth) => ({ slug: auth.slug }));
  } catch {
    return [];
  }
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const author = await Author.findOne({ slug }).lean();

  if (!author) {
    return {
      title: "Author Not Found | Learno-Boy",
      description: "This author does not exist or has been removed.",
    };
  }

  return {
    title: `${author.name}${author.isVerified ? " ✓" : ""} — Writer Profile | Learno-Boy`,
    description: author.bio || `Read articles written by ${author.name} on Learno-Boy.`,
    alternates: {
      canonical: `${BASE_URL}/author/${author.slug}`,
    },
    openGraph: {
      title: `${author.name} | Learno-Boy`,
      description: author.bio || `Explore articles authored by ${author.name} on Learno-Boy.`,
      url: `${BASE_URL}/author/${author.slug}`,
      type: "profile",
      images: author.avatar ? [{ url: author.avatar, width: 400, height: 400, alt: author.name }] : [],
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;

  await connectDB();
  const author = await Author.findOne({ slug }).lean();
  if (!author) notFound();

  // Fetch articles authored by this writer
  const paginatedResult = await getArticles({
    authorId: String(author._id),
    limit: 20,
    status: "published",
    sort: "newest",
  }).catch(() => ({ data: [], total: 0 }));

  const articles = paginatedResult.data;

  // Schema markup
  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Authors", url: `${BASE_URL}/author` },
    { name: author.name, url: `${BASE_URL}/author/${author.slug}` },
  ]);

  // JSON-LD Person Schema
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${BASE_URL}/author/${author.slug}`,
    image: author.avatar || undefined,
    description: author.bio || undefined,
    jobTitle: author.company ? `Writer at ${author.company}` : "Technical Writer",
    worksFor: author.company ? { "@type": "Organization", name: author.company } : undefined,
    sameAs: [
      author.social?.twitter ? `https://twitter.com/${author.social.twitter}` : null,
      author.social?.github ? `https://github.com/${author.social.github}` : null,
      author.social?.linkedin ? author.social.linkedin : null,
      author.social?.website ? author.social.website : null,
    ].filter(Boolean),
  };

  const socialLinks = [
    { href: author.social?.github ? `https://github.com/${author.social.github}` : null, icon: <GithubIcon />, label: "GitHub" },
    { href: author.social?.twitter ? `https://twitter.com/${author.social.twitter}` : null, icon: <TwitterIcon />, label: "Twitter" },
    { href: author.social?.linkedin?.startsWith("http") ? author.social.linkedin : author.social?.linkedin ? `https://linkedin.com/in/${author.social.linkedin}` : null, icon: <LinkedinIcon />, label: "LinkedIn" },
    { href: author.social?.website?.startsWith("http") ? author.social.website : author.social?.website ? `https://${author.social.website}` : null, icon: <Globe size={16} />, label: "Website" },
    { href: author.social?.portfolio?.startsWith("http") ? author.social.portfolio : author.social?.portfolio ? `https://${author.social.portfolio}` : null, icon: <FileText size={16} />, label: "Portfolio" },
  ].filter((s) => s.href);

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Banner */}
        {author.bannerImage && (
          <div className="w-full h-40 rounded-2xl overflow-hidden mb-[-48px] relative">
            <Image src={author.bannerImage} alt="" fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg-base) 100%)" }} />
          </div>
        )}

        {/* Author Header Card */}
        <div
          className="p-8 md:p-10 rounded-2xl border border-[var(--border-color)] mb-10 relative overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          {/* Background glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none" style={{ backgroundColor: "var(--link-color)" }} />

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-muted)] shadow-sm">
                {author.avatar ? (
                  <Image src={author.avatar} alt={author.name} fill className="object-cover" sizes="112px" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--link-color), #60a5fa)" }}>
                    <svg viewBox="0 0 24 24" style={{ width: "55%", height: "55%", fill: "#fff", opacity: 0.9 }}>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Author Details */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      {author.name}
                    </h1>
                    {author.isVerified && <VerifiedBadge size="md" />}
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-tertiary)]">
                      <FileText size={12} className="text-[var(--link-color)]" />
                      {paginatedResult.total} {paginatedResult.total === 1 ? "Article" : "Articles"}
                    </span>
                    {author.totalViews > 0 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-tertiary)]">
                        <Eye size={12} className="text-[var(--link-color)]" />
                        {author.totalViews.toLocaleString()} views
                      </span>
                    )}
                    {author.location && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <MapPin size={11} /> {author.location}
                      </span>
                    )}
                    {author.company && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Building2 size={11} /> {author.company}
                        {author.experience ? ` · ${author.experience}yr` : ""}
                      </span>
                    )}
                    {author.qualification && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <GraduationCap size={11} /> {author.qualification}
                      </span>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {socialLinks.map(({ href, icon, label }) => (
                      <a
                        key={label}
                        href={href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                        aria-label={label}
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-3xl mb-4">
                {author.bio || "This author hasn't written a biography yet, but is actively contributing high-quality guides and lessons."}
              </p>

              {/* Expertise chips */}
              {(author.expertise?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {author.expertise!.map((exp) => (
                    <span
                      key={exp}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(37,99,235,0.1)", color: "var(--link-color)", border: "1px solid rgba(37,99,235,0.15)" }}
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              )}

              {/* Joined date */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <Calendar size={13} />
                <span>Member since {format(new Date(author.createdAt || Date.now()), "MMMM yyyy")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles list */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-[var(--link-color)]" />
            Articles by {author.name}
          </h2>

          {articles.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-[var(--border-color)]" style={{ background: "var(--bg-surface)" }}>
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No published articles</h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                This writer hasn&apos;t published any articles yet. Stay tuned for future content!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} variant="default" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

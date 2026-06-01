// ===========================
// Shared TypeScript Interfaces
// ===========================

export interface IAuthor {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  bannerImage?: string;
  email: string;
  location?: string;
  qualification?: string;
  company?: string;
  experience?: number;
  expertise: string[];
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    portfolio?: string;
  };
  isVerified: boolean;
  verifiedAt?: string;
  articleCount: number;
  totalViews: number;
  userId?: string;
  createdAt: string;
}

export interface IWriterApplication {
  fullName: string;
  email: string;
  qualification: string;
  expertise: string[];
  whyWrite: string;
  college?: string;
  company?: string;
  experience?: number;
  appliedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  parent?: string | ICategory | null;
  createdAt: string;
}

export interface ITag {
  _id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface IArticleSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  keywords?: string[];
}

export interface IAuthorSnapshot {
  name: string;
  slug: string;
  avatar: string;
  isVerified: boolean;
}

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  /** Primary category (used for URL routing) */
  category: ICategory | string;
  /** All categories (multi-category support) */
  categories?: ICategory[] | string[];
  primaryCategory: string;
  subcategory: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  contentType: "Tutorial" | "Interview Prep" | "Best Practices" | "Roadmap" | "Project" | "Cheat Sheet" | "Notes";
  author: IAuthor | string;
  tags: ITag[] | string[];
  content: string; // Markdown
  excerpt: string;
  snippet?: string;
  keywords?: string;
  coverImage?: string;
  readingTime: number;
  isFeatured: boolean;
  status: "draft" | "published";
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seo?: IArticleSEO;
  authorSnapshot?: IAuthorSnapshot;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Article form data for create/edit
export interface ArticleFormData {
  title: string;
  slug: string;
  categoryId: string;
  authorId: string;
  tagIds: string[];
  content: string;
  excerpt: string;
  coverImage?: string;
  isFeatured: boolean;
  status: "draft" | "published";
  seo?: IArticleSEO;
}

// Search result
export interface SearchResult {
  articles: IArticle[];
  total: number;
  query: string;
}

// Table of Contents item
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Writer Application
export const EXPERTISE_OPTIONS = [
  "Web Development",
  "Machine Learning",
  "Artificial Intelligence",
  "Cyber Security",
  "Networking",
  "Cloud Computing",
  "Java",
  "Python",
  "C++",
  "JavaScript",
  "React",
  "Next.js",
  "Data Structures & Algorithms",
  "Database Management",
  "Operating Systems",
  "Mobile Development",
  "DevOps",
  "UI/UX Design",
  "Career Guidance",
  "Other",
] as const;

export type ExpertiseOption = (typeof EXPERTISE_OPTIONS)[number];

export interface IFeedback {
  _id: string;
  type: "Bug Report" | "Feature Request" | "Content Suggestion" | "General Feedback";
  message: string;
  email?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface IDonor {
  _id: string;
  name: string;
  email: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

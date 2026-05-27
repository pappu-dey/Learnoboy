// ===========================
// Shared TypeScript Interfaces
// ===========================

export interface IAuthor {
  _id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  email: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  articleCount: number;
  createdAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
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
}

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  category: ICategory | string;
  author: IAuthor | string;
  tags: ITag[] | string[];
  content: string; // Markdown
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  isFeatured: boolean;
  status: "draft" | "published";
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seo?: IArticleSEO;
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

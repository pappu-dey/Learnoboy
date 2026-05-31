# LearnoBoy 📚

A **premium educational platform** for developers and students — built with Next.js 16, MongoDB Atlas, Cloudinary, and Tailwind CSS v4.

## Features

- **Public reader experience** — Browse articles by category, search, view author profiles
- **JWT session auth** — Signup, login, forgot/reset password (cookie-based, httpOnly)
- **Writer portal** — Apply to become a writer, write & manage articles via a rich editor
- **Admin panel** — Manage users, approve/reject writer applications, publish articles, manage categories
- **Verified Writer Program** — Superadmins can grant/revoke verified badges
- **Dark / Light mode** — System-aware theme with no flash (ThemeScript pre-paint injection)
- **SEO-ready** — Per-page metadata, JSON-LD structured data, dynamic sitemap, robots.txt
- **ISR** — Home page revalidates every 60 seconds; article pages serve fresh data on demand
- **Cloudinary uploads** — Avatar image upload & transformation pipeline
- **MongoDB Atlas** — Production-ready connection singleton with pool tuning

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | MongoDB via Mongoose |
| Auth | Jose JWT + httpOnly cookies |
| Storage | Cloudinary |
| Fonts | Inter + JetBrains Mono (Google Fonts) |
| Hosting | Vercel (recommended) |

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/learno-boy.git
cd learno-boy
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local` (see the file for descriptions).

### 3. Seed the database (optional)

```bash
npm run seed
```

This creates sample categories, tags, authors, and articles. Run it once after connecting to MongoDB Atlas.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Full base URL (e.g. `https://learnoboy.dev`) |
| `NEXT_PUBLIC_SITE_NAME` | ✅ | Site name for metadata |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | ✅ | Site description for metadata |
| `SESSION_SECRET` | ✅ | Random 32+ char string for JWT signing |
| `SUPERADMIN_EMAIL` | ✅ | Email of the initial superadmin account |

> ⚠️ **Never commit `.env.local`** — it is excluded by `.gitignore`.

---

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add all environment variables in **Project → Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_BASE_URL` to your production domain (e.g. `https://learnoboy.dev`).
5. Deploy. Vercel auto-detects Next.js and runs `next build`.

### After first deploy

1. Create your superadmin account via `/signup` using the email set in `SUPERADMIN_EMAIL`.  
   *(The seed script promotes this email to `superadmin` automatically.)*
2. Navigate to `/admin` to manage content.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed MongoDB with sample data |
| `npm run update-icons` | Sync category icons |

---

## Project Structure

```
app/
  (auth)/          # Login, signup, forgot/reset password
  [category]/      # Category listing + article detail pages
  admin/           # Admin panel (superadmin only)
  writer/          # Writer dashboard
  api/             # API route handlers
  profile/         # User profile page
  privacy/, terms/ # Legal pages
components/
  layout/          # Header, Footer, ThemeScript
  home/            # Hero, FeaturedArticles, LatestArticles, CategoryCards
  article/         # ArticleCard, ArticleContent, TOC, etc.
  admin/, writer/  # Role-specific UI components
lib/
  models/          # Mongoose schemas (Article, Author, Category, Tag, User)
  services/        # Business logic (articleService, categoryService)
  auth/            # Session management (JWT, cookies)
  utils/           # SEO, slugify, readingTime, TOC, etc.
  mongodb.ts       # DB connection singleton
```

---

## License

MIT

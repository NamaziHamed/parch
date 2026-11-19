# Parch

A minimal note-taking app: write rich-text notes with a Tiptap editor, find them
again with search, and sign in with Google or email/password.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui ·
Auth.js (next-auth v5) · Prisma 7 + PostgreSQL (Supabase) · Tiptap 3

## Environment variables

| Variable               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`         | Pooled Postgres URL used by the app at runtime             |
| `DIRECT_URL`           | Direct (non-pooled) Postgres URL used for migrations       |
| `AUTH_SECRET`          | Auth.js secret (`npx auth secret`)                         |
| `GOOGLE_CLIENT_ID`     | Google OAuth client id                                     |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                 |

## Local development

```bash
npm install            # also runs `prisma generate`
npm run db:dev         # optional: local Prisma Postgres instead of Supabase
npm run db:migrate     # apply migrations
npm run dev
```

Prisma 7 no longer reads connection URLs from `schema.prisma`; the CLI reads
them from `prisma.config.ts`, and the app connects through the `pg` driver
adapter in `lib/prisma.ts`. The generated client lives in `lib/generated/prisma`
(git-ignored, regenerated on install and build).

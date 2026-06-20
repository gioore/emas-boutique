<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DB — Neon (PostgreSQL serverless, migrated from Supabase)
# Neon does NOT pause on free tier (scale-to-zero instead).
# ~500ms cold start on first query after 5 min idle. Acceptable for boutique traffic.
# Connection: direct pg Pool. No ORM. Pool config in src/lib/db.ts.
# DATABASE_URL is set in Vercel env vars (production).

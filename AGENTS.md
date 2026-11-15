# AGENTS.md — EduCafe Hub (for any AI agent continuing this project)

## What this is
EduCafe Hub — free in-browser tools for schools & cyber cafes (16 tools: passport photo sheets, exact-KB photo, signature maker, photo+signature joiner, image→PDF, PDF compress, image compressor, age calculator, marks % calculator, QR maker, bulk student photos, exam-form photo, receipt/bill maker, print cost calculator, file converter, file tools). Live: https://educafehub.pages.dev/ (Cloudflare Pages). Backup copy: https://akashkmr9225-de.github.io/educafe-hub/ (older single-file version).

## Layout (read before touching anything)
- `next-app/` — THE source of truth: the Next.js app that is actually deployed. Synced from the working copy on Akash's laptop (`C:\Users\akash\projects\educafe-hub-next`).
- Root `index.html` / `server.js` — legacy single-file version (GitHub Pages backup only). Do not edit it for live changes.
- Tool UI components: `next-app/src/components/sites/educafehub/` (e.g. PhotoTools1.tsx); tool logic: `.../runtime/` (tools-photo.ts, tool-bulk.ts, etc.). Tools are served from the dynamic route `src/app/tools/[slug]`.
- Site texts (tagline, headings, FAQ, footer) live in `next-app/src/content/site.json` — every leaf is an `{en, hi}` pair. Never hardcode marketing text in components; read it from there.

## Editing texts (no code)
Pages CMS edits site.json through a form: https://app.pagescms.org/akashkmr9225-de/educafe-hub/main → "Website Texts". Config is `.pages.yml` at repo root. WARNING: in Pages CMS a list is NOT `type: list` — it is the field's type plus `list: true` (e.g. FAQ items = `type: object` + `list: true` + `fields:`). Saving in the CMS commits to this repo and the site redeploys itself.

## Deploy
- Automatic: push to `main` → GitHub Action "Deploy to Cloudflare Pages" builds `next-app/` (Node 22) and deploys with wrangler. Secrets CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID are set in repo settings.
- `next.config.ts` basePath comes from env NEXT_BASE_PATH (default `/educafe-hub` for GitHub Pages). The Cloudflare build needs it EMPTY — the Action handles this. A page returning 200 is NOT proof: verify the JS/CSS asset URLs also return 200 and contain the new strings.
- Manual fallback (laptop): `C:\Users\akash\cf-resp-deploy.ps1`. The Cloudflare token/account-id live ONLY in `C:\Users\akash\cf-token.txt` / `cf-account-id.txt` on the laptop — never print them, never commit them.

## Never delete / never break
- `next-app/public/google87940ff2dfbcdd22.html` — Google Search Console ownership file. Deleting it loses the verified property.
- `next-app/public/sitemap.xml`, `robots.txt`, and the IndexNow key `.txt` file in `public/`.
- All tools run 100% in the visitor's browser — never add server uploads of user documents/photos.

## Standing rules from the owner
- NO school branding/content on this public site (no Buddha World School names, notices or sections) — it is a public tools site; "School & Cyber Cafe" is only a category phrase.
- Free routes only — never pay for services/plugins on the owner's behalf.
- Every user-facing string needs BOTH English and Hindi (data-i18n / site.json pairs).
- Design tokens: teal #0F766E, saffron #F59E0B, Hind typeface, container max 1160px, breakpoints 480/768/1024/1280.

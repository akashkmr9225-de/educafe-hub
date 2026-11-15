# TASKS.md - EduCafe Hub work board (Sapna + Kanak, side by side)

Owner: Akash. Coordinated by Sapna. Rule that keeps us conflict-free: **only Sapna (and her coding agents) touch source code.** Kanak's deliverables come by email; Sapna integrates them. Both work from the live site: https://educafehub.pages.dev/

## Sapna - code & deploy lane
- [x] Tool 1 Passport Photo V2 (paper dropdown, copies box, quality, Single/Bulk, Excel names) - live, tested by Akash
- [x] Hero heading one-line fix; sign-in popup modal; logo + wordmark size-up
- [x] Top bar: Sign in + My Tasks beside the language toggle on every page; duplicate pair removed from the hero; buttons styled as a matching pair
- [x] Tool 2 Exact KB, part 1: instant preview, KB/MB unit + preset chips, JPG/PNG/WebP formats, two-column layout; language dictionary balanced 556 en / 556 hi
- [x] Tool 2 Exact KB, part 2: bulk mode (up to 200 photos, same settings, progress, per-file results, one ZIP download) + the missing-Download-button bug fixed at the root - live (59d1ef1), browser click-through test passed on Akash's exact case
- [x] KFIX: Kanak's Tool 2/3/4 QA fixes (from K1) - live (a9597b6): download gated on rule-met, Between-mode explanation + visible max correction, Signature live preview + slider labels, Joiner cleaning slider + KB-limit warning + missing-file guidance, privacy line follows the language toggle
- [x] Hindi corrections (K2) applied - Kanak's ~45 corrections + hardcoded messages moved into the dictionary (597 keys en/hi)
- [ ] Language purity pass - Akash's rule: Hindi mode = 100% Hindi, English mode = 100% English, no Hinglish anywhere (full hardcoded-string sweep + first-paint check)
- [x] Contact details live: Akash's own email + WhatsApp on Legal/footer/FAQ (a dedicated website email is planned with Akash for Tue 17 Nov, then swapped in)
- [x] Capacity & Status section removed at Akash's instruction (ad10684); top-bar Sign in button now shows the signed-in name (white/teal) - full sign-in cycle browser-tested
- [x] Old Muse share link now redirects to https://educafehub.pages.dev/ (re-shared 15 Nov) - it always lands on the current site
- [ ] Passport round 2: more papers (6x8, 8x10, A6...), paper type, up to 600 DPI, balanced layout
- [ ] Passport K1b fixes: Excel name matching (file-name column + row-order fallback + 0-match warning), skipped-file report, per-photo remove + clear-all, unique download names
- [ ] Passport round 3: verified document presets only (Passport Seva 630x810, IBPS/SBI 200x230, OCI, DL, NEET) + name/date strip, brightness/contrast, background removal
- [ ] Per-tool polish pass, tools 5-16: alignment, spacing, dropdowns for 4+ options; customer-eyes test (land -> spot the task -> finish -> leave); includes Kanak's K4 findings for tools 5-8
- [ ] SEO pass: B2 keywords into titles/H1/meta/H2/FAQ + "kaise kare" steps on every tool page
- [x] Pages CMS editor live (Akash can edit site texts himself)
- [x] Repo AGENTS.md (architecture + don't-break list)
- [x] Library audit (no swaps - polish only)
- [x] ECC skills + agents installed into the laptop OpenCode (OpenCode itself was uninstalled later on 15 Nov at Akash's instruction - Sapna hand-edits + builds directly now; the .config/opencode folder was kept)

## Kanak - QA & content lane (by email to Sapna)
- [x] K1 Customer-eyes QA, tools 2-4 (Exact KB, Signature, Joiner) - delivered
- [x] K1b Passport Photo QA + re-check - delivered
- [x] K2 Hindi review (~45 corrections) - delivered
- [x] K4 Customer-eyes QA, tools 5-8 - delivered
- [ ] K3 (later, optional) One short-video idea to promote EduCafe Hub on the Kahani AI channel
- [ ] Repo organisation (issues, labels, Projects board, security settings) - APPROVED by Akash 15 Nov: Kanak creates her OWN GitHub account; ORGANISE-ONLY, no code changes (code or workflow changes go in an issue for Sapna); Sapna sends the collaborator invite once Kanak replies with her username

## Agent Akash (akashkss9225@gmail.com) - research and checks lane (by email via Sapna)
- [x] B1 Competitor scan (top 5 passport-photo sites, feature gaps) - delivered
- [x] B2 SEO keywords for all 16 tools - delivered
- [x] B3 Live-site health check (all 17 sitemap URLs return 200, tools visible) - delivered
- [x] B4 Document preset specs (Passport Seva, PAN, SSC, NEET, JEE, IBPS, SBI, UPSC, DL...) - delivered; feeds Passport round 3

## Done together
- 15 Nov: Kanak's correction removed all school content from the public site (live-verified).
- 15 Nov: Kanak's research email -> library audit + this work board.
- 15 Nov night: Tool 1 V2, sign-in modal, top-bar buttons and Tool 2 part 1 shipped and live-verified; Kanak K1/K2/K1b/K4 and Agent Akash B1-B4 all delivered.
- 15 Nov late night: Tool 2 bulk mode + bug root-fix, KFIX and K2 Hindi corrections shipped and live-verified (all hand-built by Sapna after OpenCode's runs failed; OpenCode uninstalled the same night).

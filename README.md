# The 4Ps of Leadership — Diagnostic Assessment

> The spark to ignite your team.

A diagnostic instrument for team leaders, built on Jim Harvey's Four Ps Competency Framework (v1.4). Forty items, five minutes, four-page free report. Pro report ships in Phase 2.

Live site: **4P-assessment.themessagebusiness.com**

---

## What this is

The diagnostic is the front door of the Management Ignite ecosystem. A team leader rates their team against 40 items grouped under the four Ps (Purpose, Plan, People, Pride). The scoring engine identifies the priority P using the framework's stack logic, and the free report names that P and gives one specific move to make this week. The Pro report (£19.99, Phase 2) gives the full twelve-driver breakdown, four-week plan, and routing into Coaching / Ignite tools / workshops.

Companion documents:
- **Four Ps Competency Framework v1.4** — the source-of-truth model
- **Four Ps Team Diagnostic v1.0** — the instrument specification
- **The Art of Managing v3** — the readable version of the model
- **Management Ignite suite** — the working layer (five tools, live at *.themessagebusiness.com)

---

## Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind 3 |
| Fonts | Fraunces (display/serif) + Outfit (sans), via Google Fonts |
| Routing | react-router-dom 6 |
| Auth | Supabase magic link (existing Management Ignite project) |
| Storage | Supabase Postgres — table `four_ps_responses` |
| Payments | Stripe (test mode → live before Pro launch) |
| Hosting | Vercel |
| DNS | Cloudflare grey cloud (DNS-only CNAME to cname.vercel-dns.com) |

Same stack pattern as OSCI Pro and the five Management Ignite tools.

---

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

---

## Deployment workflow

Following the OSCI Pro pattern:

1. Edit locally (or have Claude edit in-container)
2. `git push origin main`
3. Vercel builds automatically within a minute
4. Confirm `READY` state via Vercel dashboard or `list_deployments` MCP call
5. Test on production URL
6. Pull runtime logs promptly if anything fails

**Custom domain alias.** After each redeploy, the alias to `4P-assessment.themessagebusiness.com` must be re-applied via `vercel alias set <deployment-url> 4P-assessment.themessagebusiness.com` (this is a known Vercel gotcha logged in the project notes).

**SPA routing.** Catch-all rewrite is set in `vercel.json`. Required so deep links (`/diagnostic`, `/report`) don't 404 on direct load.

---

## Phase 1 — Free assessment (commit 2)

- [x] Repo scaffold, Tailwind config, fonts, base styles
- [x] Landing page with brand identity (charcoal/black diagnostic)
- [x] App router with placeholder routes for the multi-step flow
- [x] Question bank — 40 items, scale, P/element/driver structure
- [x] Scoring engine — element/driver/P aggregation, priority P logic (verified against spec worked example)
- [x] Context questions (C1–C4) — single screen, all four
- [x] Diagnostic items — one P per screen, 9 items, grouped by element, 5-point Likert
- [x] Email capture before report generation
- [x] Free report renderer — 4 inline pages (Cover / Dashboard / Priority P / One Move)
- [x] Supabase integration — response storage via serverless function with service_role key
- [x] Mailchimp integration — sync to Management Ignite list with tag `4p-diagnostic-free`
- [x] Stripe placeholder for Pro report (button disabled, "coming soon")

## Phase 2 — Pro report (separate release)

- [ ] Stripe checkout integration (test → live)
- [ ] Pro report PDF generation (server-side, Puppeteer or pdf-lib)
- [ ] Full ~20-page Pro report template (driver breakdown, four-week plan, strengths, routing)
- [ ] Email delivery of rendered PDF
- [ ] Re-download dashboard for purchasers

---

## Environment variables

Set in Vercel project settings (one per environment: Development / Preview / Production):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server-only, for response writes
STRIPE_SECRET_KEY=                 # server-only
VITE_STRIPE_PUBLIC_KEY=
MAILCHIMP_API_KEY=                 # server-only
MAILCHIMP_LIST_ID=                 # Management Ignite list
ANTHROPIC_API_KEY=                 # for narrative generation in Pro report (Phase 2)
```

Note: Vercel env var changes require a manual redeploy to take effect. The Stripe client must be initialised inside the request handler, not at module top level. Both are gotchas documented in the OSCI Pro project log.

---

## Voice and writing rules

UK English throughout. No em dashes. No antithesis constructions ("not X but Y"). No "empower / unlock / journey / leverage". No exclamation marks. Plain register over consultant argot. Examples before principles. Same rules apply to the report prose and the AI-generated narrative when it's added in Phase 2.

---

## Repository

Public, under `jimharvey-source` org. Same convention as the five Ignite tools.

© Jim Harvey / The Message Business 2026

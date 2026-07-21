# MarammatBook — explainer site

A standalone marketing/explainer page for **MarammatBook**, the repair-job
tracking tool for mobile and electronics repair shops.

> **From intake to ready for pickup.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical shop owner and to an investor
skimming for 30 seconds.

## What the product does

A repair isn't a mystery — it's a known pipeline. MarammatBook makes that pipeline
visible: intake the job once, then move it along.

- **One-minute job intake** — customer, device, IMEI/serial, reported fault, estimate.
- **Six-stage status pipeline** — received → diagnosing → awaiting-parts → repairing → ready → delivered.
- **Parts & labour log** — each part with its cost plus labour, auto-totalled into the bill.
- **Ready-for-pickup on WhatsApp** — a personalised pickup message staged to your outbox.
- **Warranty on delivery** — set a warranty-until date on hand-over.
- **Warranty lookup** — search a phone number or IMEI to see if a past repair is still covered.
- **Dashboard** — on the bench, ready for pickup, awaiting parts, and revenue this month.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the teal accent `#0d9488`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "job card" that moves itself along the pipeline. No dependencies. |
| `favicon.svg` | Job-book-and-wrench mark. |
| `og.svg` / `og.png` | 1200×630 social share image. |

## Design notes

- Palette: teal accent `#0d9488`, deep teal-black ink, off-white workshop paper,
  a muted sage tint, and a burnt-sienna warning colour for awaiting/overdue.
- **Signature:** money and job numbers are always set in tabular monospace, so the
  whole page reads like a repair job book. The hero widget is a live job card where
  a device visibly moves repairing → ready → delivered with warranty.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide jobs-board
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

This repo deploys to GitHub Pages via GitHub Actions (`.github/workflows/deploy-pages.yml`).
Push to `main` and the workflow publishes the folder verbatim (`.nojekyll` included).
It works equally on any static host (Netlify, Cloudflare Pages, S3) with no configuration.

---

A **KARYA** studio build · sreeni.nintendo@gmail.com

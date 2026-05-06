# Deployment Guide — B The Change

This is a **pure static site** — HTML / CSS / JS only, no build step required. All third-party libraries (Three.js, Supabase) are loaded from CDNs.

You can drag-and-drop the project folder to any static host or connect this repo to Vercel / Netlify / Railway via Git.

---

## ⚡ Quickest path: drag-and-drop

| Host | URL | What to drop |
|------|-----|--------------|
| **Netlify Drop** | https://app.netlify.com/drop | the entire `bthechange-site/` folder |
| **Vercel** | https://vercel.com/new | upload zip, or "Import Git Repository" |
| **Cloudflare Pages** | https://pages.cloudflare.com | "Direct upload" → entire folder |

You'll get a live URL within ~30 seconds. No config changes needed.

---

## 🔵 Vercel (Git-connected, recommended)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new → "Import Git Repository" → pick your repo
3. **Framework Preset**: select "Other"
4. **Build Command**: leave blank
5. **Output Directory**: `.` (a single dot)
6. Click **Deploy**

`vercel.json` in the root is already configured with:
- Clean URLs (`/about` instead of `/about.html`)
- `Cache-Control: immutable` for `/assets/*`
- Security headers (X-Frame, Referrer-Policy, etc.)

**Custom domain:** Settings → Domains → add `bthechange.in`. Vercel will give you DNS records to point your domain at their nameservers.

---

## 🟢 Netlify (Git-connected)

1. Push this folder to GitHub
2. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
3. Pick your repo
4. **Build settings** are auto-detected from `netlify.toml`:
   - Publish directory: `.`
   - Build command: (none)
5. Click **Deploy site**

`netlify.toml` includes:
- Asset caching headers
- Security headers
- 404 fallback to `/404.html`

**Custom domain:** Site settings → Domain management → "Add custom domain".

---

## 🚂 Railway (Docker container)

Railway runs a containerized nginx serving the static files. Slightly more setup than Vercel/Netlify but gives you full server control.

1. Push this folder to GitHub
2. Go to https://railway.app/new → "Deploy from GitHub repo"
3. Pick your repo. Railway auto-detects the `Dockerfile` and `railway.json`.
4. The service will build (~2 min the first time) and assign a `*.up.railway.app` URL
5. Health check: `/healthz` returns `ok` (already wired in `nginx.conf`)

**Custom domain:** Project settings → Networking → Custom domain → add `bthechange.in`.

**Environment vars:** Railway auto-injects `PORT`. nginx reads it from the template at startup. No manual env config needed.

**Local Docker preview:**
```bash
docker build -t btc-site .
docker run --rm -p 8080:8080 btc-site
# → http://localhost:8080
```

---

## 🌐 Other hosts

Any static host works. Just upload the project root:

- **Cloudflare Pages**: drag-and-drop or Git import
- **GitHub Pages**: push to `gh-pages` branch or set "main / root" as source
- **Surge.sh**: `npx surge .`
- **Firebase Hosting**: `firebase init hosting && firebase deploy`
- **AWS S3 + CloudFront**: sync to S3 bucket with static site hosting enabled

---

## 🔑 Supabase configuration (required before deploy)

Edit [`assets/supabase-config.js`](assets/supabase-config.js) before deploying:

```js
window.SUPABASE_CONFIG = {
  url:     'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR-ANON-KEY-HERE'
};
```

Anon key is **safe to expose** — it's the public client key. Row-level security in your Supabase project controls actual data access. The four `.sql` files in this repo set up the required tables, roles, and RLS policies — run them in order in your Supabase SQL editor.

See [`SETUP_GUIDE.md`](SETUP_GUIDE.md) for the full Supabase setup walkthrough.

---

## ✅ Pre-deploy checklist

- [ ] `assets/supabase-config.js` has your real Supabase URL and anon key
- [ ] All four `SUPABASE_*.sql` files have been run in your Supabase SQL editor
- [ ] You've tested locally with `npm run dev` (or `python -m http.server 8765`) and the site looks right
- [ ] You know which custom domain you want (DNS pointing happens after first deploy)

---

## 🏃 Local development

```bash
# Pick any one — all serve the same static files

npm run dev                                 # uses http-server on port 8765
python -m http.server 8765                  # if you have Python
npx serve .                                 # if you have Node
```

Then open <http://localhost:8765/index.html>.

For Story Mode, open <http://localhost:8765/story-mode.html>.

---

## 📦 What's in this deploy package

```
bthechange-site/
├── index.html, about.html, team.html, ... 35 HTML pages
├── story-mode.html ............ 3D immersive ocean experience
├── assets/
│   ├── style.css .............. Site styles
│   ├── story-mode.css ......... 3D HUD overlay styles
│   ├── story-mode.js .......... Three.js scene + game logic
│   ├── supabase-config.js ⚠️ EDIT BEFORE DEPLOY
│   ├── *.jpg / *.png .......... images, logos, photos
│   └── reports/ ............... PDFs (annual report, awards)
├── programs/ .................. 11 program pages + support pages
│
├── vercel.json ................ Vercel deploy config
├── netlify.toml ............... Netlify deploy config
├── Dockerfile ................. Railway / container deploy
├── nginx.conf ................. nginx config used by Dockerfile
├── railway.json ............... Railway-specific hints
├── .dockerignore .............. exclude dev files from container
├── package.json ............... metadata + local dev scripts
├── .gitignore ................. git hygiene
│
├── SUPABASE_SETUP.sql ......... DB schema (run #1)
├── SUPABASE_ROLES_AND_AUDIT.sql .. profiles + roles (run #2)
├── SUPABASE_AWARD_NOMINATIONS.sql .. nominations (run #3)
├── SUPABASE_IMAGE_CLEANUP.sql ... pg_cron cleanup (run #4)
├── SETUP_GUIDE.md ............. full Supabase walkthrough
├── DEPLOY.md .................. you are here
└── README.md .................. project overview
```

---

## 🆘 Troubleshooting

**Story Mode page is blank** — Three.js loads from `cdn.jsdelivr.net`. If your network blocks it, vendor `three.min.js` locally and update the script tag in `story-mode.html`.

**Sign-in modal says "Sign-in is not configured"** — `assets/supabase-config.js` still has placeholder values. Edit it and redeploy.

**Vercel says "404"** — make sure "Output Directory" is `.` (the project root), not `dist` or `public`.

**Railway build fails** — check Docker logs in the Railway dashboard. Most common cause is the build cache; trigger "Redeploy" with cache cleared.

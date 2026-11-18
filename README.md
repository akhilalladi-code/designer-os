![DESIGNEROS — Diwali 2026](./assets/diwali-banner.svg)

# DesignerOS ✳

**A local-first creative workspace for graphic designers.** Bring projects, client details, brand identity, reusable assets, time sessions and practical design utilities into one focused place.

## Workspace features

- **Projects:** create, search, update status, assign a client and due date, and remove projects.
- **Clients & tasks:** keep a lightweight client directory and actionable task list with due dates and priorities.
- **Brand workspace:** edit brand profile, tagline, website, notes, color tokens and typography; export a JSON brand kit or standalone HTML guidelines.
- **Asset library:** upload image and font files (1 MB per file), tag and search assets, favorite, download and remove them.
- **Time tracker:** start, pause and save project sessions; the active timer survives a page refresh.
- **Creative AI assistant:** optional server-side OpenAI Responses API integration for structured creative direction. The API key is never sent to the browser.
- **Color studio:** HEX/RGB, color variations, CSS gradients and WCAG contrast ratio.
- **Typography studio:** modular type scale and live specimen.
- **Image toolkit:** local image preview and JPEG export with quality control.
- **Design calculators:** pixel/DPI print dimensions and common print presets.
- **Social presets:** searchable canvas dimensions for common social formats.
- **Light/dark theme** and responsive navigation.

## Data and privacy

The app is local-first. Projects, clients, tasks, brand settings, assets and time sessions are stored in the current browser's localStorage. Uploaded assets are encoded locally; no upload service is involved. Browser storage is device- and browser-specific, can be cleared by the user or browser, and is not a substitute for backups. Use **Export workspace data** in the sidebar, and separately export brand guidelines/JSON and download important assets. The workspace export does not embed uploaded asset binaries.

Image preview and JPEG conversion run in the browser. The AI assistant is disabled until configured; when enabled, the prompt and selected brand context are sent to the configured OpenAI API. Its same-origin check and in-process request throttle are best-effort safeguards, not user authentication; add host-level rate limiting and authentication before enabling it for an unrestricted public audience.

## Run locally

Requires Node.js 20.9+.

```bash
git clone https://github.com/akhilalladi-code/designer-os.git
cd designer-os
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Deployment

DesignerOS uses a Next.js server route for the optional AI assistant, so it cannot be hosted as a static GitHub Pages export. The repository includes a Vercel configuration for a Node-compatible Next.js deployment. See [deployment instructions](DEPLOYMENT.md). A hosting account and project connection are still required; no live deployment is claimed.

## Optional AI configuration

Set `OPENAI_API_KEY` in the server environment (never use a `NEXT_PUBLIC_` prefix). Optionally set `OPENAI_MODEL` (default: `gpt-4.1-mini`). The key is read only by the server route at `/api/assistant`. No AI request is made unless a user submits the assistant form.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

See [feature status](docs/FEATURES.md), [contributing](.github/CONTRIBUTING.md), and [security policy](SECURITY.md). MIT licensed.

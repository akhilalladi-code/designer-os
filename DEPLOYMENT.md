# Deployment

DesignerOS is a Next.js application with a server route at `/api/assistant`. It must run on a Node-compatible Next.js host; a static GitHub Pages export cannot execute that route.

## Recommended: Vercel

1. Import `akhilalladi-code/designer-os` from GitHub into a Vercel project.
2. Keep the framework preset as **Next.js** and the production branch as `main`.
3. Use the repository's `vercel.json` build/install settings.
4. Deploy without AI first. The local-first workspace tools do not require provider credentials.
5. If you want the AI assistant, add `OPENAI_API_KEY` as a server-side environment variable in the Vercel project. Optionally add `OPENAI_MODEL`. Do not use a `NEXT_PUBLIC_` prefix and never commit secrets.
6. Before enabling AI for an unrestricted public audience, add authentication and host-level/edge rate limiting. The route's same-origin check and in-process throttle are only best-effort safeguards and are not user authentication.

## Data considerations

Projects, clients, tasks, brand settings, assets and time sessions are stored in each user's browser. They are not backed up to the hosting provider and do not sync across devices. Users should export workspace metadata and download important assets independently.

## Verification

The GitHub Actions workflow runs dependency audit, TypeScript, ESLint, automated tests and a production build on pull requests and pushes to `main`. After connecting a hosting project, verify the deployment URL and the AI route configuration in that provider's dashboard.

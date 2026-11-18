# Feature status

## Implemented in the workspace

- Responsive dashboard, sidebar navigation and light/dark theme.
- Project register: create, search, client assignment, due date, status changes and delete.
- Client directory: create and remove client records.
- Task list: create tasks with project, due date and priority; complete/reopen and delete tasks.
- Brand workspace: editable profile, tagline, website, notes, up to twelve validated color tokens, heading/body font names, JSON export and standalone HTML guidelines export.
- Asset library: local image/font upload, per-file size validation, filename/tag search, tags, favorites, download and delete.
- Time tracker: start, pause, persist across refresh, save sessions and view session history.
- Creative AI assistant: optional server-side OpenAI Responses API integration with prompt validation, timeout and provider error handling.
- Color studio: HEX/RGB readout, color variations, CSS gradient and WCAG contrast calculation.
- Typography scale and live type specimen.
- Browser-local image preview and JPEG export.
- Pixel/DPI print calculator and common presets.
- Searchable social-media dimensions.
- Browser-local workspace backup export (project/client/task/brand/time metadata; asset files are downloaded separately).

## Storage boundaries

The workspace uses localStorage in the current browser. It does not provide authentication, cross-device synchronization, a cloud database, shared team workspaces or server-side asset storage. Large uploads can reach browser storage limits; individual asset uploads are limited to 1 MB and users should keep independent backups. No file is uploaded to a server by the asset library.

The AI assistant requires `OPENAI_API_KEY` on the server. Without it, the endpoint returns a setup message and does not send prompt data to an AI provider.

## Not implemented

- Authentication, cloud sync, multi-user collaboration and cloud asset storage.
- Full raster image editing, batch conversion and background removal.
- Client portal, invoicing, payment processing and external calendar integrations.
- Automatic font loading or license management.

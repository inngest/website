# Hosted Dev Server UI

The Dev Server UI is built from `inngest/ui/apps/dev-server-ui` and served as a
separate document at `/dev`.

The browser connects directly to `http://localhost:8288` to show run info.
The website only needs a public origin that serves the UI at `/dev` with assets
under `/dev`. The current UI build produces a Vercel artifact. A Cloudflare Pages
deployment needs its own routing adapter, but uses the same website rewrite.

## Deployment

1. Create a Vercel project from the `inngest` repository, with root directory
   `ui/apps/dev-server-ui` and access to files outside that root. The build needs
   the shared UI workspace and `pkg/coreapi` GraphQL schema.
2. Use the app's `vercel.json` and `pnpm build:hosted`. This writes a static Vercel
   Build Output API artifact. The existing CLI build remains `pnpm build`.
3. Set `DEV_SERVER_UI_ORIGIN` in this website project's environment to that UI
   deployment's origin, for example `https://your-dev-ui.vercel.app`. Do not append
   `/dev`. The deployment must accept public requests from the rewrite.
4. Deploy the website. The environment variable enables `/dev` rewrites and adds
   the entry page to the sitemap and Resources footer. Use a preview UI origin
   in website previews to review both applications together.

The UI deployment returns prerendered HTML for `/dev`, a noindex SPA shell for
known dashboard paths, and a 404 for unknown paths and missing assets. Only `/dev`
belongs in the sitemap. Its canonical URL is `https://www.inngest.com/dev`.

## Local review

In the UI app, run `pnpm dev:hosted --port 5173`. In the website, run
`DEV_SERVER_UI_ORIGIN=http://localhost:5173 pnpm dev`. Open
`http://localhost:3001/dev`. Run `inngest dev` separately to exercise connection,
event sending, function invocation, and run inspection.

Use an HTTPS preview for browser local-network permission checks. Verify a
stopped server, denied permission, an occupied port, a custom port, a running
server, and stopping/restarting the server while a run is open. Check refresh,
back/forward, new-tab links, keyboard navigation, and narrow viewports.

Removing `DEV_SERVER_UI_ORIGIN` and redeploying removes the route and sitemap
entry. The website build does not require the sibling repository to exist.

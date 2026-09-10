# Abdujabbor Shop - Cloudflare restore

This package preserves the old Next/Vinext storefront UI and adapts the backend for Cloudflare Workers.

## Storage
The existing KV namespace is reused:
- Binding: STORE
- Namespace ID: 1a6e85c7331c41dd83c74e2df99c0233

Products, contact settings and uploaded JPG/PNG/WebP images are stored in STORE.

## Admin
Admin email: joedeltaprime@gmail.com
The code reads Cloudflare Access header `Cf-Access-Authenticated-User-Email`.
Protect `/admin*` and `/api/admin/*` with Cloudflare Access and allow only the admin email.
Logout path: `/cdn-cgi/access/logout`.

## Deploy target
This is a Vinext/Next 16 app and must be deployed as a Cloudflare Worker, not as a static Pages output.

Build command:
`npm run build`

Deploy command:
`npx wrangler deploy`

Or locally:
`npm run deploy`

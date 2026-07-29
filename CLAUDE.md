# Meguri Cycle Tracker

## TODO

- **Deploy telemetry backend**: The anonymous telemetry client is built (`src/utils/telemetry.js`) and wired into the app, but dormant — no events are sent until `VITE_TELEMETRY_URL` is set. Once the app UI is settled, set up either a Cloudflare Worker (simpler) or Supabase Edge Function as the ingest endpoint. Schema is ready at `docs/telemetry-schema.sql`. This enables provable DAU/MAU, retention curves, and aggregate content CTR for brand pitches and exit readiness.

## Architecture

- Client-side React 19 + Vite 7 PWA, all user data in localStorage
- Phase system: sei (soft pink), me (pistachio green), ki (butter yellow), mi (warm peach)
- Fonts: Zen Kaku Gothic New (body) + Shippori Mincho B1 (headings)
- i18next for EN/JA bilingual support
- Subscription context with free/premium tiers (client-side only, no payment processor yet)
- Analytics: local engagement tracking in `src/utils/analytics.js`, server telemetry in `src/utils/telemetry.js`

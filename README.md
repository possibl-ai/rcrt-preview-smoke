# rcrt-preview-smoke

Minimal Vite + React fixture for smoke-testing the RCRT preview-service device-frame chrome.

**Not a product.** Zero external API or auth deps. Renders a mobile-styled UI that reacts to the viewport (shows current size, guesses the device preset, has interactive tiles + counter) so you can visually confirm:

- Device selector swaps the frame + iframe dimensions
- Orientation toggle actually flips it
- HMR fires when the repo changes
- WebContainer boot + Vite start flow works end-to-end

## Use

Open the preview-service with this repo in the hash:

```
https://rcrt-preview-service-jv46xfmdia-uc.a.run.app/#owner=possibl-ai&repo=rcrt-preview-smoke&branch=main
```

No `token`, `preview_token`, `api_url`, or `tenant_id` required — the app ignores all of them.

## Local dev

```bash
npm install
npm run dev
```

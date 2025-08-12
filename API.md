# AIOStreams API Reference

This document provides a complete, structured overview of every publicly exposed route on a self-hosted **AIOStreams** instance (v2+).  
Use it as a reference when building custom front-ends, integrating with third-party tools, or troubleshooting requests.

---

## 1. Base URLs

| Context | Base URL | Notes |
|---------|----------|-------|
| **Stremio Add-on protocol** (public) | `https://<host>/stremio/` | No auth required.  |
| **Stremio Add-on protocol** (authenticated) | `https://<host>/stremio/<uuid>/<encryptedPassword>/` | Replace placeholders with the user’s config credentials. |
| **REST API** | `https://<host>/api/v1/` | Versioned under `v1`. |
| **Built-in Add-ons** | `https://<host>/builtins/` | Internal helper routes. |

> **UUID / Encrypted Password**  
> Generated during the `/stremio/configure` flow.  Required for all _authenticated_ routes.

---

## 2. Stremio Add-on Protocol Routes

### 2.1 Public (No Authentication)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stremio/manifest.json` | Global manifest describing the add-on’s capabilities. |
| GET | `/stremio/configure` | Web UI for first-time configuration and re-configuration. |
| GET | `/stremio/configure.txt` | Plain-text configuration instructions. |
| GET | `/stremio/manifest.txt` | (Optional) Text mirror of the manifest. |
| GET | `/stremio/u/<alias>` | Alias resolver → redirects to the matching authenticated base URL. |

### 2.2 Authenticated (Requires `<uuid>/<encryptedPassword>`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stremio/<uuid>/<encryptedPassword>/manifest.json` | User-specific manifest (honors personal settings). |
| GET | `/stremio/<uuid>/<encryptedPassword>/stream/<type>/<id>.json` | List of playable streams for a movie, episode, etc. |
| GET | `/stremio/<uuid>/<encryptedPassword>/catalog/<type>/<id>.json` | Catalog listing (supports extra args & search). |
| GET | `/stremio/<uuid>/<encryptedPassword>/meta/<type>/<id>.json` | Detailed metadata for a single item. |
| GET | `/stremio/<uuid>/<encryptedPassword>/subtitles/<type>/<id>.json` | Available subtitle tracks. |
| GET | `/stremio/<uuid>/<encryptedPassword>/addon_catalog/<type>/<id>.json` | List of other add-ons bundled by AIOStreams. |

> **Path parameters**  
> • `type`: `movie`, `series`, `anime`, …  
> • `id`:  IMDB‐style IDs (`tt1234567`, `tt1234567:1:2`, etc.)

### 2.3 Legacy Compatibility

| Method | Path | Behaviour |
|--------|------|-----------|
| GET | `/<config?>/stream/<type>/<id>.json` | Returns a single “reconfigure” error-stream directing the user to `/stremio/configure`. |
| GET | `/<config?>/configure` | Redirects permanently to `/stremio/configure`. |

---

## 3. REST API (Version 1)

All endpoints live under `/api/v1/` and return JSON.

### 3.1 User & Auth

| Method | Path | Purpose |
|--------|------|---------|
| GET / POST / PUT / DELETE | `/api/v1/user` | CRUD for user profile & stored settings. |

### 3.2 System Health & Status

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/health` | Lightweight health-check (uptime, DB status). |
| GET | `/api/v1/status` | Extended diagnostics, environment information. |

### 3.3 Catalog & Formatting Utilities

| Method | Path | Purpose |
|--------|------|---------|
| Various | `/api/v1/catalogs` | Programmatic access to all configured catalogs. |
| POST | `/api/v1/format` | Validate / preview custom stream templates. |

### 3.4 Integrations

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/rpdb` | RPDB poster redirect & fallback. |
| GET / POST | `/api/v1/debrid` | Unified Debrid wrapper (Real-Debrid, AllDebrid, Premiumize). |
| GET / POST | `/api/v1/oauth/exchange/gdrive` | Google Drive OAuth token exchange. |

---

## 4. Built-in Helper Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/builtins/gdrive` | Internal Google Drive API proxy. |
| GET | `/builtins/torbox-search` | TorBox indexer & search helper. |

> These routes are guarded by **internal middleware** and are not intended for public consumption unless you understand the security implications.

---

## 5. Static & Asset Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/_next/*`, `/assets/*`, `/favicon.ico`, `/logo.png` | Front-end assets (Next.js build). |
| GET | `/static/<file>` | Pre-rendered video overlays (e.g. `downloading.mp4`, `403.mp4`). |
| GET | `/oauth/callback/gdrive` | HTML page that finalises Google Drive OAuth. |
| GET | `/` | Redirects to `/stremio/configure`. |

---

## 6. Error Overlay Files (`/static/`)

| Filename | Scenario |
|----------|----------|
| `downloading.mp4` | Content is being fetched or cached. |
| `download_failed.mp4` | Upstream fetch failed. |
| `unavailable_for_legal_reasons.mp4` | DMCA or legal removal. |
| `content_proxy_limit_reached.mp4` | Proxy bandwidth exceeded. |
| `500.mp4` | Generic server error. |
| `403.mp4` | Forbidden / permission error. |
| `401.mp4` | Unauthorised request. |
| `no_matching_file.mp4` | Could not match requested file. |

---

## 7. CORS & Rate-Limiting

* All **Stremio** routes add permissive CORS headers.  
* `/static/*` and large asset requests are throttled by `staticRateLimiter` middleware.

---

## 8. Versioning & Migration Notes

* **v2** introduces database-backed configs and the `uuid/encryptedPassword` scheme.
* Legacy v1 routes remain for backward compatibility but only return a re-configure prompt.

---

## 9. Quick-Start Checklist for Custom Front-Ends

1. **Configure** the add-on once via `/stremio/configure`; store the returned UUID & encrypted password.
2. **Query** `/stremio/<creds>/manifest.json` to discover capabilities.
3. **Fetch** catalogs → pick items → request streams.
4. **Display** errors or overlays using the `/static/…` resources as needed.
5. **Monitor** system health via `/api/v1/health` and `/api/v1/status`.

---

© 2025 AIOStreams / ElfHosted

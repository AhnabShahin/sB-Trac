# Demo Data — site content snapshots

This folder holds the **complete, editable text + image content** of the B-TEL
marketing site, captured page by page as JSON. It is the content layer that the
future admin panel ("WordPress-style") will read, preview and write back.

## Why this exists

The page **designs are fixed** (built in the Next.js frontend). What changes
between a demo site and the real launch is only the *content* — headings, copy,
stats, images, project lists, etc. These JSON files are that content, pulled
straight from the live frontend so they match exactly what renders today.

The plan:

1. **Now (this folder):** one JSON file per page under `pages/`, plus shared
   chrome in `global.json`. Every visible string and image path is captured.
2. **Admin panel (next):** list every page, render a live preview from its JSON,
   and let an editor change the content section-by-section — the design never
   changes, only the values in these files.
3. **One-click publish:** apply a page's JSON back into the site (Phase 2 swaps
   the frontend's `src/data/*` functions for API calls that return this shape),
   so the whole demo content can go live at once.

## Structure

```
demo-data/
  README.md          ← this file
  global.json        ← shared chrome: site identity, header nav, footer
  pages/
    home.json        ← the "/" landing page (done)
    ...              ← other pages added one at a time
  media/             ← the ACTUAL image/video files, bundled with the content
    logo.png
    assets/
      hero/ badges/ timeline/ video/ logos/clients/
```

### Schema (per page file)

```jsonc
{
  "page":    { "id", "route", "name", "seo": { ... } },
  "sections": [
    {
      "key":       "stable id for this section",
      "component": "the frontend component that renders it (reference only)",
      "label":     "human name shown in the admin page/section list",
      "content":   { ...all editable fields for this section... }
    }
  ]
}
```

Notes:

- **Section order** in the `sections` array matches top-to-bottom render order
  on the page, so the admin preview can list them in the same order.
- **Images / video** are referenced in the JSON by their public URL path (e.g.
  `/assets/hero/solar.jpg`), and the **actual files are bundled** under
  `media/`, mirroring that exact path. So the mapping is a straight prefix:

  | JSON path (public URL)        | Bundled file                              |
  | ----------------------------- | ----------------------------------------- |
  | `/logo.png`                   | `media/logo.png`                          |
  | `/assets/hero/solar.jpg`      | `media/assets/hero/solar.jpg`             |
  | `/assets/logos/clients/x.png` | `media/assets/logos/clients/x.png`        |

  i.e. `media/` + (JSON path without the leading `/`). This keeps the demo
  **self-contained**: when the frontend goes dynamic, the publish step uploads
  the files from `media/` and the JSON already holds the paths they resolve to.
  `webp`/`jpg` pairs and `alt` text are kept together in the JSON.
- `key` values are intended to be **stable** — the admin maps edits by `key`,
  so renaming one is a breaking change.
- `global.json` is shared by every page (header + footer render on all of them),
  so it is stored once rather than duplicated into each page file.

> Folder is named `demo-data` (hyphen, no space) so it is safe to reference from
> code, routes and CLI. Content captured from the running frontend at `/`.

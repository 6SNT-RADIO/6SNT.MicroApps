# AGENTS.md - 6SNT.MicroApps

## Scope

- This repository publishes the public catalog for 6SNT micro apps through GitHub Pages.
- Keep it static: HTML, CSS, small JavaScript, JSON data and safe media assets.
- Do not add private app source code, binaries, credentials, station data, logs or private screenshots.

## Language

- English is primary at `/`.
- Spanish is optional at `/es/`.
- App details follow the same pattern: `/apps/<id>/` and `/es/apps/<id>/`.

## Data

- App catalog data lives in `docs/data/apps.en.json` and `docs/data/apps.es.json`.
- Only use sanitized screenshots and public-safe descriptions.
- Private source repositories may be linked only when the audience is expected to have access.

## Verification

- Open `docs/index.html` through a local static server before publishing.
- Check desktop and mobile widths.
- Run a filename-only sensitive-data scan before pushing.

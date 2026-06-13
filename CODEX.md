# Maintenance

## Local preview

```powershell
python -m http.server 4173 -d docs
```

Open:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/es/
http://127.0.0.1:4173/apps/cpt/
```

## GitHub Pages

Publish from:

```text
main / docs
```

## Content rules

- Keep public copy in English first.
- Keep Spanish pages aligned but secondary.
- Do not upload release binaries here.
- Do not expose private station data.
- Use `docs/data/*.json` as the source for catalog entries.

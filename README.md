# Super Mario Bros (Construct 2) — HTML5 export

This repository hosts the **official HTML5 export** from **[Jcw87/c2-smb1](https://github.com/Jcw87/c2-smb1)** (branch **`gh-pages`**): the same files as the upstream demo, so the site matches that project **exactly** (Construct 2 runtime + bundled assets).

- **Upstream source project:** [github.com/Jcw87/c2-smb1](https://github.com/Jcw87/c2-smb1) (MIT)
- **Update:** Re-copy from `gh-pages` when you want to sync with upstream (see below).

The previous custom “Gavin Adventure” canvas codebase was removed in favor of this export.

## Run locally

```bash
npx http-server . -p 8000 -c-1
```

Open the printed `http://localhost:8000/` URL (serving over `http://` avoids `file://` limitations noted in `index.html`).

## Syncing from upstream

```bash
git clone --branch gh-pages --single-branch --depth 1 https://github.com/Jcw87/c2-smb1.git _upstream_pages
# Copy everything except .git from _upstream_pages/ into this repo root, commit, push.
```

Remove the embedded Google Analytics block from `index.html` if you forked from upstream and do not want their measurement ID on your domain (this fork may omit it).

## License

See the [c2-smb1 repository](https://github.com/Jcw87/c2-smb1) for license terms. Nintendo retains rights to Mario-related IP.

# Sagar Chhatrala — portfolio

The Option 1 portfolio and two project pages share the same visual identity:

- `https://sagarchhatrala.github.io/` — personal homepage
- `https://sagarchhatrala.github.io/agent-circuit-breaker/` — ACB
- `https://sagarchhatrala.github.io/horizon-agent-containment/` — HAC, including its scenarios

Static HTML, CSS, local fonts, and progressively enhanced JavaScript. No dependency installation is required to build the website. The examples replay recorded Python results; browser interaction never executes tools or commands.

## Local review

```powershell
python scripts/build_site.py
python scripts/check_site.py
python -m http.server 8767 --bind 127.0.0.1 --directory _site
```

Open http://127.0.0.1:8767/. The build includes only the three page entry points, their assets, and machine-readable information. It excludes repository files and retired page directories.

## Publishing

The `Publish portfolio` GitHub Actions workflow validates and deploys `_site` on pushes to `main`. This repository owns both project paths. The ACB and HAC code repositories keep their source, tests, and documentation on GitHub; they do not run separate GitHub Pages sites.

Retired routes such as `/hac/`, `/hac-demo/`, and `/horizon-agent-containment/presentation/` are deliberately absent from the deployment. Documentation and code links point to GitHub. `sitemap.xml` includes only the homepage and the two project pages.

## Content

- `index.html`, `styles.css`, `app.js`: Option 1 portfolio.
- `agent-circuit-breaker/`: ACB project, interactive policy checks, and approval walkthrough. Evidence recorded from v1.6.9 at `55b9646`.
- `horizon-agent-containment/`: HAC project and three scenario replays. Evidence recorded from prototype v0.1.0 at `639a641`.
- `profile.json`, each project's `project.json`, and `llms.txt` files: structured and plain-text information for humans and AI readers.
- `scripts/build_site.py`: explicit publication file list.
- `scripts/check_site.py`: verifies routes, local references, data, and retired-route exclusion.

Keep project status and professional facts consistent across visible content and metadata. ACB is beta with a single-host trusted runtime boundary. HAC is a research prototype around explicitly modeled state. The FAUN.toolbox link refers to its directory listing and scorecard.

The previous Option 1 snapshot and Option 2 remain in the local workspace under `../website-options/`; they are not published. Retired local page files were preserved in `../website-options/option-1-before-publication-20261020/` before removal.

## Assets

Manrope and Instrument Serif are self-hosted under the SIL Open Font License. Their licenses are in `assets/`. The portrait is the existing public GitHub profile image.

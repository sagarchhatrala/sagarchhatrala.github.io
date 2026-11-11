# Sagar Chhatrala — portfolio

The portfolio, experience explorer, and project pages share the same visual identity:

- `https://sagarchhatrala.github.io/` — personal homepage
- `https://sagarchhatrala.github.io/experience/` — The long view: career chapters, advisory work, research, expertise, and contributions
- `https://sagarchhatrala.github.io/agent-circuit-breaker/` — ACB
- `https://sagarchhatrala.github.io/horizon-agent-containment/` — HAC, including its scenarios
- `https://sagarchhatrala.github.io/purpose-trace/` — PurposeTrace

Static HTML, CSS, local fonts, and progressively enhanced JavaScript. No dependency installation is required to build the website. The examples replay recorded Python results; browser interaction never executes tools or commands.

## Local review

```powershell
python scripts/build_site.py
python scripts/check_site.py
python -m http.server 8767 --bind 127.0.0.1 --directory _site
```

Open http://127.0.0.1:8767/ for the homepage or http://127.0.0.1:8767/experience/ for the experience explorer. The build includes only the five page entry points, their assets, and machine-readable information. It excludes repository files and retired page directories.

For a preview without a server, run `python3 scripts/preview_site.py` and open `_preview/index.html` in a browser. This creates a separate local copy with directory links resolved to HTML files. `_preview` is ignored by Git and excluded from publication.

The homepage has an interactive map of engineering, research, and advisory work; ACB and KECHAA project studies; a short personal introduction; a speaking ledger; and a contact panel that prepares a subject in the visitor's email app. All content and direct links remain available without JavaScript. Homepage styling lives in `home.css`, which is loaded only by the homepage. Keep shared `styles.css` and the Experience files unchanged when refining this design.

The experience explorer supports company selection, arrow/Home/End keyboard navigation, direct chapter links such as `/experience/#tenable`, and a “Read all chapters” view. Without JavaScript, every career chapter remains visible. Figures and professional details are based on the author’s resume; the KECHAA description reflects its experimental status.

## Publishing

The `Publish portfolio` GitHub Actions workflow validates and deploys `_site` on pushes to `main`. This repository owns the portfolio and project paths. The ACB and HAC code repositories keep their source, tests, and documentation on GitHub; they do not run separate GitHub Pages sites.

Retired routes such as `/hac/`, `/hac-demo/`, and `/horizon-agent-containment/presentation/` are deliberately absent from the deployment. Documentation and code links point to GitHub. `sitemap.xml` includes the five public pages.

## Content

- `index.html`, `home.css`, `app.js`: personal homepage; `styles.css` supplies shared base styles also used by Experience.
- `experience/`: interactive career explorer and professional background, including Rig Security, AirMDR, ACB, and KECHAA.
- `agent-circuit-breaker/`: ACB project, interactive policy checks, and approval walkthrough. Updated for v1.7.2: separate owner service, SQLite/S3 operations, cumulative budgets, fresh policy/approval evidence, published release reports, and v1.7.1 migration notes. The captioned video remains explicitly v1.7.0. The published theme remains in `agent-circuit-breaker/styles.css`; `release.css` styles only the added release sections.
- `horizon-agent-containment/`: HAC project and three scenario replays. Evidence recorded from prototype v0.1.0 at `639a641`.
- `profile.json`, each project's `project.json`, and `llms.txt` files: structured and plain-text information for humans and AI readers.
- `scripts/build_site.py`: explicit publication file list.
- `scripts/check_site.py`: verifies routes, local references, data, and retired-route exclusion.

Keep project status and professional facts consistent across visible content and metadata. ACB is beta with a single-host trusted runtime boundary. HAC is a research prototype around explicitly modeled state. The FAUN.toolbox link refers to its directory listing and scorecard.

The previous Option 1 snapshot and Option 2 remain in the local workspace under `../website-options/`; they are not published. Retired local page files were preserved in `../website-options/option-1-before-publication-20261020/` before removal.

## Assets

Manrope and Instrument Serif are self-hosted under the SIL Open Font License. Their licenses are in `assets/`. The portrait is the existing public GitHub profile image.

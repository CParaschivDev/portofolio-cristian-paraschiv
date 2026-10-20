# Cristian Paraschiv · Data Science & AI Portfolio

Personal portfolio of Cristian Paraschiv, MSc Data Science and Artificial Intelligence (Distinction) and BSc Cloud Computing (First Class).

**Live site:** https://cparaschivdev.github.io/portofolio-cristian-paraschiv/
**CV (PDF):** https://cparaschivdev.github.io/portofolio-cristian-paraschiv/Cristian-Paraschiv-CV.pdf

## What's inside

- Selected ML, data, and web projects with case studies (problem, solution, impact, stack)
- Project search and category filters
- English / Romanian interface, dark and light themes
- Recruiter mode: a clean, distraction-free view with a quick summary and CV download
- Stealth mode for reduced effects (enabled automatically when the OS asks for reduced motion)
- Command palette (`Ctrl+K` or `/`) for quick navigation

## Tech stack

React 19, Vite, plain CSS. Deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to `main`.

## Run locally

```bash
npm install
npm run dev      # development server
npm run lint     # ESLint
npm run build    # production build in dist/
```

## Updating the CV

The CV sources are `public/Cristian-Paraschiv-CV.html` (English) and `public/Cristian-Paraschiv-CV-RO.html` (Romanian). After editing one, regenerate the matching PDF (`Cristian-Paraschiv-CV.pdf` / `Cristian-Paraschiv-CV-RO.pdf`) by printing the HTML page to PDF (A4) from Chrome or with Playwright. The site links the CV that matches the selected language.

## Tests

```bash
npm run test:e2e   # Playwright smoke tests against the production build
```

CI (`.github/workflows/ci.yml`) runs lint, build and these tests on every pull request.

## Contact

- Email: paraschiv.cristian93@outlook.com
- GitHub: [CParaschivDev](https://github.com/CParaschivDev)
- LinkedIn: [cristian-constantin-paraschiv](https://www.linkedin.com/in/cristian-constantin-paraschiv-6002b0257/)

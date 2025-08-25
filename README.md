This repository contains a markdown-based wiki. A GitHub Actions workflow is included to build the site using MkDocs and deploy it to GitHub Pages.

Quick start (local preview):

1. Create and activate a Python 3 virtual environment.
2. Install dependencies: pip install -r requirements.txt
3. Serve locally: mkdocs serve

Notes:
- The site home page is configured to `Project Overview.md` in `mkdocs.yml`.
- The workflow triggers on pushes to the `main` branch. If your default branch is different, update `.github/workflows/deploy-wiki.yml`.
- GitHub Pages will be populated by the workflow using `peaceiris/actions-gh-pages`.

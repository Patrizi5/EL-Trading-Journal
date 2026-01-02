Accessibility update — summary

What I changed in this branch (high level):
- Added a skip link (`<a href="#main">Skip to main content</a>`).
- Added `aria-label` to icon-only and CTA buttons (theme, mobile menu, user menu, get-started, login, new-trade, new-note, chart controls, export, pagination, etc.).
- Added `role="dialog" aria-modal="true"` and `aria-labelledby` for modals and `aria-label` on modal close buttons.
- Mirrored the same edits in `dist/index.html` and `.gh-pages/index.html` so deployed site reflects fixes.
- Added a small `tools/axe-scan-src.js` helper and re-ran the axe scan; results are at `axe-results.json`.

Why: these fixes address many of the high-impact accessibility findings (unlabeled controls, missing skip link, missing dialog semantics) identified by the axe-core scan.

Next recommended steps:
1. Triage remaining issues in `axe-results.json` (focus on `label`, `button-name`, and any `landmark`/`heading` items flagged as critical/serious).
2. Add visible labels or `aria-labelledby` for form controls that currently rely on placeholders. Prefer visible `<label>` where layout allows; use visually-hidden labels (CSS `.sr-only`) when necessary.
3. Implement keyboard focus management for modals (focus trap on open, restore focus on close).
4. Mark purely decorative images/SVGs with `aria-hidden="true"` or provide alt text.
5. Run a Chrome-based Lighthouse audit when environment permissions allow to cross-check results (Lighthouse gives additional suggestions and contrast stats).

Files changed (key):
- `index.html` — accessibility edits
- `dist/index.html` — mirrored edits
- `.gh-pages/index.html` — mirrored edits
- `tools/axe-scan-src.js` — helper to run axe against `index.html`
- `axe-results.json` — latest scan output (in project root)

If you want, I can:
- Post this as a comment to PR #1 (I couldn't run `gh` here); you can copy this file into the PR comment, or I can push it as a branch commit (already pushed edits) and create a file under `.github/PR_COMMENTS/` (this file) for you to copy.
- Start applying fixes for the next-highest priority items from `axe-results.json` (form labels and modal focus management). Let me know which action you prefer.

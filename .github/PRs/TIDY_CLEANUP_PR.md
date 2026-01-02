## Tidy/Cleanup: Consolidate files, fix build & lint

Summary
- Standardized page filenames under `Pages/` and consolidated duplicate extension-less files.
- Converted UI components with JSX to `.jsx` sources and kept `.js` wrappers to avoid parser errors.
- Backed up removed/changed files under `backups/_consolidation` and `backups/_removed`.
- Added a minimal `src/lib/supabase.ts` to satisfy imports and installed `@supabase/supabase-js`.
- Fixed build issues; `vite build` completes successfully.

Backups
- ZIP archive: `backups/removed_files.zip`
- Full consolidation backup: `backups/_consolidation/`

Testing
- Run `npm install` then `npm run dev` and exercise Dashboard, Journal, Watchlist, Trades, Notes.
- Build: `npm run build` — artifacts produced in `dist/`.

Notes for reviewers
- Focus on `Pages/` pages and `src/components/ui/` for re-export patterns.
- Lint: remaining warnings addressed where practical; some page-level unused-vars remain intentionally.

If you want me to open a GitHub PR directly, I can do so if provided a GitHub token or if `gh` CLI is installed in your environment.

---
name: project-sveltekit-site
description: SvelteKit static site in site/ subdirectory — architecture, content loading, build workflow
metadata:
  type: project
---

New SvelteKit site lives in `site/` (sibling to existing Quartz content in repo root).

**Content loading**: Uses Node.js `fs` + `gray-matter` + unified/remark/rehype pipeline in `+page.server.ts` files. Content is read from `../../content/essays/` and `../../content/notes/` (resolved via `__CONTENT_ROOT__` define in `vite.config.ts`).

**Why:** `import.meta.glob` can't cross the Vite project root boundary cleanly; `fs` approach is simpler and reliable for static prerendering.

**Math**: `remark-math` + `rehype-katex` in the unified pipeline; KaTeX CSS loaded from jsdelivr CDN in `app.html`.

**Search**: Pagefind — runs as `postbuild` script (`pagefind --site build`). `/search` route loads `/pagefind/pagefind.js` at runtime; this import is externalized in `vite.config.ts`.

**Build**: `cd site && npm install && npm run build` — outputs to `site/build/`. Flake `packages.default` uses `buildNpmPackage` with a placeholder `npmDepsHash` that must be replaced after first `nix build` attempt.

**Note**: Svelte 4 + @sveltejs/kit 2.5.28 shows runtime warnings about `untrack/fork/settled` not exported — harmless, Kit works with Svelte 4.

**How to apply:** When modifying content loading, routing, or build config, check `site/src/lib/content.ts` and `site/vite.config.ts` first.

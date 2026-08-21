# YouTube Advanced Search

## Project overview
This is a React + TypeScript + Vite app for searching YouTube videos with filters that are not available in the default YouTube UI. The app uses the YouTube Data API v3 to support keyword search plus view/subscriber thresholds, region and language targeting, excluded channel regions, and date presets.

## Tech stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- lucide-react
- date-fns
- React Context for search state (`useYouTubeSearch`)

## Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build app: `npm run build`
- Preview production build: `npm run preview`
- Add shadcn component: `npx shadcn@latest add <component>`
- Run lint: `npm run lint`

## Project conventions
- Use absolute imports with `@/` for shared app modules.
  - `@/components/...` for app and UI components
  - `@/types` for shared types in `src/types.ts`
  - `@/utils` for shared logic such as duration/number helpers
  - `@/lib/utils` for Tailwind helpers like `cn()`
  - `@/constants/...` for shared constants and option data
- Keep component-specific logic next to the component when it is not reused elsewhere.
- Sort imports in this order: React/external packages, internal aliases, then relative paths.
- Prefer functional components with arrow functions and explicit props interfaces ending in `Props`.
- Prefer `interface` over `type` for object shapes.
- Prefer the existing context pattern in `src/context/youtube-search-context.tsx` for search state.

## UI and styling
- Use shadcn component primitives for inputs, selects, buttons, switches, and dialogs instead of raw HTML form controls.
- Wrap dynamic Tailwind classes with `cn()` from `@/lib/utils`.
- Use semantic Tailwind tokens such as `text-foreground`, `bg-background`, `border-border`, and `text-muted-foreground`.
- Use lucide-react icons only.
- Keep UI patterns consistent with the existing components under `src/components`.

## TypeScript and React rules
- Name event handlers clearly, for example `handleNumberChange`, `handleDateSelect`, and `handleSubmit`.
- Use early returns for validation and guard conditions instead of deep nesting.
- Keep shared global types in `src/types.ts`.
- Do not add new app-wide state unless it clearly belongs in the established context.

## Date and duration handling
- Use `date-fns` for date-related formatting and comparisons.
- Prefer the existing tooling in `src/utils/duration.ts` for YouTube ISO 8601 duration parsing.
- Keep date presets consistent with the current app behavior: `Today`, `This Week`, and `This Month`.

## Verification
- After meaningful changes, run the relevant validation command before considering the task complete.
- For frontend changes, the primary check is `npm run build`.
- For repo-wide hygiene or lint-driven work, run `npm run lint`.
- Prefer the smallest verification that checks the changed behavior.

## Working notes
- This project expects a valid YouTube Data API key in `.env` under `VITE_YOUTUBE_API_KEY`.
- Keep changes aligned with the existing architecture rather than introducing a new state or utility pattern unless the feature truly requires it.
- Prefer project patterns already used in the codebase over inventing new abstractions.

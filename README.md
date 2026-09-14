# Immersive portfolio — solution architecture, cloud, DevOps

A single-route, backend-free personal portfolio. A persistent 3D environment sits
behind the page while the introduction, navigation and content panels are plain,
server-rendered HTML.

## Product shape

- One route: `/`. There is **no** `/cv` route and no separate standard CV page.
- Four sections — About, Experience, Projects, Contact — switched by a persistent
  HTML menu. Changing section never recreates the 3D canvas.
- CV information is integrated into the immersive experience itself. Until real
  content is supplied, every personal field is an explicit placeholder; no
  employers, dates, metrics, contact details, links or CV downloads are invented.
- No database, authentication, CMS or server API. All content lives in
  `src/content/portfolio.ts` behind the types in `src/content/portfolio.types.ts`.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/routes/index.tsx` | The single route and its page metadata |
| `src/components/portfolio/` | Header, navigation, content panel and section renderers |
| `src/components/scene/` | Canvas, procedural scene, camera, Bloom, lifecycle, failure handling |
| `src/context/` | Navigation state and visual preferences |
| `src/content/` | Typed local content (independent of scene coordinates) |

The scene is loaded client-side only and never blocks the page. If WebGL 2 is
missing, the module fails to download, the renderer fails to start or the
graphics context is lost, a static background and a short status message replace
the environment while all content stays usable. Recovery is always a deliberate
button press — nothing retries automatically.

## Development

Requires Node.js and npm (or Bun).

```sh
npm i
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm test` | Vitest regression checks |

## Built with

- TanStack Start, React, TypeScript, Vite
- Three.js via @react-three/fiber, drei, @react-three/postprocessing
- Tailwind CSS

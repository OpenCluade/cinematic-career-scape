# Immersive 3D Portfolio — Plan (Layer 1 scope)

Note on the reference: I cannot load or inspect activetheory.net's live interactive behaviour from here, so nothing below claims to reproduce its specific transitions. The direction comes from your written brief: dark charcoal/deep blue, restrained cyan, architectural forms, fog, slow camera, subtle interaction.

## 1. What exists today

- TanStack Start v1 (React 19.2, Vite 8, file routes in `src/routes`, server rendering on by default). This application framework is retained.
- Root layout `src/routes/__root.tsx` with placeholder title/description; home page `src/routes/index.tsx` is still the blank template placeholder.
- Tailwind CSS v4 configured via `src/styles.css` with a default light/dark token set (needs replacing with the portfolio palette).
- Full shadcn/ui component library, TanStack Query, lucide icons, sonner already installed.
- No 3D libraries, no GSAP, no content module, no components beyond `src/components/ui`.

## 2. Packages and compatibility

Verified latest versions against each other:

| Package | Version | Note |
| --- | --- | --- |
| three | 0.186.0 | postprocessing requires `< 0.187`, so pin `0.186.x` |
| @react-three/fiber | 9.7.0 | requires React `>=19 <19.3` — project is 19.2, OK |
| @react-three/drei | 10.7.8 | requires fiber ^9, React ^19, three >=0.159 |
| @react-three/postprocessing | 3.1.1 | requires fiber >=9.7.0, postprocessing ^6.36 |
| postprocessing | 6.39.5 | peer three `>=0.168 <0.187` |
| gsap | 3.15.0 | no peers |
| @types/three | matching 0.186 | dev dependency |

All peer ranges resolve cleanly — no `--legacy-peer-deps`, no overrides. Constraint to respect: do not bump three to 0.187+ while `postprocessing` 6.39 is in use. `@react-three/rapier` is deliberately not installed (Layer 6 only).

## 3. Framework constraints that shape the architecture

- The app server-renders. `<Canvas>`, WebGL detection and anything touching `window` must not run on the server. The 3D scene is mounted through a client-only boundary; all HTML content (menu, panels, CV view) renders in normal SSR HTML so it works before and without WebGL.
- Routes are file-based. Section state (About/Experience/Projects/Contact) must not remount the Canvas, so sections are driven by shared state on one route, with the standard CV view as its own route (`/cv`).
- No database, auth or CMS.

## 4. Proposed structure

```text
src/
  routes/
    index.tsx            immersive experience (Canvas + HTML overlay)
    cv.tsx               standard, no-3D CV view (same data source)
  content/
    profile.ts           name, title, intro, expertise (placeholders)
    experience.ts        id, company, role, start/end, summary,
                         contributions[], technologies[], outcomes[],
                         relatedProjectIds[]
    projects.ts          id, problem, role, architecture, technologies,
                         results
    contact.ts           links + CV file reference (placeholders)
    types.ts
  scene/
    SceneCanvas.tsx      single persistent Canvas, DPR cap 1.5, pause when hidden
    Environment.tsx      procedural architecture, fog, lighting
    CameraRig.tsx        sole owner of camera movement (GSAP, Layer 3)
    Effects.tsx          restrained Bloom + vignette
    chapters.ts          named points of interest
  experience/
    NavigationProvider.tsx  active chapter + panel state
    SiteNav.tsx             persistent semantic HTML menu
    ContentPanel.tsx        focus-managed panel
    WebGLFallback.tsx / SceneErrorBoundary / LoadingState
  hooks/
    use-reduced-motion.ts, use-webgl-support.ts, use-page-visibility.ts
```

Per-frame work stays in `useFrame`/refs, never React state. GSAP timelines are killed on unmount and on interruption.

## 5. Layer 1 checklist

1. Install the pinned dependency set above; confirm the lockfile resolves without peer warnings.
2. Replace the design tokens in `src/styles.css` with the charcoal / deep-blue / cyan palette, and set typography and spacing scale.
3. Content modules with typed shapes and explicit `[placeholder]` values — no invented companies, dates, metrics or contact details.
4. Client-only `SceneCanvas`: one persistent Canvas, WebGLRenderer, DPR capped at 1.5, rendering paused when the tab is hidden.
5. Simple procedural environment: ground plane, a few architectural volumes, fog, one key light plus ambient. Camera fixed in Layer 1.
6. `Effects.tsx` with restrained Bloom, disabled when reduced motion or low-capability is detected.
7. Persistent HTML nav (semantic `<nav>`, real buttons, visible focus rings) + four placeholder panels. Switching panels changes only overlay state — the Canvas is never remounted.
8. Fallbacks: loading state, unsupported-WebGL message, error boundary around the scene. HTML stays usable in all three cases.
9. `/cv` route rendering the same data without 3D; "View CV" and "Contact" always reachable.
10. Route metadata: unique title/description/og tags for `/` and `/cv`.
11. Verify: production build, type check, desktop (1440) and narrow mobile (375) layouts, browser console clean of runtime and hydration errors, screenshot evidence of the lit scene with Bloom.
12. Report what was checked, what was not, and anything unresolved.

## 6. Roadmap after Layer 1

- **Layer 2** — developed architectural environment: material system, layered fog, glowing focal surfaces, tunable visual parameter module.
- **Layer 3** — chapter destinations, GSAP camera transitions owned by `CameraRig`, interrupt-safe (a new selection retargets the live tween), panel/camera sync, reduced-motion path that jumps instead of travels.
- **Layer 4** — your real CV content, company/project detail, CV download file, professional links.
- **Layer 5** — transition and postprocessing polish; optional particles and opt-in sound with a persistent mute control, each evaluated separately.
- **Layer 6** — Rapier only if a specific approved interaction needs it, kept out of CV navigation.
- **Layer 7** — release pass: mobile, accessibility, metadata, fallbacks, production behaviour, deployment.

## 7. Decisions I need from you

1. **CV route path** — I propose `/cv` for the standard text view. Fine?
2. **Placeholder identity** — until you send the CV, should the visible name read literally as `[Your Name]`, or do you want your real name and title in Layer 1 (send them and I'll use them)?
3. **Chapter count** — I'll design the environment around four chapters (About, Experience, Projects, Contact). If Experience should later split per company into its own point of interest, tell me now so the layout leaves room.
4. **Entry screen** — do you want an explicit "Enter" gate before the scene starts, or land directly in the environment with content immediately readable?

# Immersive 3D Portfolio — Revised Plan

## Reference limitation

I could not reliably inspect Active Theory’s live interactive behavior in this environment. The implementation will therefore use the written direction as the source of truth: an original dark architectural environment, layered depth, fog, selective cyan/teal emission, deliberate motion, and readable HTML content. It will not claim to reproduce unobserved interactions or assets.

## 1. Confirmed current project setup

- **Framework:** TanStack Start v1 with file-based TanStack Router, React 19.2, TypeScript 5.8, Vite 8, and server rendering enabled.
- **Styling:** Tailwind CSS v4 through `src/styles.css`, currently using the template’s generic semantic color tokens.
- **UI foundation:** shadcn-style UI components, Lucide icons, TanStack Query, and supporting utilities are already installed.
- **Current pages:** only `/` exists. It is still the blank starter page. There is no `/cv` route, and none will be created.
- **Root document:** the shared root layout and error handling exist, but metadata is still generic placeholder content.
- **3D stack:** Three.js, React Three Fiber, Drei, React Postprocessing, Postprocessing, and GSAP are not yet installed.
- **Backend:** none is connected or required. Portfolio data will remain in typed local files.
- **Package policy:** Bun uses a 24-hour minimum package release age. The proposed versions are older than that threshold and need no exception.

## 2. Dependency compatibility findings

Install these additions at exact versions:

| Package | Exact version | Compatibility finding |
| --- | ---: | --- |
| `three` | `0.186.0` | Satisfies Fiber, Drei, and Postprocessing; must remain below `0.187.0` for Postprocessing 6.39.5 |
| `@react-three/fiber` | `9.7.0` | Requires React and React DOM `>=19 <19.3`; current `19.2.x` is compatible |
| `@react-three/drei` | `10.7.8` | Requires Fiber `^9`, React `^19`, and Three `>=0.159`; compatible |
| `@react-three/postprocessing` | `3.1.1` | Requires Fiber `>=9.7.0`, React `^19`, Three `>=0.156`, and Postprocessing `^6.36`; compatible |
| `postprocessing` | `6.39.5` | Requires Three `>=0.168 <0.187`; compatible with Three 0.186.0 |
| `gsap` | `3.15.0` | No conflicting peer requirement; installed now for the agreed architecture but camera choreography waits until Layer 3 |
| `@types/three` | `0.186.0` | Matches the selected Three release; development dependency |

No React or React DOM change is required. Installation will use normal exact-version resolution only—no forced installation, peer-dependency bypass, or compatibility override. The resolved dependency tree and lockfile will be checked after installation. `@react-three/rapier` will not be installed in Layer 1.

## 3. Adjusted architecture

```text
src/
  routes/
    index.tsx                    single portfolio route and route metadata

  content/
    portfolio.types.ts          typed content contracts and stable ID types
    portfolio.ts                About, Experience, Projects, Contact placeholders

  components/portfolio/
    PortfolioPage.tsx           persistent page composition and navigation state
    PortfolioHeader.tsx         identity, persistent navigation, Reduce effects
    SectionNavigation.tsx       About / Experience / Projects / Contact controls
    ContentPanel.tsx            non-modal, scrollable section presentation
    sections/                   section-specific HTML renderers using shared data
    SceneStatus.tsx             concise loading/failure status

  components/scene/
    SceneBoundary.tsx           lazy client-only loading and module-failure handling
    SceneErrorBoundary.tsx      React render/init error handling
    WebGLSupport.tsx            explicit WebGL 2 capability check
    PortfolioCanvas.tsx         the single persistent R3F Canvas
    ArchitecturalScene.tsx      procedural geometry, ground, fog, lighting
    BloomEffects.tsx            Bloom only; controlled by effects preference
    GraphicsLifecycle.tsx       visibility, resize, invalidation, context events
    CameraController.tsx        sole future camera-motion owner; fixed in Layer 1
    scene-config.ts             tunable visual and rendering parameters

  context/
    PortfolioNavigation.tsx     active section and optional selected entry ID
    VisualPreferences.tsx       Reduce effects and live reduced-motion preference

  hooks/
    useReducedMotion.ts         listens for system preference changes
    usePageVisibility.ts        pauses/suspends avoidable graphics work
    useWebGL2Support.ts         browser-safe capability detection
```

### State and rendering model

- The main route mounts `PortfolioPage` once. Section changes update shared React context and HTML content without changing the Canvas key or conditional mount position.
- Navigation state contains `activeSection` and an optional `selectedEntryId`. Content types carry no destination IDs at all; a separate mapping from stable content IDs to camera destinations is introduced only in Layer 3.
- `CameraController` is the sole camera owner. It remains fixed in Layer 1. Later, it will own and clean up GSAP timelines, interrupt in-flight transitions, and retarget from the current camera transform.
- The Canvas uses `frameloop="demand"`. Layer 1 will invalidate only after resources finish loading, viewport changes, context restoration, or graphics preference changes. No unconditional `useFrame` invalidation loop will be added.
- The initial introduction, navigation, active panel, status text, and Reduce effects control render as normal server-rendered HTML. The scene module loads lazily inside a client-only boundary with stable server/client fallback markup.
- The Canvas is decorative in Layer 1 and excluded from keyboard interaction and the accessibility tree; all meaningful controls and content remain HTML.

### Typed content model

- **Profile:** `[Your Name]`, `Solution Architect · Cloud · DevOps`, placeholder introduction, expertise, and organizational value.
- **Experience:** stable ID, company, role, start/end dates, summary, contributions, technologies, outcomes, and related project IDs. No destination or camera field.
- **Projects:** stable ID, title, problem, role/contribution, architecture decisions, technologies, results, and optional images/links. No destination or camera field.
- **Contact:** explicitly marked placeholders only; no fake URLs, email addresses, or downloads.
- One local data source feeds every HTML panel. There is no duplicate CV view, `/cv` page, fake download, API, database, authentication, or CMS.

## 4. Concrete Layer 1 implementation checklist

### A. Dependencies and foundation

- [ ] Install the seven packages above at exact versions with Bun and update the lockfile.
- [ ] Inspect the installed dependency tree and peer-resolution output; stop and report rather than force through any conflict.
- [ ] Replace generic metadata on `/` with portfolio-specific title, description, Open Graph title/description, `og:type`, and Twitter card metadata.
- [ ] Replace the starter visual tokens with semantic charcoal, deep-blue, restrained cyan/teal, readable foreground, border, focus, status, and overlay tokens using OKLCH values.

### B. Typed placeholder content

- [ ] Add strict TypeScript types for profile, company experience, project, contact, section IDs, and stable entry IDs — no destination IDs in content types.
- [ ] Add `[Your Name]` and the specified professional title.
- [ ] Mark every other unknown personal value visibly as a placeholder.
- [ ] Include multiple placeholder experience/project shapes only as clearly labeled structural placeholders—not invented companies, dates, achievements, metrics, testimonials, links, or contact details.
- [ ] Keep content independent of scene coordinates and use stable IDs.

### C. Persistent HTML experience

- [ ] Build the single `/` page with About selected by default.
- [ ] Render the identity, introduction, and four-item navigation immediately, independent of scene readiness.
- [ ] Add keyboard-operable, touch-friendly navigation with visible focus states, headings, and `aria-current` or equivalent active-section semantics.
- [ ] Render non-modal, naturally scrollable panels for About, Experience, Projects, and Contact.
- [ ] Keep navigation usable during loading and panel changes; avoid focus traps and hover-only information.
- [ ] Add a visible Reduce effects control. It disables postprocessing and lowers DPR, independent of reduced-motion preference.
- [ ] Ensure narrow layouts and 200% zoom have no horizontal overflow and keep long panel content usable.

### D. Client-only 3D foundation

- [ ] Lazy-load the browser-dependent scene behind a client-only boundary without blocking the surrounding page.
- [ ] Require WebGL 2 before mounting the R3F scene.
- [ ] Create exactly one persistent Canvas using Three.js WebGLRenderer, `frameloop="demand"`, and a default DPR cap of 1.5.
- [ ] Lower DPR when Reduce effects is enabled.
- [ ] Add a fixed camera, simple ground plane, a small set of original procedural architectural forms, restrained lighting, atmospheric fog, and an emissive focal surface.
- [ ] Add Bloom only, tuned so its effect is observable but restrained. Do not add vignette, depth of field, particles, sound, reflections, heavy shadows, imported models, camera travel, or physics.
- [ ] Keep visual parameters centralized and easy to tune.
- [ ] Respond to viewport and visual-setting changes by invalidating a frame; avoid a permanent render loop.
- [ ] Suspend unnecessary graphics work while the page is hidden.

### E. Preferences and failure handling

- [ ] Listen for live `prefers-reduced-motion` changes. Layer 1 contains no decorative or camera motion, but the preference is stored separately for later behavior.
- [ ] Show a concise loading state while preserving all content and navigation.
- [ ] Handle scene chunk/module download failure without taking down the page.
- [ ] Detect unavailable WebGL 2 before Canvas creation and show the static fallback.
- [ ] Catch scene initialization/render errors and report a concise fallback status.
- [ ] Handle `webglcontextlost` by calling `preventDefault()` — which permits restoration rather than preventing it — coordinating with Three.js's own context lifecycle instead of duplicating it. Keep the full HTML interface intact, show the fallback while graphics are unavailable, handle `webglcontextrestored` safely where supported, and never auto-remount or retry in a loop. Only a deliberate user recovery action may recreate the Canvas; ordinary section navigation always preserves it.
- [ ] Use a simple tokenized background whenever 3D is unavailable.

### F. Verification and acceptance report

- [ ] Run the production build and the project's actual configured type-check command, reporting that exact command and its real output.
- [ ] Inspect the installed versions and peer dependency tree.
- [ ] Verify in a browser that the real R3F/WebGL scene renders and the intended emissive object visibly blooms.
- [ ] Select all four sections and confirm the correct panel opens while the exact same Canvas element/context remains mounted.
- [ ] Measure real idle rendering: count renderer/composer render calls (or R3F frame callbacks) after the scene settles — not every application `requestAnimationFrame` — and confirm no unconditional scene invalidation loop exists.
- [ ] Toggle Reduce effects and verify Bloom disables and DPR lowers without breaking the scene.
- [ ] Simulate delayed scene loading and module/render failure; confirm HTML remains usable.
- [ ] Trigger context loss via `WEBGL_lose_context` where supported; confirm the HTML stays usable, the fallback appears, restoration is handled safely, and nothing retries in a loop.
- [ ] Test keyboard navigation, visible focus, active-section semantics, natural panel scrolling, and no trapped focus.
- [ ] Test at desktop 1440×900, mobile 375×812, and 200% browser zoom; capture desktop and mobile screenshots.
- [ ] Refresh `/` and inspect console/runtime output for hydration, application, WebGL, and asset errors.
- [ ] Confirm `/cv` was not created and no CV navigation, fake link, or placeholder download exists.
- [ ] Report every check performed, result, checks the environment could not perform, and any unresolved issue. Layer 1 is not presented as the completed public portfolio.

## 5. Remaining roadmap

- **Layer 2 — Visual environment:** refine the approved architectural composition, materials, fog, lighting, depth, and focal points; introduce original GLB/glTF assets only where they improve the story.
- **Layer 3 — Cinematic navigation:** define destination mappings separately from content; add GSAP camera travel through the sole camera controller; make transitions interruptible and retargetable; synchronize the latest panel/entry; jump instantly under reduced motion; add company-specific destinations only as needed.
- **Layer 4 — Actual content:** replace placeholders with supplied CV, company, project, results, links, images, and contact information; add a PDF download only when a real file is provided.
- **Layer 5 — Cinematic polish:** refine transitions and Bloom; evaluate particles and sound separately; require explicit sound activation and retain a persistent mute control.
- **Layer 6 — Optional physics:** install React Three Rapier only for a separately approved interaction involving collision, gravity, or rigid bodies, isolated from essential navigation.
- **Layer 7 — Release:** validate content accuracy, accessibility, mobile behavior, failure states, metadata, production performance, version-control readiness, deployment, and final pre-release review.

## 6. Genuine blockers

There are no blockers to Layer 1. The specification resolves the earlier open decisions: one `/` route, no `/cv`, `[Your Name]`, four top-level chapters, direct entry, no autoplay audio, WebGL 2, demand rendering, and a separate Reduce effects preference.

Real CV content, contact links, supporting project media, and a PDF remain intentionally blocked until you supply them in Layer 4. Exact performance claims remain deferred until measured on named devices and viewport sizes.

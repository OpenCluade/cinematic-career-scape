# Roadmap

## Layer 1 — Working foundation

### Implemented
- [x] Exact-version 3D dependencies (three 0.186.0, @react-three/fiber 9.7.0, drei 10.7.8,
      @react-three/postprocessing 3.1.1, postprocessing 6.39.5, gsap 3.15.0, @types/three 0.186.0)
- [x] Portfolio design tokens (dark charcoal / deep blue, restrained cyan accent)
- [x] Typed local placeholder content, no destination IDs, no invented personal data
- [x] Persistent Canvas, fixed camera, procedural scene, restrained Bloom, demand rendering
- [x] HTML header, navigation and four section panels; Reduce effects control
- [x] Distinct failure classes: unsupported WebGL 2, module-download failure,
      synchronous render error, asynchronous init timeout, context loss
- [x] Deliberate recovery that resets the failed boundary, re-issues the dynamic
      import and recreates the Canvas; no automatic retry loop
- [x] Content panel resets to the top of the newly selected section
- [x] `typecheck` and `test` scripts; README and metadata corrected

### Checks passed
- [x] Production build (`bun run build`)
- [x] TypeScript (`bun run typecheck`)
- [x] Lint (`bun run lint`) — 0 errors, 9 pre-existing react-refresh warnings
- [x] Regression tests (`bunx vitest run`) — 11 passing
- [x] Dependency tree resolves without overrides or legacy peer flags
- [x] Server-rendered HTML contains the identity, navigation and panel content
      with no canvas, and `/cv` returns 404; no downloads or invented links
- [x] Browser (headless Chromium, SwiftShader WebGL 2): real scene renders,
      Bloom visibly restrained, DPR cap 1.5 -> 1.0 under Reduce effects,
      same canvas element across all four sections and the Reduce toggle,
      idle frame count stops increasing, context loss shows the fallback and
      recovery restores the scene, no console or page errors
- [x] Layouts at 1440x900, 375x812 and 200% zoom — no horizontal overflow

### Unverified
- [ ] Hardware GPU rendering, real device performance and frame timing
      (only software WebGL is available in this environment)
- [ ] Real browser-level tab backgrounding (simulated via visibilitychange);
      one frame was observed after a viewport resize while hidden
- [ ] Real assistive-technology and touch-device testing
- [ ] Genuine network-level module-download failure (covered by tests, not in-browser)

## Later layers (awaiting approval — do not start)
- Layer 2: richer environment
- Layer 3: camera choreography (GSAP), content -> destination mapping
- Layer 4: real CV content
- Layers 5-7: as specified

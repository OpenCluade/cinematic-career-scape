# Digital Architects

Plan an immersive personal portfolio based on the specification below. Inspect the current project, propose a concrete implementation plan, and identify dependency or framework constraints. Do not implement until I approve the plan.

## 1. Project purpose

Create a cinematic portfolio presenting my CV, previous companies, professional experience and selected projects through real-time 3D environments.

My professional focus is:

* IT solution architecture
* Cloud infrastructure
* DevOps and automation
* Backend development

The portfolio should demonstrate both my professional experience and my interest in interactive technology.

Primary audiences are recruiters, hiring managers, potential clients and technical collaborators. Visitors should quickly understand what I do, what I have delivered and how to contact me.

## 2. Creative direction

Reference: https://activetheory.net/

Take inspiration from its atmosphere, spatial depth, lighting and transitions between environments. Create an original identity and original assets.

If you cannot inspect the reference’s interactive behavior, say so and work from the written direction. Do not claim to have reproduced details you could not observe.

Initial visual direction:

* Dark charcoal and deep blue tones.
* Restrained cyan or teal accents.
* Architectural forms, atmospheric fog and selective glowing surfaces.
* Clear typography and generous spacing.
* Slow, deliberate camera movement.
* Subtle interaction rather than constant movement.

Begin with an abstract architectural environment that can be created using procedural geometry. Detailed models can be introduced after the visual direction is approved.

## 3. Visitor experience

Use a guided journey with direct navigation.

Visitors can choose About, Experience, Projects or Contact from a persistent HTML menu. Navigation moves the camera to a corresponding point of interest and opens the relevant content panel.

The first version should use one coherent environment containing several career chapters. Structure the scene so that distinct environments can be introduced later if they improve the storytelling.

Core sections:

About:

* Name, professional title and short introduction.
* Areas of expertise.
* A concise explanation of the value I bring.

Experience:

* Previous companies and roles.
* Employment dates.
* Responsibilities and contributions.
* Technologies used.
* Outcomes and links to related projects.

Projects:

* Problem or business need.
* My role and contribution.
* Architecture and technical decisions.
* Relevant technologies.
* Results, with metrics only when I supply them.

Contact:

* Contact details and professional links supplied by me.
* Downloadable CV once I provide the file.

Keep “View CV” and “Contact” easy to access. Provide a clearly labeled standard CV view that presents the same content without requiring 3D navigation.

## 4. Required technology

Inspect the existing project and retain its application framework.

Use:

* React and TypeScript.
* Three.js through @react-three/fiber.
* @react-three/drei for appropriate scene helpers.
* @react-three/postprocessing with compatible dependencies.
* GSAP for camera transitions and coordinated animation.
* Tailwind CSS for HTML layout and styling.

Start with Three.js WebGLRenderer.

Verify compatible versions of React, React Three Fiber, Drei, Three.js and postprocessing before installation. Resolve compatibility properly; do not bypass peer dependency checks.

Reserve @react-three/rapier for a later phase if an approved interaction needs gravity, collisions or rigid bodies. Guided camera navigation does not require physics.

Use GLB/glTF for future imported models. Begin with procedural geometry so the first prototype does not depend on external assets.

## 5. Architecture

Use one persistent React Three Fiber Canvas.

Separate responsibilities into:

* Application layout and routes.
* Structured portfolio content.
* 3D environment.
* Camera controller.
* Postprocessing effects.
* HTML navigation and content panels.
* Loading, quality settings and fallback handling.

Use shared navigation state to keep the active chapter, camera destination and HTML panel synchronized. One camera controller must own camera movement.

Handle rapid navigation: a new selection should safely replace an unfinished transition and reach the latest selected chapter.

Keep per-frame scene updates outside React state. Clean up animation timelines and graphics resources when appropriate.

If the framework uses server rendering, isolate browser-dependent 3D initialization on the client. Render the meaningful HTML content independently of the Canvas.

## 6. Content rules

Keep content in a separate typed data module initially.

Suggested experience fields:

* ID
* Company
* Role
* Start and end dates
* Summary
* Contributions
* Technologies
* Outcomes
* Related project IDs

Use explicit placeholders until I provide my CV. Do not invent companies, dates, accomplishments, metrics, testimonials or contact information.

Render the immersive panels and standard CV view from the same data source.

Do not add a database, authentication or CMS in the initial version. Reconsider these only if an editing or backend requirement emerges.

## 7. Accessibility and performance

* Keep essential content, links and controls in semantic HTML.
* Support keyboard navigation and visible focus indicators.
* Manage focus correctly when opening and closing panels.
* Respect reduced-motion preferences by removing camera travel and decorative motion.
* Keep text readable over the environment.
* Provide loading, unsupported-WebGL and runtime-error fallbacks.
* Make useful content available while 3D loads.
* Avoid hover-only controls on mobile.
* Begin with a rendering pixel-density cap of 1.5.
* Reduce effects on smaller or slower devices as needed.
* Pause unnecessary rendering when the page is hidden.
* Lazy-load heavier assets when introduced.

Treat smooth desktop interaction as a goal to measure. Report tested devices and viewport sizes rather than claiming universal performance.

## 8. Implementation layers

Layer 1 — Foundation:
Confirm dependencies and build one working Canvas, a simple environment, subtle Bloom, HTML navigation, placeholder panels and fallback states. Keep the camera fixed.

Layer 2 — Visual environment:
Develop the approved architectural style, lighting, fog, materials and focal points. Keep visual parameters easy to adjust.

Layer 3 — Career navigation:
Add named chapter destinations and GSAP camera transitions. Synchronize panels with navigation and handle interrupted transitions. Include reduced-motion behavior.

Layer 4 — Real CV content:
Replace placeholders with supplied information. Implement company and project details, standard CV view, professional links and CV download.

Layer 5 — Cinematic polish:
Refine transitions and postprocessing. Evaluate optional particles or sound individually. Sound must require an explicit visitor action and have a persistent mute control.

Layer 6 — Optional physics:
Add React Three Rapier only if we approve a specific interaction that benefits from it. Keep that interaction separate from CV navigation.

Layer 7 — Release:
Verify mobile layouts, accessibility, content accuracy, metadata, loading, fallbacks and production behavior. Connect version control and prepare deployment.

## 9. Layer 1 acceptance criteria

Layer 1 is complete when:

* The production build and available type checks pass.
* The preview displays a genuine R3F scene using WebGL.
* React Postprocessing visibly applies restrained Bloom.
* Navigation opens the correct HTML placeholder panel.
* Switching panels preserves the existing Canvas.
* HTML remains usable during loading and rendering failure.
* Desktop and narrow mobile layouts are usable.
* No unresolved application runtime or hydration errors remain.

Report checks actually performed, checks not performed and any remaining problems.

## 10. Your planning response

Return:

1. What exists in the current project.
2. Proposed package versions and compatibility findings.
3. Proposed component and content structure.
4. A detailed implementation checklist for Layer 1.
5. A concise roadmap for the remaining layers.
6. Any concrete blockers or decisions that require my input.

Keep the initial implementation limited to Layer 1. Wait for approval before building.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/31c32842-c021-4117-abcc-94b69000e010).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

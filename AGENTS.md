# AGENTS.md — OptiLab 360 Project Rules

These instructions apply to all coding agents working in this repository.

## 1. Project source of truth

Before planning or changing the application:

1. Read `docs/PROJECT_SPEC.md`.
2. Read `docs/DEVELOPMENT_PLAN.md`.
3. Inspect the existing repository and understand its current state.
4. Follow the requirements and priorities in those files.

`docs/PROJECT_SPEC.md` is the source of truth for the product requirements.  
`docs/DEVELOPMENT_PLAN.md` is the source of truth for implementation stages and progress.

If a user instruction conflicts with a project document, point out the conflict and ask which requirement to follow before making a consequential change.

Do not repeatedly print or summarize the full project specification unless explicitly requested.

## 2. Project goal and constraints

We are building **OptiLab 360**, a 100% software-based interactive digital twin of the Newton’s Rings experiment for determining the wavelength of sodium light.

The project is a browser-based educational application. It must not require physical laboratory hardware.

### Do not introduce

- Arduino or Raspberry Pi.
- Physical sensors or external measurement hardware.
- A physical microscope or other lab equipment.
- Unity or an unrelated game engine.
- Unapproved replacement frameworks or major architecture changes.
- Unnecessary packages or services.
- Features that are represented as working when they are only mockups.

## 3. Fixed technology stack

Use the following stack unless the project owner explicitly approves a change:

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- Three.js.
- React Three Fiber.
- `@react-three/drei`.
- Recharts.
- Supabase, when persistence or collaboration is implemented.
- PostgreSQL through Supabase.
- Supabase Auth, if user accounts are required.
- Supabase Realtime, if real-time collaboration is implemented.
- GitHub.
- Vercel.

Before installing a package, check whether the project already has it or whether the existing stack can handle the task.

Do not add dependencies just because they are commonly used in similar projects.

## 4. Work incrementally

Build the application one stage at a time, following `docs/DEVELOPMENT_PLAN.md`.

When the user asks for a specific stage:

1. Read the relevant requirements.
2. Inspect the current implementation.
3. Identify the smallest set of changes needed.
4. Implement only that stage.
5. Run the appropriate checks.
6. Fix errors caused by the changes.
7. Update the development plan.
8. Report what changed, what was tested, and any remaining limitations.
9. Stop and wait for the next instruction.

Do not silently proceed into later stages.

Do not build the entire application in one large response or one uncontrolled implementation pass.

If a stage is too large, divide it into smaller sub-stages and ask the user to approve the proposed breakdown.

## 5. Preserve existing work

Before editing a file:

- Inspect its current contents.
- Understand how it is used.
- Identify relevant dependencies and callers.
- Preserve existing working functionality unless the requested change requires altering it.

Do not overwrite a working implementation with a new version just because it is easier to regenerate.

Do not delete files, reset project state, remove dependencies, or rewrite major modules without a clear reason and user approval.

When changing a shared interface or data type, inspect and update all relevant callers.

Prefer focused, reviewable changes over broad rewrites.

## 6. Token and context efficiency

Keep implementation work concise and focused.

- Treat the project documents as the persistent specification.
- Do not repeat the entire project specification in each response.
- Do not reproduce unchanged code or entire files unless necessary.
- Show only relevant new or modified files and explain their purpose.
- Avoid long speculative discussions when the next implementation step is clear.
- Do not silently omit requirements to save tokens.
- If a response or implementation is becoming too large, stop at a clean, working boundary and explain what remains.
- Do not attempt to compress code so aggressively that it becomes hard to understand or maintain.

When possible, summarize the current state in the development plan so future work can resume without repeating prior analysis.

## 7. Physics correctness is mandatory

The core relationship is:

\[
D_n^2 = 4n\lambda R
\]

Where:

- \(D_n\) is the diameter of ring \(n\).
- \(n\) is the ring order.
- \(\lambda\) is the light wavelength.
- \(R\) is the lens radius of curvature.

The stated sodium reference for this project is **589.3 nm (5893 Å)**.

### Physics implementation rules

- Keep physics calculations in dedicated TypeScript modules, not embedded in UI components.
- Use consistent units and document every conversion.
- Do not mix metres, millimetres, and nanometres without explicit conversion.
- Do not hardcode unrelated ring positions or final results.
- Generate the ring pattern from the current model parameters.
- Make changes in wavelength and radius of curvature affect the visualization consistently.
- Derive measurement results from the actual simulated instrument state and recorded readings.
- Clearly distinguish ideal simulated values from measured or user-entered values.
- Do not silently change the true wavelength or radius to make a student’s result look correct.
- Add tests for important calculations and unit conversions.

If the project needs a simplifying assumption, document it and make sure it does not contradict the core learning objective.

## 8. Instrument and measurement consistency

The microscope position, scale reading, and recorded measurement must all refer to the same simulated instrument state.

- Use the specified 0.01 mm movement increment where precision movement is represented.
- Make the scale reading update from the instrument position.
- Document the Main Scale and Vernier Scale design and least count.
- Do not display fake precision that the simulated scale cannot support.
- Do not let a decorative crosshair produce a measurement unrelated to its position.
- Record the displayed reading when the user performs the record action.
- Calculate a diameter only when both corresponding left and right readings are present.
- Make incomplete data obvious.
- Recalculate dependent results when a reading is edited.

The guided sequence should support the 16th, 12th, 8th, and 4th rings on both sides.

## 9. Separate physics, UI, and persistence

Keep responsibilities clear.

### Physics

Owns equations, unit conversion, ideal ring positions, measurement calculations, graph fitting, and simulated error models.

### UI

Owns layout, controls, labels, visual feedback, navigation, and presentation of data.

### Experiment state

Owns the current experiment settings, instrument state, measurement records, selected mode, and experiment progress.

### Persistence

Owns saving and loading data from Supabase when that stage is approved.

Do not place database queries directly inside presentational components.

Do not make the physics module depend on React or Supabase.

Prefer small modules with clear names and single responsibilities.

## 10. 3D and rendering rules

- Use Three.js through React Three Fiber for the 3D scene.
- Use `@react-three/drei` only where it provides a clear benefit.
- Keep 3D components separate from the experiment calculations.
- Avoid unnecessarily complex geometry, shaders, and visual effects.
- Do not attempt expensive full photon ray tracing when a procedural physics-based rendering is sufficient.
- Ensure the ring visualization responds to the current physics parameters.
- Keep the viewfinder synchronized with the simulated microscope.
- Avoid updating the entire application for every animation-frame change.
- Handle unsupported WebGL or rendering errors gracefully where practical.

Visual polish matters, but the application must remain responsive and usable on typical student laptops.

## 11. UI and educational design rules

The application is an educational lab, not only a 3D showcase.

- Make the experimental workflow easy to understand.
- Use clear labels and units.
- Keep important controls visible and discoverable.
- Show which ring and side the user is measuring.
- Make recorded, missing, and invalid readings easy to distinguish.
- Explain the purpose of the apparatus when appropriate.
- Do not rely on color alone to communicate status.
- Ensure the viewfinder and scale are legible on a laptop and when projected.
- Avoid unnecessary animations that interfere with measurement.
- Provide clear reset, retry, and correction behavior.

Do not add decorative controls that appear interactive but do nothing.

Every visible interactive control must perform the action its label promises.

## 12. Error engine rules

The physics-aware error engine is intended to teach students how experimental mistakes affect measurements.

Possible simulated errors include alignment, focus, parallax, backlash, reading, and illumination errors.

- Make errors optional and understandable.
- Give each error a defined effect.
- Explain the effect to the student.
- Make it possible to diagnose and correct the problem.
- Keep the true model parameters separate from errors in observation or measurement.
- Do not generate unexplained random outcomes.
- Make error behavior reproducible during testing wherever practical.
- Do not implement an error feature as a label or toggle unless it has a real, testable effect.

## 13. Backend and security rules

Do not introduce Supabase until the core local experiment works, unless the user explicitly asks to prioritize backend work.

If Supabase is added:

- Keep credentials in environment variables.
- Never commit `.env` files containing secrets.
- Never expose a Supabase service-role key in client-side code.
- Use appropriate database constraints and access policies.
- Configure row-level security for user-owned data.
- Handle missing credentials and backend failures gracefully.
- Do not claim that data is saved unless the save operation has actually succeeded.
- Do not present local-only mock collaboration as working real-time collaboration.

Do not create authentication or a database merely for appearance if the feature is not needed for the current stage.

## 14. Testing and verification

Generated code is not automatically correct.

After implementation, run the relevant project checks, such as:

- TypeScript type checking, if configured.
- Linting, if configured.
- Unit tests, if available.
- Production build.
- Manual browser testing for user-facing behavior.

For changes involving physics, test the formulas with known inputs and expected relationships.

For changes involving UI state, test the interaction and verify that dependent displays update correctly.

For changes involving the 3D scene, run the application and verify that the scene renders and controls respond.

Do not claim a test passed unless it was actually run and its result observed.

If a command cannot be run, state that clearly and provide the reason. Do not invent test results.

## 15. Git and checkpoints

Use Git to preserve working milestones.

- Check the current Git status before making changes.
- Do not overwrite or discard uncommitted user changes.
- Do not commit secrets, build artifacts, or unnecessary generated files.
- Recommend a commit after each stable stage.
- Use clear commit messages that describe the completed work.
- Do not push to a remote repository unless the user has asked for it or explicitly approved the action.

Example commit messages:

- `chore: initialize OptiLab 360`
- `feat: add laboratory interface`
- `feat: implement Newton's Rings physics`
- `feat: add microscope and viewfinder`
- `feat: add measurement calculations`
- `test: cover wavelength calculations`

## 16. Documentation

Keep documentation accurate and concise.

Update `docs/DEVELOPMENT_PLAN.md` after each completed stage.

Update `README.md` when setup, run commands, configuration, or deployment instructions change.

Document important technical decisions, especially:

- Unit conventions.
- Scale divisions and least count.
- Simplifying assumptions in the physics model.
- Graph fitting method.
- Simulated error behavior.
- Backend configuration.
- Known limitations.

Do not claim planned features are implemented.

## 17. When to ask the user

Ask before proceeding if:

- A requirement is ambiguous in a way that affects architecture or physics.
- A requested change conflicts with the project specification.
- A major dependency or framework change appears necessary.
- A destructive operation may affect existing work.
- A feature requires credentials, account access, or an external service.
- A significant amount of work would be spent on an optional feature instead of the MVP.
- There are multiple reasonable approaches with important tradeoffs.

For small implementation details that do not change project scope or correctness, use a sensible default and document it.

## 18. Response format after each stage

After finishing a stage, provide a concise report with these headings:

### Completed
List the functionality actually implemented.

### Files changed
List the files created, modified, or deleted.

### Verification
List the commands run and the actual test or build results.

### Limitations
List any known issues, unimplemented requirements, or assumptions.

### Plan status
State which checklist items were updated and what stage should come next.

Then stop and wait for the user’s next instruction.

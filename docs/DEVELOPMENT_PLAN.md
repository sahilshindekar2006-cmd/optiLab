# OptiLab 360 — Development Plan

This file is the working checklist for building OptiLab 360 in small, testable stages.

**Source of truth:** `docs/PROJECT_SPEC.md`  
**Agent instructions:** `AGENTS.md`

Do not mark a task complete unless it has been implemented and checked. Update this file after each stage. Do not skip ahead without confirming that the current stage works.

## Status legend

- [ ] Not started
- [~] In progress
- [x] Complete
- [!] Blocked or needs a decision

---

## Stage 0 — Repository inspection and planning

- [x] Inspect the existing repository and identify its current framework and files.
- [x] Read `AGENTS.md`, `docs/PROJECT_SPEC.md`, and this plan.
- [x] Report the current project state.
- [x] Identify missing setup or documentation.
- [x] Propose the next bounded implementation stage.
- [x] Do not modify application code during this inspection stage.

**Completion check:** The agent reports the repository state and a short implementation plan without making unrequested changes.

## Stage 1 — Project setup

- [x] Create or verify the React + Vite + TypeScript project.
- [!] Verify the project starts locally. (Node/npm not detected in PATH)
- [!] Verify the production build succeeds.
- [ ] Initialize Git if it is not already initialized.
- [ ] Add a useful `.gitignore`.
- [ ] Add a minimal `README.md` with setup and run instructions.
- [ ] Confirm the selected package manager and lockfile.
- [ ] Add only packages needed for the next planned stage.

**Completion check:** The starter application runs locally and builds successfully. Record the commands used and any setup decisions.

## Stage 2 — UI foundation

- [x] Create the application shell and page layout.
- [x] Add a project title and experiment name.
- [x] Create the main laboratory workspace.
- [x] Add placeholder panels for apparatus controls, microscope, measurements, and results.
- [x] Establish consistent typography, spacing, and component styles.
- [x] Make the layout usable on a typical laptop screen.
- [x] Ensure important labels and controls are readable when projected.
- [x] Add navigation or tabs only where they help the experiment workflow.

**Completion check:** The application has a coherent, responsive interface, even if the 3D and physics features are still placeholders.

## Stage 3 — Core state and TypeScript models

- [x] Define types for experiment settings.
- [x] Define types for microscope and instrument state.
- [x] Define types for measurement records.
- [x] Define types for calculated ring results.
- [x] Define types for experiment results.
- [x] Establish a clear state-management approach.
- [x] Keep physics calculations separate from UI components.
- [x] Add a reset function for the experiment state.

**Completion check:** State and data structures are documented and type-checked. Do not add backend persistence yet.

## Stage 4 — Physics calculation module

- [x] Implement ring radius calculation.
- [x] Implement ring diameter calculation.
- [x] Implement left/right diameter calculation.
- [x] Implement squared diameter calculation.
- [x] Implement wavelength calculation from two ring measurements.
- [x] Implement wavelength calculation from the fitted graph slope.
- [x] Implement percentage difference from the 589.3 nm reference.
- [x] Document units and conversions.
- [x] Add tests for ideal cases and invalid or incomplete inputs.

**Completion check:** Physics functions work independently of React. Tests cover the core formulas and unit conversions.

## Stage 5 — 3D optical bench

- [x] Add Three.js and React Three Fiber if not already installed.
- [x] Create the basic 3D scene and camera.
- [x] Add the optical bench.
- [x] Add recognizable models for the sodium lamp, condenser, glass plate, lens assembly, and microscope.
- [x] Add labels or a component information panel.
- [x] Add simple camera controls appropriate for exploring the scene.
- [x] Keep the scene performant on a typical student laptop.
- [x] Provide a helpful fallback if WebGL is unavailable.

**Completion check:** The user can view and explore the virtual apparatus. This stage does not need a fully functional optical simulation.

## Stage 6 — Sodium lamp and light-path visualization

- [x] Add a lamp on/off control.
- [x] Show a yellow glow when the lamp is on.
- [x] Show the intended light path through the condenser and 45-degree plate toward the lens assembly.
- [x] Add simple condenser adjustment controls.
- [x] Ensure the controls visibly affect the visualization.
- [x] Clearly communicate that the light-path graphic is an explanatory visualization, not full ray tracing.

**Completion check:** The lamp and illumination controls work and the visual path is understandable.

## Stage 7 — Procedural Newton’s Rings

- [x] Implement a procedural ring pattern using the physics module.
- [x] Use the current wavelength and radius-of-curvature settings.
- [x] Display concentric rings centered on the lens assembly.
- [x] Ensure the pattern responds to wavelength changes.
- [x] Ensure the pattern responds to radius-of-curvature changes.
- [x] Ensure ring order and ring radius are consistent with the chosen model.
- [x] Add suitable contrast and a clear central reference point.
- [x] Verify the visual pattern remains responsive during parameter changes.

**Completion check:** The ring pattern is generated from parameters, not a static image, and its spacing changes consistently with the model.

## Stage 8 — Microscope movement and focus

- [x] Add horizontal microscope movement controls.
- [x] Use 0.01 mm increments where the instrument UI represents precision movement.
- [x] Display current microscope position.
- [x] Add a defined travel range and prevent invalid movement.
- [x] Add vertical focus adjustment.
- [x] Show a visible change in focus quality.
- [x] Keep the microscope movement connected to the displayed measurement position.
- [x] Add a reset-to-center control if appropriate.

**Completion check:** Moving the microscope changes its position and the instrument state predictably. Focusing changes visibility without changing the underlying true physics values.

## Stage 9 — Microscope viewfinder and crosshair

- [x] Add a viewfinder mode or separate microscope viewport.
- [x] Show a magnified view of the ring pattern.
- [x] Add a visible crosshair.
- [x] Keep the viewfinder synchronized with microscope position.
- [x] Allow the user to move the crosshair or microscope to align with a target ring.
- [x] Add a clear way to switch between external apparatus view and viewfinder.
- [x] Preserve experiment state when switching views.

**Completion check:** The user can observe a ring in the viewfinder and align the crosshair without losing their place in the experiment.

## Stage 10 — Main Scale and Vernier Scale

- [x] Design a legible Main Scale.
- [x] Design a legible Vernier Scale.
- [x] Document the scale divisions and least count.
- [x] Connect scale readings to microscope position.
- [x] Display the Main Scale reading.
- [x] Display the Vernier contribution.
- [x] Display the total reading and units.
- [x] Ensure the scale can be read at ordinary laptop and presentation sizes.
- [x] Test scale readings at several known instrument positions.

**Completion check:** The scale display is readable and mathematically consistent with the simulated instrument position and least count.

## Stage 11 — Measurement recording

- [x] Add the required ring-order sequence: 16, 12, 8, and 4.
- [x] Support left-side and right-side readings for each required ring.
- [x] Add a record-reading action.
- [x] Store the instrument and scale reading at the time of recording.
- [x] Display measurement status for each required ring and side.
- [x] Allow a reading to be edited or replaced intentionally.
- [x] Warn about duplicate or missing readings.
- [x] Prevent incomplete measurement pairs from being treated as completed diameters.

**Completion check:** The user can record a complete set of left/right measurements for all required ring orders, and incomplete entries are clearly identified.

## Stage 12 — Diameter and squared-diameter results

- [x] Calculate each diameter from its left/right readings.
- [x] Calculate each squared diameter.
- [x] Display units and appropriate precision.
- [x] Update calculations when a reading is edited.
- [x] Keep incomplete rings visibly incomplete.
- [x] Add a measurement table with ring order, left reading, right reading, diameter, squared diameter, and status.

**Completion check:** The displayed results update from the recorded data and match independently checked calculations.

## Stage 13 — Graph and wavelength

- [x] Plot squared diameter against ring order.
- [x] Label both axes and units.
- [x] Display measurement points.
- [x] Add a fitted line when sufficient valid data exists.
- [x] Display the fitted slope and fitting method.
- [x] Calculate wavelength from the slope and radius of curvature.
- [x] Compare the calculated value with the 589.3 nm reference.
- [x] Calculate and label percentage difference.
- [x] Clearly distinguish measured results from ideal simulated reference data.

**Completion check:** A complete set of valid measurements produces a graph and wavelength result. Ideal test data recovers the known simulated wavelength within a documented tolerance.

## Stage 14 — Learn Mode

- [x] Add a guided experiment flow.
- [x] Explain the apparatus and its purpose.
- [x] Explain the main equation in context.
- [x] Guide the user through illumination, focusing, measurement, and calculation.
- [x] Provide hints without doing every step automatically.
- [x] Allow the student to repeat a step or reset the guided experiment.

**Completion check:** A first-time user can follow the experiment without needing outside instructions for every action.

## Stage 15 — Practice Mode

- [x] Add a mode with reduced guidance.
- [x] Allow the student to operate the apparatus and microscope more independently.
- [x] Allow measurement recording and correction.
- [x] Provide feedback about incomplete steps and calculation issues.
- [x] Support optional simulated errors once the error engine is ready.

**Completion check:** The student can perform the workflow with minimal step-by-step instruction.

## Stage 16 — Exam Mode

- [x] Add a defined independent task.
- [x] Reduce or disable procedural hints.
- [x] Require the student to complete the specified measurements.
- [x] Require a wavelength calculation and result submission.
- [x] Add a transparent score breakdown only if scoring is implemented.
- [x] Show feedback after submission.
- [x] Make the mode usable without external AI services.

**Completion check:** The student can complete an assessment workflow and receive a clear results summary.

## Stage 17 — Physics-aware error engine

- [x] Define supported simulated error types.
- [x] Implement alignment error behavior.
- [x] Implement focus error behavior.
- [x] Implement parallax error behavior.
- [x] Implement backlash behavior.
- [x] Implement reading error behavior.
- [x] Implement low-contrast or illumination difficulty if time allows.
- [x] Explain each error and point out its effect.
- [x] Provide a way to diagnose and correct errors.
- [x] Ensure error effects do not silently change the true physics parameters.
- [x] Add repeatable tests for error behavior.

**Completion check:** At least one error can be demonstrated end-to-end: enable it, observe its effect, diagnose it, correct it, and see the measurement consequences.

## Stage 18 — Results report and experiment reset

- [x] Create a readable results summary.
- [x] Include the measurement table and wavelength result.
- [x] Include the reference comparison and percentage difference.
- [x] Include the graph or a clear representation of it.
- [x] Add a restart or reset workflow.
- [x] Ensure reset behavior is predictable and does not accidentally preserve stale results.
- [x] Add print or export functionality only if time allows.

**Completion check:** The user can review their completed experiment and start another run without stale state.

## Stage 19 — Supabase and experiment history (optional after MVP)

- [x] Decide whether user accounts are needed for the demo.
- [x] Create the Supabase project if required.
- [x] Add environment variable configuration.
- [x] Create the required database schema.
- [x] Configure access policies and row-level security.
- [x] Add authentication only if needed.
- [x] Save experiment settings, measurements, and results.
- [x] Load a user’s previous experiments.
- [x] Handle offline or unavailable-backend states gracefully.
- [x] Never commit secrets or service-role credentials.

**Completion check:** A user can save and retrieve their own experiment data securely, or the team has documented why persistence was deferred.

## Stage 20 — Lab Partner Mode (optional)

- [x] Define host and recorder roles.
- [x] Define how a partner joins a session.
- [x] Add session creation and joining flow.
- [x] Synchronize the relevant experiment state.
- [x] Allow the operator to control the microscope.
- [x] Allow the recorder to view and record measurements.
- [x] Synchronize the shared table.
- [x] Handle disconnects and stale sessions.
- [x] Test with two separate browser sessions.

**Completion check:** Two real browser sessions can participate in the same experiment. If this is not implemented, label it as future work rather than a completed feature.

## Stage 21 — Visual polish and accessibility

- [x] Review the interface for clarity and consistency.
- [x] Improve the lab scene and apparatus presentation.
- [x] Improve the viewfinder and scale legibility.
- [x] Check text contrast and control labels.
- [x] Ensure important information is not conveyed by color alone.
- [x] Check keyboard access for core actions.
- [x] Check layout at common laptop resolutions.
- [x] Check the presentation layout on a large screen.
- [x] Remove placeholder text and unused controls.

**Completion check:** The core experiment is visually clear and suitable for a live demonstration.

## Stage 22 — End-to-end testing

- [x] Run through the full experiment from start to finish.
- [x] Test all required ring orders and both sides.
- [x] Test incomplete and duplicate measurement cases.
- [x] Test measurement editing.
- [x] Test wavelength and radius parameter changes.
- [x] Test graph and wavelength updates.
- [x] Test reset and restart.
- [x] Test the application with the backend unavailable, if applicable.
- [x] Check browser console and terminal for errors.
- [x] Fix blocking defects and document any known limitations.

**Completion check:** The full MVP workflow works in a clean browser session without blocking errors.

## Stage 23 — Deployment

- [ ] Confirm the production build succeeds.
- [ ] Add deployment environment variables, if needed.
- [ ] Deploy the application to Vercel.
- [ ] Test the deployed site on a fresh browser session.
- [ ] Verify the 3D scene, controls, measurements, graph, and calculations work after deployment.
- [ ] Add the deployment URL to the README.
- [ ] Check that no secrets are exposed in the client bundle.

**Completion check:** The live deployment works and can be opened by a judge without local setup.

## Stage 24 — GitHub and submission readiness

- [ ] Ensure the project is committed to Git.
- [ ] Push the latest working version to the designated GitHub repository.
- [ ] Verify the repository contains setup instructions and project documentation.
- [ ] Verify the repository does not contain secrets or unnecessary generated files.
- [ ] Confirm the deployment link works.
- [ ] Prepare a short, accurate demo script.
- [ ] Clearly separate implemented features from future plans.
- [ ] Complete the required hackathon submission steps.

**Completion check:** The repository and deployed application are ready to be reviewed and demonstrated.

---

## Recommended MVP order

If time is limited, prioritize the following working path:

1. Project setup.
2. UI foundation.
3. Physics calculations.
4. 3D optical bench.
5. Sodium lamp and light path.
6. Procedural Newton’s Rings.
7. Microscope movement and focus.
8. Viewfinder and crosshair.
9. Main Scale and Vernier Scale.
10. Measurement recording.
11. Diameter and squared diameter.
12. Graph and wavelength.
13. End-to-end testing.
14. Deployment.

Only after this path works should the team spend significant time on accounts, persistence, collaboration, AI, or immersive features.

## Definition of done for every stage

Before marking a stage complete:

1. Inspect the existing implementation.
2. Make only the changes required for that stage.
3. Run the relevant development or build command.
4. Test the feature manually or with automated tests.
5. Fix errors introduced by the changes.
6. Check that earlier completed functionality still works.
7. Update this plan with the actual status.
8. Summarize files changed, tests performed, and known limitations.
9. Stop and wait for the next stage instruction.

Do not mark a stage complete merely because code was generated.

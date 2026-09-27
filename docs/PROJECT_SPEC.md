# OptiLab 360 — Project Specification

## 1. Project overview

**Project name:** OptiLab 360  
**Tagline:** Interactive Digital Twin for the Newton’s Rings Experiment  
**Project type:** 100% software-based virtual physics laboratory  
**Target users:** Engineering and science students, instructors, and hackathon judges  
**Primary platform:** Desktop web application, with responsive support for smaller screens

### One-line pitch

OptiLab 360 transforms the Newton’s Rings experiment into an interactive digital twin. Students can operate a virtual optical setup, focus and move a simulated travelling microscope, measure interference rings with a virtual scale, calculate the wavelength of sodium light, and learn from simulated experimental errors.

### Core objective

Build an educational simulation that reproduces the workflow of determining the wavelength of sodium light using Newton’s Rings. The user should be able to operate the virtual apparatus, take measurements, calculate results, and understand the underlying physics.

The application must be a **software-only simulation**. It must not depend on physical lab equipment, sensors, Arduino, Raspberry Pi, or other hardware.

## 2. Problem background

Newton’s Rings is an interference experiment used to determine the wavelength of monochromatic light or the radius of curvature of a lens. A thin air film between a plano-convex lens and a flat glass plate produces concentric interference fringes when illuminated.

Traditional laboratory work can be challenging because of optical alignment, focusing, parallax, backlash, and scale-reading errors. A virtual laboratory can let students practise the experimental procedure, explore the effect of changing parameters, and repeat measurements in a controlled environment.

OptiLab 360 should emphasize learning through a complete procedure:

**Operate → Observe → Measure → Calculate → Interpret → Improve**

The experience should teach the student how the experiment works, not just display a final numerical answer.

## 3. Problem statement

Build a procedural 3D simulation of the Newton’s Rings experiment for determining the wavelength of sodium light.

The virtual laboratory should reproduce the experimental workflow and include:

- A virtual optical bench with the essential optical components.
- A monochromatic sodium light source and adjustable illumination controls.
- A simulated 45-degree glass plate that directs light toward the lens assembly.
- A plano-convex lens on a flat glass plate, with a generated Newton’s Rings pattern.
- A travelling microscope with horizontal and vertical adjustment.
- A microscope viewfinder with crosshairs.
- A readable Main Scale and Vernier Scale.
- Left- and right-side ring measurements.
- A measurement table and automatic calculations.
- A graph of squared ring diameter against ring number.
- A wavelength estimate and comparison with the stated sodium reference value.
- Optional simulated errors, guided learning, practice, assessment, and collaboration features.

## 4. Physics model

### 4.1 Main equation

For the standard Newton’s Rings relationship used in this project:

\[
D_n^2 = 4n\lambda R
\]

Where:

- \(D_n\) = diameter of the nth ring.
- \(n\) = ring number.
- \(\lambda\) = wavelength of the light.
- \(R\) = radius of curvature of the plano-convex lens.

The radius of the nth ring is:

\[
r_n = \sqrt{n\lambda R}
\]

The diameter is:

\[
D_n = 2\sqrt{n\lambda R}
\]

For two rings separated by \(p\) ring intervals:

\[
\lambda = \frac{D_{n+p}^2-D_n^2}{4pR}
\]

### 4.2 Graph method

Rearranging the main equation:

\[
D_n^2 = 4\lambda Rn
\]

Plot \(D_n^2\) on the vertical axis and \(n\) on the horizontal axis. The ideal relationship is linear.

If the fitted slope is \(m\):

\[
m = 4\lambda R
\]

Therefore:

\[
\lambda = \frac{m}{4R}
\]

Use a documented and tested linear-fit method. State clearly whether the graph uses the entered measurements or ideal simulated measurements.

### 4.3 Reference wavelength

Use **589.3 nm (5893 Å)** as the reference value for the hackathon’s sodium-light comparison, as specified in the project brief.

Display it as a reference value, not as a measurement produced by the experiment. The simulation’s calculated wavelength must come from the measurement data and calculation method selected by the user.

### 4.4 Physics consistency

- Keep the physics calculations in a dedicated module, separate from React components.
- Use consistent units internally. Prefer metres for wavelength and lens curvature calculations, and convert to millimetres only for UI display where appropriate.
- Avoid unit-mixing errors by naming variables with units or documenting their units.
- Generate the rings from the mathematical model or an equivalent procedural rendering technique.
- Do not use a static ring image as the sole implementation of the dynamic interference pattern.
- Changing wavelength or radius of curvature must visibly change ring spacing.
- Keep the simulated scale, microscope movement, and displayed readings consistent with the same underlying measurement model.
- Clearly label ideal values, simulated readings, and user-entered readings.

## 5. Intended users and learning outcomes

By completing the experiment, a student should be able to:

1. Identify the main parts of the Newton’s Rings apparatus.
2. Explain the purpose of the sodium lamp, condenser, glass plate, lens assembly, and travelling microscope.
3. Describe how a thin air film produces interference rings.
4. Operate the virtual microscope and focus the view.
5. Locate and measure rings on both sides of the central point.
6. Read a simulated Main Scale and Vernier Scale.
7. Calculate ring diameters and squared diameters.
8. Plot \(D^2\) against ring number and interpret the slope.
9. Calculate the wavelength using the graph method or an appropriate measurement formula.
10. Recognize how alignment, focus, parallax, backlash, and reading errors can affect measurements.

## 6. Core user journey

The main experiment should follow this sequence:

1. The user enters a virtual optics laboratory.
2. The user inspects the optical bench and its components.
3. The user switches on the sodium lamp.
4. The user adjusts illumination and the condenser controls.
5. The user observes light directed through the simulated 45-degree glass plate toward the lens assembly.
6. The user adjusts the microscope’s vertical focus until the rings are visible.
7. The user switches to the microscope viewfinder.
8. The user moves the microscope to locate the required ring on one side.
9. The user aligns the crosshair with the selected ring and records the scale reading.
10. The user repeats the measurement for the required rings on both sides.
11. The application calculates the diameter and squared diameter from the recorded readings.
12. The application displays the measurement table.
13. The application plots \(D^2\) against ring number.
14. The application calculates the wavelength from the selected method.
15. The user compares the result with the 589.3 nm reference value.
16. The application reports the percentage difference and provides feedback about the procedure and data.

The interface may guide the user through the steps in Learn Mode. Practice and Exam Modes should allow more independent operation.

## 7. Virtual apparatus

The 3D optical bench should include the following visible components:

1. Sodium lamp.
2. Condensing lens.
3. 45-degree glass plate.
4. Plano-convex lens.
5. Flat glass plate.
6. Travelling microscope.
7. Microscope adjustment controls.
8. Supporting optical bench or table.

### Apparatus behavior

- The sodium lamp can be switched on and off.
- The lamp should visually communicate that it is a monochromatic yellow source.
- The condenser should have simple adjustable controls, such as aperture or position, appropriate to the simulation.
- The 45-degree glass plate should visually represent the intended reflection path.
- The plano-convex lens and flat plate should be identifiable and positioned as an experimental assembly.
- The microscope should support horizontal translation and vertical focus adjustment.
- Use labels, tooltips, or a component information panel to help students identify apparatus parts.

### Visual accuracy

The 3D scene should be recognizable and educational, but it does not need to be a photorealistic engineering-grade optical model. Prioritize understandable geometry, correct component relationships, usable controls, and a clear visual hierarchy.

Do not imply that a decorative light beam is a physically complete ray-tracing solution. The light-path visualization is an explanatory representation, while the ring pattern is driven by the physics model.

## 8. Newton’s Rings visualization

The application must render a concentric interference pattern based on the selected simulation parameters.

### Required controls

- Wavelength.
- Radius of curvature.
- Ring visibility or illumination state, where appropriate.
- Optional visual contrast or brightness controls, clearly separated from the physics parameters.

### Required behavior

- Ring radii must be generated from the physics model.
- Changing wavelength must affect the ring radii.
- Changing radius of curvature must affect the ring radii.
- Changing the selected ring number must update the target ring or measurement instruction.
- The central region and ring order should be visually distinguishable.
- The ring display should remain aligned with the microscope view.

### Rendering approach

Use a procedural method such as a shader, canvas texture, or mathematically generated geometry. Choose the approach that is easiest to maintain and performs reliably in the browser.

Do not attempt unnecessary full optical ray tracing or computationally expensive photon simulation. The simulation should be mathematically driven and visually convincing enough for learning.

## 9. Travelling microscope

The travelling microscope is a central interactive feature.

### Horizontal movement

- Provide controls for moving the microscope left and right.
- Provide a direct, precise adjustment control, such as a slider, buttons, or keyboard controls.
- Simulate movement in increments of **0.01 mm** where the UI represents the experimental precision.
- Display the current microscope position.
- Prevent movement beyond the simulated instrument’s allowed travel range.
- The microscope position must determine the displayed scale reading and the measurement position.

### Vertical focusing

- Provide a vertical focus adjustment.
- Show a visible or clearly communicated change in focus.
- In the ideal mode, focusing should help the user bring the ring pattern into view.
- In practice or exam mode, focus errors may reduce clarity or make measurement more difficult.
- Focus must not silently alter the true physics values.

### Microscope viewfinder

Provide a separate viewfinder mode or viewport that shows:

- The relevant ring pattern.
- A crosshair.
- The selected target ring or a way to identify it.
- A clear indication of the microscope’s current position.
- A close-up Main Scale and Vernier Scale reading.

The user should be able to switch between the external 3D apparatus view and the microscope view without losing their experiment state.

### Crosshair

- The crosshair should be visible and centered in the viewfinder.
- The user must be able to align it with a chosen ring.
- The recorded reading must reflect the microscope position at the moment the user records it.
- The crosshair must not automatically snap to a ring unless a clearly labelled assistance mode is active.

## 10. Main Scale and Vernier Scale

The microscope interface must display a simulated scale with readable markings.

### Main Scale

- Display a labelled Main Scale.
- Update the displayed position as the microscope moves.
- Make the scale legible at ordinary desktop size and during a screen-share or smart-board demonstration.
- Clearly distinguish the main-scale reading from the Vernier contribution.

### Vernier Scale

- Display a labelled Vernier Scale.
- Show its current alignment relative to the Main Scale.
- Use a documented least count.
- Display the calculated reading and its units.
- Keep the least count and scale divisions internally consistent.

### Reading model

The exact simulated scale design and least count must be documented in the implementation. Avoid showing a visually detailed scale that produces readings unrelated to the actual microscope position.

A scale reading should be computed from the simulated position and the configured scale model. Do not hardcode a list of unrelated readings for the required rings.

## 11. Measurement procedure

### Required ring sequence

The guided experiment should support measuring these ring orders:

- 16th ring.
- 12th ring.
- 8th ring.
- 4th ring.

For each selected order, collect readings on both sides of the central point.

The system should identify the side consistently, such as Left and Right, and store the ring order and side with each reading.

### Recording readings

Each measurement record should include at least:

- Ring number.
- Side (left or right).
- Microscope position or scale reading.
- Main Scale reading.
- Vernier Scale reading.
- Total reading.
- Measurement timestamp or sequence number, if useful.

Do not force users to enter a value that the simulation can derive reliably from the instrument state. However, allow manual entry or correction where the selected mode requires the student to perform the calculation.

### Diameter calculation

For each ring order:

\[
D_n = |x_{\text{right},n} - x_{\text{left},n}|
\]

Use the same unit for both readings before subtraction. If the left and right readings are signed positions around a central origin, the absolute difference should still produce a positive diameter.

Then calculate:

\[
D_n^2 = D_n \times D_n
\]

Display the values with appropriate units and sensible precision.

### Data validation

- Do not calculate a diameter until both left and right readings for that ring order exist.
- Flag missing readings.
- Warn about duplicate readings for the same side and ring order.
- Allow the user to replace a reading intentionally.
- Clearly distinguish incomplete data from a completed measurement set.
- Avoid silently fabricating missing readings or replacing user measurements with ideal values.

## 12. Results and graph

### Measurement table

Display a table with one row per ring order and columns for:

- Ring order \(n\).
- Left reading.
- Right reading.
- Diameter \(D_n\).
- Squared diameter \(D_n^2\).
- Measurement status.

Provide a clear way to edit or re-record readings.

### Graph

Plot \(D_n^2\) against ring order \(n\).

- Horizontal axis: ring number \(n\).
- Vertical axis: squared diameter \(D_n^2\), with units clearly stated.
- Show the measurement points.
- Include a fitted line when there are enough valid points.
- Display the fitted slope and the method used to obtain it.
- Use the fitted slope to calculate wavelength when the lens curvature \(R\) is known.

If the app includes ideal simulated data for demonstration, visually distinguish it from measured data.

### Wavelength result

Display:

- Calculated wavelength.
- Units.
- Calculation method.
- Lens radius of curvature used.
- Sodium reference wavelength: 589.3 nm.
- Percentage difference from the reference.
- A brief interpretation of the result.

Percentage difference:

\[
\text{Percentage difference} =
\frac{|\lambda_{\text{measured}}-\lambda_{\text{reference}}|}
{\lambda_{\text{reference}}}\times100
\]

Label this quantity accurately. Do not present it as a guaranteed measure of experimental accuracy if the simulated setup uses simplified assumptions.

## 13. Learning modes

### Learn Mode

Purpose: teach the user the procedure and concepts.

- Provide guided instructions.
- Explain each apparatus component.
- Introduce the relevant equation at the appropriate stage.
- Provide hints about the next step.
- Explain how to read the scale and record a measurement.
- Allow the student to repeat steps.

### Practice Mode

Purpose: let the user perform the experiment with reduced guidance.

- Let the student control the apparatus and microscope.
- Allow readings to be recorded manually.
- Provide feedback after actions or at the end of the experiment.
- Support optional simulated errors.
- Let the student retry and compare results.

### Exam Mode

Purpose: assess whether the student can carry out the procedure independently.

- Minimize step-by-step hints.
- Present a defined task and required ring orders.
- Require the student to complete the measurement set and calculation.
- Provide a results summary after submission.
- If scoring is implemented, show a transparent breakdown of how the score was calculated.
- Do not make the exam mode depend on an external AI service.

## 14. Physics-aware error engine

The project’s distinguishing feature is an educational error engine that simulates common experimental difficulties and explains their effects.

### Possible simulated errors

1. **Alignment error:** the optical setup is not centered or adjusted correctly.
2. **Focus error:** the rings are blurred or difficult to distinguish.
3. **Parallax error:** the apparent reading changes when the user’s viewing position is offset.
4. **Backlash:** the movement mechanism behaves differently depending on the direction of approach.
5. **Reading error:** the user records the wrong scale mark or Vernier division.
6. **Low contrast or poor illumination:** the ring boundary is difficult to identify.

### Design requirements

- Errors should be optional and controllable, particularly in Practice Mode.
- The interface should explain the error in understandable language.
- Simulated errors must have a defined effect on the visual experience, instrument reading, or resulting data.
- Never alter the true wavelength or radius of curvature invisibly just to force a particular result.
- Make a distinction between the true simulated value and the value inferred from imperfect measurements.
- Give the user a chance to diagnose and correct a simulated problem.
- Avoid random errors that are impossible for the student to understand or reproduce.
- If randomness is used, provide a repeatable or resettable seed where practical.

## 15. Optional collaboration: Lab Partner Mode

Lab Partner Mode is a secondary feature, not a blocker for the core virtual experiment.

### Concept

Two users can collaborate:

- One user operates the microscope.
- The other records readings in a shared table.

### Possible implementation

- A session host creates a lab session.
- A second user joins through a session code or invitation link.
- Both users can see the current experiment state.
- The operator controls the microscope.
- The recorder can add or confirm readings.
- The shared measurement table updates for both participants.

Use Supabase Realtime if collaboration is implemented. If real-time multi-user support is too large for the hackathon timeframe, implement a convincing single-user workflow first and document collaboration as a later milestone.

Do not represent a local mock collaboration screen as a working networked feature.

## 16. Technology stack

Use this stack unless a technical blocker is identified and the change is approved by the project owner.

### Frontend

- React.
- Vite.
- TypeScript.
- Tailwind CSS.

### 3D and visualization

- Three.js.
- React Three Fiber.
- `@react-three/drei`.
- Recharts for the measurement graph.

### Backend and persistence

- Supabase.
- PostgreSQL through Supabase.
- Supabase Auth if user accounts are needed.
- Supabase Realtime for Lab Partner Mode.

### Version control and deployment

- GitHub.
- Vercel.

### Implementation principles

- Keep the physics model independent from the UI.
- Keep the first working experiment local before introducing backend dependencies.
- Use reusable React components.
- Use TypeScript types for experiment settings, instrument state, measurements, and results.
- Avoid unnecessary dependencies.
- Use environment variables for credentials and never commit secrets.
- Prefer simple, maintainable implementations over premature abstraction.

## 17. Suggested architecture

This is a suggested structure, not a requirement to create every file immediately. Adapt it to the existing repository and the current development stage.

```text
OptiLab360/
├── AGENTS.md
├── docs/
│   ├── PROJECT_SPEC.md
│   └── DEVELOPMENT_PLAN.md
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── laboratory/
│   │   ├── microscope/
│   │   ├── vernier/
│   │   ├── measurements/
│   │   ├── charts/
│   │   ├── errors/
│   │   └── modes/
│   ├── scenes/
│   │   └── NewtonRingsScene.tsx
│   ├── physics/
│   │   ├── newtonsRings.ts
│   │   ├── optics.ts
│   │   ├── calculations.ts
│   │   └── errors.ts
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

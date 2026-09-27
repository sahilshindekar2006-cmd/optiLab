# OPTILAB 360: Virtual Newton's Rings Digital Twin

> A 100% software-based, physics-accurate browser virtual laboratory that lets students actually perform the Newton's Rings experiment—from optical bench alignment and travelling microscope mechanics to Vernier scale readings and live regression plotting.

---

## Problem Statement Fit

We built this for the **Virtual Physics Laboratory (Thin-Film Optical Interference)** challenge because almost every first-year engineering and physics student has to do the Newton's Rings experiment, and almost everyone runs into the exact same headaches:

- **Finicky Optical Alignment:** Students easily burn 30 to 45 minutes just trying to angle the 45° glass plate and condenser lens to catch the faint yellow illumination of the sodium vapor lamp.
- **Travelling Microscope Frustration:** Reading a mechanical travelling microscope is genuinely tricky. The main scale and 0.01 mm Vernier markings are tiny, and reading the wrong coinciding line throws off the entire calculation.
- **The Backlash Trap:** If you overshoot the 16th dark ring and casually spin the lead screw backward, mechanical gear clearance (backlash error) shifts your position. Most students don't realize this happened until their calculated wavelength ends up 30–40% off, usually when lab time is already up.
- **Formula Memorization over Real Physics:** Because students get overwhelmed fighting the apparatus, they end up just memorizing the formula ($D_n^2 = 4n\lambda R$) for their viva exams instead of understanding wave interference.

### How OptiLab 360 Solves It
We didn't build a shallow animation where clicking a button magically spits out `589.3 nm`. We built a **physics-aware digital twin** that runs straight in the browser. 

You enter a darkened 3D optics room, flip on the sodium lamp, focus the objective lens, turn the lead screw to position the reticle over real mathematical fringes, read the physical Vernier graduations, log your readings, and watch live linear regression compute the wavelength. If you turn the screw backward without resetting, the engine simulates backlash error and explains exactly why your graph skewed.

---

## Target Users

- **First & Second-Year Engineering and Physics Students:**
  Undergrads taking Optics or Applied Physics lab. It lets them practice the entire sequence at their own pace before practical exams, build confidence reading Vernier coincidences, and see how slight measurement slips ripple into their final graph.
- **Optics Instructors & Lab Teaching Assistants:**
  Demonstrating a travelling microscope in a lecture hall or crowded lab is notoriously hard because only one student can look through the eyepiece at a time. OptiLab 360 runs cleanly on classroom smartboards and projectors, making it easy to teach alignment, fringe counting, and scale reading live.
- **Colleges & Distance-Learning Programs with Limited Lab Budgets:**
  Quality optics equipment is pricey. Precision plano-convex lenses scratch easily, and travelling microscopes require regular maintenance. OptiLab 360 gives students unlimited, reproducible lab sessions with zero equipment wear and tear.

---

## What We Built

During this hackathon sprint, we developed an end-to-end, browser-native virtual optics laboratory:

- **Interactive 3D Optical Bench (WebGL):** Built using Three.js and React Three Fiber. Includes an optical bench rail, monochromatic 589.3 nm sodium vapor lamp, condenser lens assembly, 45° beam splitter plate, plano-convex lens on an optical flat, and a travelling microscope stand.
- **Procedural Wave-Optics Engine:** The rings aren't canned image files. A procedural canvas/shader generates interference fringes on the fly based on $r_n = \sqrt{n\lambda R}$. If you adjust the lens curvature $R$ or light wavelength $\lambda$, the rings physically expand or compress.
- **Travelling Microscope with Dual-Axis Controls:** Includes fine horizontal travel down to 0.01 mm across the ring system and vertical rack-and-pinion movement for focal adjustment.
- **Live Main & Vernier Scale System:** Displays simulated physical graduations where the Vernier scale physically slides along the main scale, updating the Main Scale Reading (M.S.R.), coinciding line (V.S.D.), and least count ($0.01\text{ mm}$) in real time.
- **Guided 16–12–8–4 Ring Measurement Workflow:** A clean experimental tracker that walks students through measuring rings 16, 12, 8, and 4 on both the left and right sides of the central spot, automatically calculating diameters $D_n$ and $D_n^2$.
- **Dynamic $D^2$ vs $n$ Regression Graph:** Uses Recharts to run an ordinary least-squares fit on your recorded data, plots the best-fit line, and extracts the slope ($4\lambda R$) to calculate $\lambda$ in meters, nanometers, and Ångströms with instant percentage error comparison against the 589.3 nm reference.
- **Physics-Aware Error Engine:** Models realistic mechanical backlash (hysteresis deadband when reversing travel direction) and focal blur uncertainty, providing clear, educational explanations of the underlying mechanical issues.
- **Three Learning Modes:** 
  - *Learn Mode:* Guided walkthrough with step-by-step theory, ray diagrams, and hints.
  - *Practice Mode:* Sandbox with adjustable lens radius, custom wavelengths, and error toggles.
  - *Exam Mode:* Timed evaluation with randomized conditions, hidden intermediate values, and automated grading.

---

## Core Features

- **Procedural Physics (No Fake Textures):** Concentric fringes are calculated mathematically from wave optics: $D_n = 2\sqrt{n\lambda R}$. You see the exact quadratic spacing where outer rings crowd closer together.
- **Realistic Darkened Lab Ambiance:** Monochromatic sodium yellow lighting (589.3 nm hue), full orbit/pan/zoom scene controls, and smooth one-click camera transitions between the Lab View and the Microscope Viewfinder.
- **Eyepiece Viewfinder with Measurement Reticle:** Look straight down the microscope tube at the rings, with a high-contrast crosshair that tracks the carriage position.
- **Vertical Focus Rack:** Turning the focus knob changes image sharpness. Out-of-focus states blur the fringes and increase measurement uncertainty, teaching students that proper focus is required before logging data.
- **Interactive Vernier HUD:** Shows the sliding Vernier scale alongside the main scale, highlighting the coinciding mark so students understand how $\text{Reading} = \text{M.S.R.} + (\text{V.S.D.} \times 0.01\text{ mm})$ is derived.
- **Guided 16-12-8-4 Dark Ring Sequence:** Keeps students on track across both sides of the central spot without losing count of which ring they're measuring.
- **Live Data Table with Instant Validation:** Calculates $D_n = |x_{\text{right}} - x_{\text{left}}|$ and $D_n^2$ as soon as both sides of a ring are recorded, flagging inverted or impossible values.
- **Instant Linear Regression Plot:** Renders a scatter plot of $D^2$ against ring number $n$, computes the line of best fit, and extracts:
  $$\text{Slope} = 4\lambda R \implies \lambda = \frac{\text{Slope}}{4R}$$
- **Root-Cause Error Diagnostics:** Detects when you change movement direction mid-measurement, displays an alert explaining that mechanical gear play occurred, and shows how that shift deformed the slope.
- **Cloud Persistence & Guest Mode:** Save experimental runs, graphs, and scores to Supabase PostgreSQL, or hop right into a zero-friction demo as a Guest.

---

## Technical Architecture

```
                          +-------------------------------------------------------+
                          |                     OPTILAB 360                       |
                          |              (React 18 + Vite + TypeScript)           |
                          +-------------------------------------------------------+
                                                      |
         +--------------------------------------------+--------------------------------------------+
         |                                            |                                            |
         v                                            v                                            v
+-----------------------------+              +-------------------------------+             +-------------------------------+
|     3D WebGL Scene          |              |    Client-Side Physics Engine |             |     UI & Measurement Deck     |
| (Three.js / R3F / Drei)     |              |       (TypeScript Core)       |             |   (Tailwind CSS / Recharts)   |
|-----------------------------|              |-------------------------------|             |-------------------------------|
| - Optical bench & mounts    |              | - $r_n = \sqrt{n\lambda R}$   |             | - Eyepiece Viewfinder HUD     |
| - 589.3nm sodium lamp       | <----------> | - $D_n = 2\sqrt{n\lambda R}$  | <---------> | - Main & Vernier Scale (0.01) |
| - 45° glass plate & lens    |              | - Thin-film phase conditions  |             | - 16-12-8-4 Data Table        |
| - Travelling microscope 3D  |              | - Least-squares regression    |             | - D² vs n Graph with Slope    |
| - Camera transition system  |              | - Backlash & blur modeling    |             | - Error Diagnostic Cards      |
+-----------------------------+              +-------------------------------+             +-------------------------------+
                                                              |
                                                              v
                                             +-------------------------------+
                                             |   Supabase Backend & Storage  |
                                             |-------------------------------|
                                             | - PostgreSQL Experiment Logs  |
                                             | - Supabase Auth (Guest/User)  |
                                             | - Score & Trial History       |
                                             +-------------------------------+
```

### Key Technical Decisions
1. **Client-Side Physics in Pure TypeScript:** Rather than running physics calculations on a remote Python server, we implemented all interference optics, regression math, and error models in client-side TypeScript. This guarantees 60fps responsiveness with zero network latency when spinning the microscope knobs.
2. **Procedural Shaders / Canvas over Heavy 3D Meshes:** Rendering dozens of ultra-thin concentric rings with complex geometry can easily bog down browser WebGL engines. We generate the fringe interference pattern procedurally using thin-film wave equations, ensuring silky smooth performance even on low-end laptops.
3. **Strict Data Coupling (No Disconnected Values):** The application follows a rigid physical chain:
   $$\text{Traverse Input} \longrightarrow \text{Carriage Coordinate} \longrightarrow \text{Vernier Coincidence} \longrightarrow \text{Logged Points} \longrightarrow D \longrightarrow D^2 \longrightarrow \text{Regression Slope} \longrightarrow \lambda$$
   You cannot get a fake reading; your actual reticle position on the wave fringe directly determines the scale value.

---

## Tech Stack

| Layer | Tools & Libraries | Why We Chose It |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + TypeScript** | Component reusability and bulletproof type safety for physics state |
| **Build Tool** | **Vite** | Instant HMR development and fast, compact production builds |
| **Styling** | **Tailwind CSS** | Clean, dark laboratory theme with responsive layouts |
| **3D Rendering** | **Three.js + React Three Fiber (R3F)** | Modern declarative WebGL scene management inside React |
| **3D Helpers** | **@react-three/drei** | Smooth camera controllers and optimized lighting tools |
| **Graphing** | **Recharts** | Lightweight, responsive SVG scatter plots and regression lines |
| **Icons** | **Lucide React** | Clean, modern scientific instrumentation icons |
| **Backend & Database** | **Supabase (PostgreSQL)** | Simple, reliable storage for experiment trials, scores, and auth |
| **Deployment** | **Vercel** | Fast global edge hosting with automatic preview deployments |

---

## Innovation / Uniqueness

1. **A True Digital Twin, Not a Video or Flash Clone:**
   Most existing virtual physics labs are either click-through animations or static 2D illustrations with hardcoded numbers. In OptiLab 360, the optics are live: change the lens radius $R$ or wavelength $\lambda$, and the fringes physically widen or contract on your screen.
2. **Mechanically Linked Vernier Scale:**
   The Vernier scale isn't an independent slider widget. Moving the microscope carriage physically translates the reticle over the optical field while simultaneously shifting the graduations on the virtual scale, matching real instrument mechanics.
3. **Educational Backlash & Error Engine:**
   In real life, changing screw direction introduces thread play ($0.03\text{ mm}$ deadband). Instead of showing a generic error, OptiLab 360 diagnoses:
   > *"Microscope backlash detected: You reversed traverse direction while approaching ring n=12. Screw thread play shifted the carriage coordinate, artificially reducing diameter D and skewing the slope."*
4. **Authentic Experimental Flow:**
   Students perform the genuine, accepted lab protocol (rings 16, 12, 8, 4 on both sides), verifying ring numbers, centering the reticle, reading the Vernier, and comparing both two-ring and slope methods against the 589.3 nm sodium reference.
5. **Zero Hardware, Zero Setup:**
   Runs out of the box on any modern web browser. No Arduino, no hardware sensors, no Unity plugins, and no expensive computers needed.

---

## Demo Instructions

Here is a quick **2 to 3-minute walkthrough** for judges to test the complete experiment:

### 1. Enter the Lab & Power Up (0:00 – 0:30)
1. Open OptiLab 360 and click **"Start Experiment"** (or choose **Practice Mode**).
2. Look around the 3D optical bench using mouse drag (orbit/pan).
3. Toggle the **Sodium Lamp Switch** to **ON**. The setup illuminates in characteristic 589.3 nm monochromatic yellow.

### 2. Enter Microscope & Focus (0:30 – 1:00)
1. Click **"Enter Microscope"** to look straight down the eyepiece viewfinder.
2. Fringes will initially appear slightly soft. Turn the **Focus Knob** until the concentric dark rings sharpen into focus around the central dark spot.
3. Note the vertical crosshair ready for alignment.

### 3. Take Ring Readings (1:00 – 2:00)
1. Use the horizontal knob or keyboard arrow keys ($\leftarrow / \rightarrow$) to traverse left to the **16th dark ring**.
2. Look at the **Main Scale & Vernier Scale** HUD at the bottom—notice how the M.S.R. and coinciding Vernier line update dynamically (e.g., $18.42\text{ mm}$).
3. Click **"Record Reading (Left 16)"**.
4. Traverse all the way across the center to the **Right 16th dark ring** and click **"Record Reading (Right 16)"**.
5. Check the Data Table: Diameter $D_{16}$ and $D_{16}^2$ are calculated instantly.
6. Repeat for rings **12, 8, and 4** (or click *"Auto-Fill Remaining Readings"* if you are in a rush during judging).

### 4. Inspect the Graph & Wavelength (2:00 – 2:30)
1. Open the **Results & Graph Panel**.
2. Check the live **$D^2 \text{ vs } n$ Graph**: observe the four points and the linear regression line.
3. Verify the calculated slope and final wavelength:
   $$\lambda = \frac{\text{Slope}}{4R} \approx 5.893 \times 10^{-7}\text{ m} = 589.3\text{ nm} = 5893\text{ \AA}$$
4. See how the percentage error compares against the standard $589.3\text{ nm}$ sodium reference value.

### 5. Trigger the Error Engine (2:30 – 3:00)
1. Under Experiment Controls, toggle **"Simulate Backlash Error"**.
2. Turn the microscope knob left, then immediately reverse right while taking a reading.
3. Notice the warning banner explaining how screw thread clearance shifted your position and distorted your calculated diameter.

---

## Known Limitations

- **Single-User in Current MVP:** The database schema is set up for multi-user collaboration, but we focused the hackathon sprint on getting the single-user physics, microscope mechanics, and Vernier readings 100% stable before rolling out multiplayer.
- **Ideal Lens Model:** The simulation currently assumes a spherical plano-convex lens with uniform curvature. Real-world dust particles between the plates or non-spherical lens distortions are not yet simulated.
- **Requires Standard WebGL:** Needs a modern browser with standard WebGL support (standard on practically all laptops, phones, and tablets today).

---

## Future Work

- **Realtime Lab Partner Mode:** A collaborative mode where two students join the same virtual bench over WebSockets—one student turns the microscope knobs while their partner verifies the Vernier line and logs readings.
- **More Classical Optics Experiments:** Expand the digital twin engine to support the **Michelson Interferometer**, **Diffraction Grating Spectrometer**, and **Fresnel Biprism**.
- **AI Lab Mentor:** An embedded tutor that watches student actions in real time and offers Socratic hints (e.g., *"You're measuring ring 12, but your focus is blurry. Try adjusting the vertical rack first"*).
- **One-Click PDF Lab Report Export:** Generates a formatted institutional lab record sheet with the student's name, raw data table, Recharts regression graph, calculated wavelength, and error percentage ready for submission.
- **WebXR / VR Support:** Let students put on a VR headset and physically reach out to turn the microscope knobs and alignment screws in full 3D space.

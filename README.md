# The Last Signal — A Cinematic Scrollytelling Website

This is a cinematic, scroll-driven web experience built with Next.js (App Router, TypeScript), Tailwind CSS, GSAP (ScrollTrigger), and React Three Fiber (Three.js). It takes users on a narrative journey exploring the search for life in the deep cosmos.

## Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the browser:**
   Navigate to localhost to view the scrollytelling experience.

4. **Production build verification:**
   ```bash
   npm run build
   ```

---

## Scroll Range & Timeline Mapping

The scrollytelling experience runs on a unified native document scrollbar over a total length of `800vh` (8 screens of `100vh` each). The absolute scroll progress $p \in [0.0, 1.0]$ maps to the 8 scenes as follows:

| Progress Range | Scene Name | 3D Visual Assets (Canvas) | 2D DOM Overlays |
| :--- | :--- | :--- | :--- |
| **`0.000` to `0.125`** | **Scene 1: The Beginning** | Camera starts at `[0,0,15]` looking at a void. Starfield spins slowly. | Centered glowing solid radio pulse (SVG/CSS) with text: *"In 1977, humanity heard something... and we're still listening."* |
| **`0.125` to `0.250`** | **Scene 2: The Wow! Signal** | 3D radio telescope base silhouette scales up, pivots, and rotates. | SVG waveform draws in sync; famous "6EQUJ5" signature is circled in red ink on the printout. |
| **`0.250` to `0.375`** | **Scene 3: The Milky Way** | Camera dollys far out (`z` zooms out to `28`). Four-armed logarithmic spiral galaxy appears and rotates. | Sagittarius constellation vectors (A -> B -> C -> D -> E -> A) draw themselves sequentially. |
| **`0.375` to `0.500`** | **Scene 4: Where Could They Be?** | Camera orbits through star fields, highlighting exoplanets Kepler-452b, TRAPPIST-1e, and Proxima Centauri b. | Odomoter counts for candidate planets and distance; glassmorphic planet detail cards float into view. |
| **`0.500` to `0.625`** | **Scene 5: Voyager Messages** | Camera follows the Voyager Golden Record as it flies past. Emissive engravings glow under warm gold spotlights. | specifications of greetings, languages, and cargo etched on the Golden Record float out inside gold-bordered panels. |
| **`0.625` to `0.750`** | **Scene 6: Modern Search** | An array of 3 radio telescope dishes track the sky, projecting animated pulsing signal beams upward. | Stylized world map lights up with active SETI observatories (FAST, MeerKAT, Arecibo) alongside data counters. |
| **`0.750` to `0.875`** | **Scene 7: What If They Answer?** | Rotation/motion freezes instantly. Dynamic point lights pulse white-blue, then fade to zero. | Incoming signal blip flashes, triggers a full-screen white/blue strobe flash, followed by absolute silence and *"We're still waiting."* |
| **`0.875` to `1.000`** | **Scene 8: Final Scene** | All lights extinguish. Starfield opacity fades to 0. Camera retreats to black void. | Final quote fades in: *"The universe is quiet. That doesn't mean we're alone."* alongside a functional **Replay** button. |

### How to Retime Transitions

- **2D Fades:** The overlays calculate their opacity based on the `progress` value inside their files (e.g. `SceneXTitle.tsx` checks if `progress` is in its active range and applies a `0.03` fade buffer). Change the range bounds or buffers to shorten/lengthen active windows.
- **3D Camera path & Lighting:** The camera positions, look-at coordinates, and light levels are computed dynamically inside `components/Scene.tsx` in a `useFrame` loop using keyframe conditions matching the ranges above. Adjust the `lerp` targets to move the camera path or change lights.

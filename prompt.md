# 🎵 GitHub Music Generator — Full Product & Engineering Prompt

Build a premium, visually stunning, highly interactive web application called **GitHub Music Generator**.

The app allows users to sign in with GitHub and transforms their GitHub activity into:
- procedurally generated music
- animated visualizations
- a developer “audio identity”
- shareable cards/videos
- a personalized music profile

The experience should feel like:
- Spotify Wrapped
- GitHub contribution graph
- a synthwave music visualizer
- futuristic creative coding art

The application must be:
- fully responsive
- mobile-first
- smooth on low-end devices
- accessible
- visually premium
- animation-rich
- highly interactive

---

# 🧠 Core Concept

A user logs in using GitHub OAuth.

The system analyzes:
- repositories
- commit frequency
- contribution graph
- languages used
- stars/forks
- coding patterns
- active hours
- issue activity
- pull requests

Then converts that data into:
- sound
- rhythm
- instruments
- ambience
- visual effects
- music genres
- reactive animations

The result:
> “This is what your coding sounds like.”

---

# 🎨 Visual Direction

The UI should feel:
- futuristic
- elegant
- immersive
- cinematic
- dark-mode-first

Inspired by:
- Spotify
- Linear
- Vercel
- Apple Music visualizers
- synthwave aesthetics
- cyberpunk HUD interfaces
- modern creative coding showcases

---

# 🎨 Design Requirements

## Theme
- Dark mode by default
- Neon accents
- Frosted glass UI
- Smooth gradients
- Soft glow effects
- Dynamic animated backgrounds

## Color Palette
Use combinations of:
- deep black
- rich navy
- electric purple
- neon blue
- teal
- magenta

## Typography
Use premium modern fonts:
- Inter
- Geist
- Space Grotesk

---

# 📱 Responsiveness

The app MUST work beautifully on:
- mobile
- tablet
- laptop
- ultrawide monitors

Requirements:
- adaptive layouts
- collapsible panels
- mobile bottom navigation
- touch gestures
- responsive canvas rendering
- no overflowing elements
- optimized animations on mobile

---

# 🔐 Authentication

Implement GitHub authentication.

Use:
- NextAuth.js or Auth.js
- GitHub OAuth

After login:
- fetch GitHub profile
- repositories
- contribution data
- languages
- stars
- commit history
- pull requests

---

# 🏗️ Tech Stack

Use:
- Next.js App Router
- TypeScript
- TailwindCSS
- Framer Motion
- React Three Fiber
- Three.js
- Zustand
- shadcn/ui

Optional:
- Tone.js for procedural music generation
- Web Audio API
- GLSL shaders
- Supabase or PostgreSQL

---

# 🎵 Music Generation System

Use GitHub data to generate procedural music.

## Mapping Rules

### Commits per day
Controls:
- BPM
- rhythm intensity

Examples:
- low commits → ambient slow tempo
- high commits → energetic electronic music

---

### Programming languages
Map to instruments.

Examples:
- Python → soft synth pads
- Rust → industrial bass
- Go → clean digital plucks
- JavaScript → upbeat electronic leads
- TypeScript → polished synthwave
- Shell → glitch percussion
- Kubernetes repos → atmospheric drones

---

### Contribution streaks
Control:
- consistency of rhythm
- repeating motifs

---

### Stars/Forks
Control:
- harmonic richness
- layered instruments

---

### Active coding hours
Control:
- daytime vs nighttime mood

Examples:
- night coder → dark cyberpunk ambience
- morning coder → bright ambient electronic

---

### Open Source Activity
Controls:
- crowd ambience
- vocal textures
- choir-like layers

---

# 🎧 Audio Features

Implement:
- procedural soundtrack generation
- real-time audio synthesis
- looping compositions
- smooth transitions
- play/pause
- volume mixer
- mute instruments
- live remix mode

Users should be able to:
- regenerate soundtrack
- select themes
- export audio
- share soundtrack

---

# 🌌 Main Experience

## Landing Page

Hero section:
- animated music-reactive background
- floating particles
- glowing waveform
- CTA button:
  “Generate Your Dev Soundtrack”

Include:
- animated previews
- scrolling showcase
- feature cards
- testimonials mockup
- sample developer soundtracks

---

# 🧑‍💻 Dashboard

After login:
show a cinematic dashboard.

Sections:

## 1. Developer Identity Card
Display:
- avatar
- username
- developer archetype
- soundtrack genre
- coding aura

Example:
> “Midnight Infrastructure Architect”

---

## 2. Music Visualizer

Create a stunning real-time visualizer.

Include:
- waveform
- circular spectrum
- particles
- audio-reactive glow
- 3D camera movement
- floating repo nodes

Visualizer should react live to music.

---

## 3. GitHub Analytics

Beautiful charts for:
- commits
- languages
- streaks
- repo activity
- OSS contributions

Use:
- Recharts
- animated charts
- smooth transitions

---

## 4. Procedural Audio Controls

Allow:
- genre selection
- synthwave mode
- ambient mode
- orchestral mode
- cyberpunk mode
- lo-fi mode

Sliders:
- energy
- ambience
- glitch
- complexity
- bass
- tempo

---

## 5. Repo Constellation

Display repositories as:
- floating planets
- stars
- interconnected nodes

Hover interactions:
- repo details
- stars
- commits
- language

Use Three.js.

---

# 🎥 Shareability Features

Users MUST be able to:
- generate share cards
- export screenshots
- export mini videos
- share to:
  - Twitter/X
  - LinkedIn
  - Instagram Stories

Generate:
- animated developer music cards
- waveform previews
- “Your GitHub Sounds Like...” cards

---

# 🤖 AI Features

Add AI-generated insights.

Examples:
- “You code like a late-night synth engineer.”
- “Your repositories create a calm atmospheric rhythm.”
- “Your coding pattern resembles experimental electronic music.”

Generate:
- developer aura
- music personality
- coding mood
- soundtrack lore

---

# ⚡ Microinteractions

Implement:
- hover animations
- glassmorphism
- animated gradients
- subtle sound effects
- magnetic buttons
- smooth page transitions
- inertia scrolling
- spring animations

Everything should feel alive.

---

# 🌠 Background Effects

Implement:
- animated starfields
- particles
- aurora gradients
- waveform shaders
- audio-reactive lighting

Use:
- WebGL
- shaders
- canvas effects

Must still perform smoothly.

---

# ⚙️ Performance Requirements

The app MUST:
- maintain smooth FPS
- lazy load heavy components
- optimize Three.js rendering
- reduce effects on low-end devices
- use dynamic imports
- avoid hydration issues

---

# 🧩 Architecture

Use clean scalable architecture:
- modular components
- reusable hooks
- feature-based folders
- typed APIs
- server actions where appropriate

---

# 📂 Suggested Pages

## Public Pages
- /
- /explore
- /about
- /showcase

## Authenticated
- /dashboard
- /soundtrack
- /repos
- /visualizer
- /settings

---

# 🌍 Explore Page

Allow browsing public generated profiles.

Discover:
- trending soundtracks
- most atmospheric developers
- loudest coders
- calmest developers
- most chaotic repos

---

# 🧪 Experimental Features

Add:
- multiplayer soundtrack blending
- compare two GitHub profiles
- collaborative music sessions
- “battle mode”
- AI DJ remix mode

---

# 🧱 Component Ideas

Create reusable components:
- GlassCard
- AudioVisualizer
- RepoGalaxy
- NeonButton
- WaveformCanvas
- FloatingPanel
- GithubStatsPanel
- SoundtrackPlayer

---

# 🎞️ Animations

Use Framer Motion extensively.

Include:
- staggered animations
- fade reveals
- parallax
- page transitions
- animated counters
- spring movement

---

# 🧠 Developer Archetypes

Generate fun archetypes like:
- Infrastructure Alchemist
- Midnight Debugger
- Open Source Nomad
- Chaotic Hacker
- Systems Architect
- Pixel Wizard
- Cloud Summoner

---

# 📦 Deliverables

Generate:
- complete frontend
- API routes
- authentication flow
- GitHub integration
- procedural music engine
- responsive layouts
- animations
- production-quality UI

---

# 🚀 Final Goal

The final product should feel:
- magical
- futuristic
- emotionally engaging
- technically impressive
- highly shareable

When users open it, they should think:
> “This is one of the coolest developer projects I’ve ever seen.”
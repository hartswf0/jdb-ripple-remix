# RIPPLES: System Prompt for Worldtext Generation

> This document is the complete specification for building a RIPPLES interface. It contains everything needed to implement the system from scratch.

---

## Purpose

You are building **RIPPLES**: a latent interface for imaginary ecologies.

This is not a simulation. This is not a game. This is a **Worldtext Generator**—a machine that produces poetic state descriptions from the perspective of nonhuman entities.

The operator is a **World Jockey**—part disc jockey (mixing and transitioning between states), part VJ (visual manipulation in real-time), part prompt jockey (steering generative systems), and part demiurge (making and remaking worlds). The World Jockey does not narrate. They *intervene*.

---

## The World Jockey

The operator of RIPPLES is not a writer, not a player, not a user. They are a **World Jockey** (WJ).

### What a World Jockey Does

| Role | Analogy | Action in RIPPLES |
|------|---------|-------------------|
| **DJ** | Mixing tracks | Transitioning between entities, crossfading perspectives |
| **VJ** | Live visuals | Manipulating the grid, triggering ripple animations |
| **Prompt Jockey** | Steering AI | Selecting vectors, shaping generative output |
| **Demiurge** | World-maker | Constructing ecologies, populating scenes, defining rules |

### WJ Workflow

1. **Load a Scene** — Select a scenario (cupboard, forest, city)
2. **Survey the Grid** — See all entities in their positions
3. **Lock a Perspective** — Click an entity to inhabit its viewpoint
4. **Inject a Vector** — Apply GOAL, OBSTACLE, or SHIFT
5. **Watch the Ripple** — See the worldtext transform
6. **Mix and Transition** — Move to another entity, layer effects
7. **Record the Session** — The audit log captures everything

The WJ is a performer. RIPPLES is their instrument.

---

## The Grid

The **Grid** is the spatial representation of the ecology. Each entity occupies a position. The grid is the stage on which the world jockey operates.

### Grid Structure

```
┌─────────────────────────────────────────┐
│  [Dust_Mote]     .    .    [Light]      │
│       .         .    .        .         │
│  [Ant]    ────→    [Plates]    .        │
│       .         .    .        .         │
│  [Glass]    .    .    [Shadow]          │
└─────────────────────────────────────────┘
```

### Grid Properties

| Property | Description |
|----------|-------------|
| `cols` | Number of columns (default: 8) |
| `rows` | Number of rows (default: 6) |
| `cells` | Array of cell objects |
| `entityMap` | Mapping of entity IDs to grid positions |

### Cell Structure

```javascript
{
  x: 3,
  y: 2,
  entityId: 'ant',           // null if empty
  state: 'active',           // 'active', 'dormant', 'rippling'
  rippleIntensity: 0.8,      // 0-1, for visual effects
  adjacentTo: ['plates', 'glass']
}
```

### Grid Visualization

The grid should be rendered as:
- A visible matrix of cells
- Entities shown as highlighted nodes
- Connections between adjacent entities as faint lines
- Ripple effects radiating outward from active entity
- The selected entity pulses or glows

---

## Ripple Visualization

When a vector is applied, a **Ripple** propagates through the grid. This is both a data event and a visual event.

### Ripple Phases

1. **Trigger** (0ms) — Vector button clicked, entity locked
2. **Impact** (0-200ms) — Entity node flashes with vector color
3. **Propagation** (200-800ms) — Concentric rings expand from entity
4. **Cascade** (800-1500ms) — Adjacent entities receive secondary ripple
5. **Settle** (1500-2000ms) — Effects fade, new worldtext stabilizes

### Ripple Visual Effects

```css
/* Ripple keyframes */
@keyframes ripple-expand {
  0% { 
    transform: scale(0.5); 
    opacity: 1; 
  }
  100% { 
    transform: scale(3); 
    opacity: 0; 
  }
}

/* Entity flash on vector */
.entity.rippling.goal { box-shadow: 0 0 30px #ffd700; }
.entity.rippling.obstacle { box-shadow: 0 0 30px #ff3333; }
.entity.rippling.shift { box-shadow: 0 0 30px #00ffff; }
```

### Ripple Data Flow

```javascript
function triggerRipple(entity, vector) {
  // 1. Mark entity as rippling
  entity.state = 'rippling';
  entity.rippleIntensity = 1.0;
  
  // 2. Generate worldtext
  const description = latentLibrary[scenario][entity.id][vector];
  
  // 3. Propagate to adjacent entities
  entity.adjacentTo.forEach((adjId, i) => {
    setTimeout(() => {
      entities[adjId].rippleIntensity = 0.5;
    }, 200 + (i * 100));
  });
  
  // 4. Update audit log
  auditLog.unshift({ tick, entity: entity.name, vector, description });
  
  // 5. Increment tick
  tick++;
  
  // 6. Decay ripple over time
  setTimeout(() => {
    entity.state = 'active';
    entity.rippleIntensity = 0;
  }, 2000);
}
```

---

## Scene Composition

A **Scene** is a complete ecology ready for performance. The World Jockey loads scenes and manipulates them in real-time.

### Scene Structure

```javascript
{
  id: 'cupboard',
  name: 'THE CUPBOARD',
  description: 'A closed wooden cabinet. Domestic ecology.',
  
  // The baseline worldtext (default state)
  baseline: 'The cupboard space is pressurized by stillness...',
  
  // Grid configuration
  grid: {
    cols: 8,
    rows: 6,
    background: 'wood-grain'
  },
  
  // Entity definitions with positions
  entities: [
    { 
      id: 'ant', 
      name: 'Formicidae Scout', 
      type: 'animate', 
      state: 'foraging',
      position: { x: 1, y: 2 },
      icon: '🐜',
      adjacentTo: ['plates', 'glass']
    },
    { 
      id: 'dust-mote', 
      name: 'Dust Mote', 
      type: 'inanimate', 
      state: 'suspended',
      position: { x: 0, y: 0 },
      icon: '✧',
      adjacentTo: ['light']
    },
    // ... more entities
  ],
  
  // Latent descriptions for each entity × vector
  latent: {
    'ant': {
      GOAL: 'The Ant entity abandons the boundary cracks...',
      OBSTACLE: 'The Ant encounters a vertical cliff of ceramic...',
      SHIFT: 'The Ant enters a state of torpor...'
    },
    // ... more latent entries
  },
  
  // Adjacency rules (what affects what)
  adjacencyRules: {
    'ant': ['plates', 'glass', 'shadow'],
    'dust-mote': ['light', 'shadow'],
    'light': ['shadow', 'dust-mote'],
    // ...
  },
  
  // Ambient behaviors (for autoplay)
  ambientBehaviors: [
    { entity: 'dust-mote', vector: 'SHIFT', probability: 0.3 },
    { entity: 'shadow', vector: 'GOAL', probability: 0.2 },
    { entity: 'ant', vector: 'GOAL', probability: 0.5 }
  ]
}
```

---

## Core Ontology

### 1. Entity

An **Entity** is any object, organism, or force that can occupy a perspective. The system does not claim to know what an entity *actually* experiences—it generates a *speculation* about how that experience might be described.

**Entity Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier (e.g., `ant`, `dust-mote`, `shadow`) |
| `name` | string | Display name (e.g., `Formicidae Scout`, `Dust Mote`) |
| `type` | enum | `animate`, `inanimate`, or `abstract` |
| `state` | string | Current state (e.g., `foraging`, `suspended`, `expanding`) |
| `position` | object | Grid coordinates `{ x, y }` |
| `icon` | string | Emoji or symbol for grid display |
| `adjacentTo` | array | IDs of entities this one can affect or be affected by |

**Entity Types:**
- **Animate**: Living organisms with metabolism (ant, deer, mold colony)
- **Inanimate**: Physical objects without metabolism (glass, plate stack, door)
- **Abstract**: Forces, phenomena, or concepts (light, shadow, time, sound)

---

### 2. Vector

A **Vector** is a force applied to an entity. There are exactly three vectors:

| Vector | Color | Key | Meaning |
|--------|-------|-----|---------|
| **GOAL** | Gold (#ffd700) | G | Movement toward a resource, target, or desire |
| **OBSTACLE** | Red (#ff3333) | O | Encounter with a barrier, threat, or resistance |
| **SHIFT** | Cyan (#00ffff) | S | Change in state, identity, metabolism, or condition |

Vectors are not commands. They are *perturbations*. The World Jockey applies force; the system interprets.

**Keyboard Shortcuts:**
- `G` — Trigger GOAL on selected entity
- `O` — Trigger OBSTACLE on selected entity
- `S` — Trigger SHIFT on selected entity
- `Space` — Toggle autoplay
- `1-6` — Select entity by index
- `←/→` — Cycle through scenarios

---

### 3. Ripple

A **Ripple** is the output of the system—a poetic description of how the entity's state changes when a vector is applied.

**Ripple Characteristics:**
- Written from the entity's perspective (first-person phenomenology)
- Uses uncertainty language ("might", "perhaps", "as if")
- Emphasizes state change, not narrative progression
- Compressed, evocative, ambiguous
- 150-400 words typical length

**Ripple Effects:**
- Visual: concentric rings expanding from entity node
- Textual: worldtext updates with new description
- Temporal: tick counter increments
- Relational: adjacent entities may receive secondary effects

---

## The Latent Library

The **Latent Library** is a database of pre-written descriptions for each Entity × Vector combination. It is not a narrative—it is a **seed** that the system uses to generate or select Worldtext.

### Structure

```javascript
latentLibrary = {
  [scenarioId]: {
    name: "SCENARIO NAME",
    baseline: "The default description of this environment...",
    entities: [
      { id, name, type, state, position, icon, adjacentTo },
      ...
    ],
    latent: {
      [entityId]: {
        GOAL: "Description when entity pursues a goal...",
        OBSTACLE: "Description when entity encounters obstacle...",
        SHIFT: "Description when entity changes state..."
      },
      ...
    }
  }
}
```

### Canonical Scenarios

| ID | Name | Theme | Entities |
|----|------|-------|----------|
| `cupboard` | THE CUPBOARD | Domestic ecology | Ant, Dust Mote, Glass, Plates, Light, Shadow |
| `abandoned-house` | ABANDONED HOUSE | Decay and colonization | Raccoon, Mold, Ivy, Rain, Wallpaper, Door |
| `deep-forest` | DEEP FOREST | Underground networks | Mycelium, Deer, Owl, Seedling, Fallen Oak, Moonlight |
| `urban-jungle` | URBAN JUNGLE | City as ecology | Pigeon, Rat, Graffiti, Traffic Light, Puddle, Weed |

---

## Writing Worldtext

### Principles

1. **Perspective-Locked**: Every description is written from *within* the entity's perspective, not from an external observer. The ant does not "see" the cupboard—it processes chemical gradients.

2. **State-Focused**: Descriptions emphasize transformation, not narrative. No beginning, middle, end. Just: state → vector → new state.

3. **Poetic Density**: Language is compressed, evocative, ambiguous. Each sentence carries multiple meanings. Avoid explanation. Trust the reader.

4. **Chemical Cartography**: Entities perceive through their own sensory systems. The ant smells. The dust mote drifts. The shadow expands. Use sensory language appropriate to the entity.

5. **Uncertainty Markers**: Use "might", "perhaps", "as if", "it is possible that". This is speculation, not claim.

### Examples

**Ant + GOAL:**
> The Ant entity abandons the boundary cracks, navigating the ceramic topography of the plate stack. It traces an invisible chemical scent-line toward the tall glasses where a residue of dried liquid remains. Antennae process gradients. The world becomes a map of sugar probability.

**Dust Mote + OBSTACLE:**
> The Dust Mote encounters a downdraft. The convection current reverses. It spirals downward, away from the light shaft. The air becomes opposition. It settles on the rim of a glass, adhering to residual moisture. Stillness replaces motion.

**Shadow + SHIFT:**
> The Shadow deepens. As external light fades, its character changes from gray to black. It stops being the absence of light and becomes a presence. The shift is perceptual—for anyone who might observe, the shadow has become substance.

---

## Interface Specification

Build a single-page HTML application with the following components:

### 1. SCENARIO SELECT
- Dropdown menu or tab bar
- Options: THE_CUPBOARD, ABANDONED_HOUSE, DEEP_FOREST, URBAN_JUNGLE
- Changing scenario resets all state
- Keyboard: `←/→` to cycle

### 2. GRID VIEW
- Visual matrix showing entity positions
- Entities rendered as icons or highlighted nodes
- Connections between adjacent entities as faint lines
- Ripple animations radiate from active entity
- Selected entity pulses with glow effect
- Click any entity to select it

### 3. ENTITY POOL
- Vertical list of all entities in current scenario
- Each item shows: icon, name, type/state
- Selected entity is highlighted
- Clicking sets `selectedEntity`

### 4. WORLDTEXT VIEWPORT
- Large text area showing current description
- Entity names are highlighted and clickable
- Clicking an entity name selects that entity
- Updates when ripples occur
- Subtle CRT flicker effect

### 5. VECTOR CONTROLS
- Three large buttons: GOAL (gold), OBSTACLE (red), SHIFT (cyan)
- Disabled when no entity is selected
- Clicking triggers a ripple with full visual cascade
- Keyboard shortcuts: G, O, S

### 6. AUDIT LOG
- Scrolling list of timestamped events
- Format: `[TICK] Entity → Vector → Result`
- Most recent at top
- Clickable entries to replay ripple

### 7. AUTOPLAY TOGGLE
- Switch to enable/disable autonomous mode
- When on: system selects entity + vector based on `ambientBehaviors`
- Interval: 3 seconds
- Shows countdown timer
- Keyboard: Space to toggle

### 8. LATENT LIBRARY PANEL
- Shows descriptions for currently selected entity
- Updates when entity changes
- Displays GOAL, OBSTACLE, SHIFT descriptions
- Clicking a description previews it without triggering

### 9. PERFORMANCE CONTROLS (Optional)
- BPM dial for autoplay tempo
- Crossfader for transitioning between scenarios
- Effects knobs: flicker intensity, glow radius, ripple speed
- Record button to capture session

---

## Visual Design

### Colors
```css
--term-bg: #050a05;      /* Near-black green */
--term-text: #4af626;    /* CRT green */
--term-dim: #1e5c12;     /* Dim green for borders */
--term-alert: #ff3333;   /* Red for OBSTACLE */
--term-gold: #ffd700;    /* Gold for GOAL */
--term-cyan: #00ffff;    /* Cyan for SHIFT */
--grid-line: #0a1f0a;    /* Grid lines */
--grid-node: #2a6a2a;    /* Entity nodes */
```

### Typography
- Font: JetBrains Mono or Fira Code (monospace)
- Base size: 12-13px
- Line height: 1.7-1.8

### Effects
- **Scanlines**: Subtle horizontal lines across viewport
- **Flicker**: Slight opacity animation (0.97-1.0)
- **Glow**: text-shadow on highlighted elements
- **Ripple**: Concentric rings expanding from entity
- **Pulse**: Selected entity gently pulses
- **Transitions**: 0.15s on all interactive elements

### Grid Rendering
```css
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  gap: 2px;
  background: var(--grid-line);
}

.grid-cell {
  aspect-ratio: 1;
  background: var(--term-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-cell.has-entity {
  background: var(--grid-node);
  cursor: pointer;
}

.grid-cell.selected {
  animation: pulse 1s infinite;
  box-shadow: 0 0 20px var(--term-text);
}
```

---

## State Management

```javascript
// Core state
let currentScenario = 'cupboard';
let selectedEntity = null;
let tick = 0;
let isAutoplay = false;
let auditLog = [];

// Grid state
let gridState = {
  cells: [],
  entityPositions: {}
};

// Ripple state
let activeRipples = [];

// Performance state
let bpm = 20;  // ripples per minute in autoplay
let effectsIntensity = 0.5;
```

### Actions
- `selectEntity(entity)`: Set selectedEntity, update UI, highlight on grid
- `triggerRipple(vector)`: Generate ripple, update worldtext, animate grid, increment tick, log
- `changeScenario(id)`: Reset all state, load new scenario, rebuild grid
- `toggleAutoplay()`: Start/stop autonomous mode
- `setTempo(bpm)`: Adjust autoplay speed
- `recordSession()`: Start/stop session recording

---

## What This System Is

RIPPLES is a framework for:

1. **Imaginary Ecology Simulation**: Modeling nonhuman perspectives without claiming accuracy
2. **Generative Worldbuilding**: Producing speculative text from structured inputs
3. **Operative Fiction**: Fiction that responds to inputs and evolves
4. **Performance Instrument**: A tool for live performances and installations
5. **Ecological Speculation**: Asking "what if?" about entities we normally ignore
6. **World Jockeying**: Real-time manipulation of virtual ecologies as performance art

---

## What This System Is Not

- It is not accurate. It does not claim to know what entities experience.
- It is not complete. The latent library is extensible.
- It is not fixed. Every description is provisional.
- It is not a game. There are no win conditions.
- It is not a story. There is no plot.
- It is not passive. It requires an operator.

---

## Epistemic Commitment

This system is built on **epistemic humility**:

> All models are wrong. We aim to be usefully wrong.

We do not know what an ant perceives. We do not know what it is like to be a shadow. But in the act of imagining, we discover the limits of our own cognition—and that, perhaps, is useful.

The World Jockey does not claim truth. They make worlds.

---

*Let the code and prose be like water—adapting to the terrain of truth without rigid insistence. Ship from emptiness.*
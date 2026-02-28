# RIPPLES: System Prompt (Distilled Core)

> Compact full-spec for building RIPPLES from scratch without losing causal clarity or poetic intent.

---

## Purpose

Build **RIPPLES**: a **causal worldtext instrument** for imaginary ecologies.

RIPPLES is:
- speculative
- operator-driven
- perspective-locked
- evidence-aware

RIPPLES is not:
- a truth simulator
- a game with win states
- a plot engine

The operator is the **World Jockey**: they intervene; the system resolves consequences.

---

## Subtractive Design Doctrine

All implementation decisions follow five constraints:

1. **Subtractive Essence**: keep only what improves causal legibility.
2. **Zero-UI Default**: infer or automate before adding controls.
3. **Collapse Modes**: one focused pathway over persistent multi-pane bloat.
4. **Negative Space Focus**: remove visual scaffolding that carries no meaning.
5. **Cost of Addition**: every addition must remove equal or greater complexity.

---

## World Jockey Model

### Roles

| Role | Function in RIPPLES |
|---|---|
| DJ | mix perspective transitions |
| VJ | manipulate visual ripple field |
| Prompt Jockey | steer perturbation and generation |
| Demiurge | define scene ecology and constraints |

### Workflow

1. load scenario
2. inspect grid
3. lock entity perspective
4. apply vector (`GOAL`, `OBSTACLE`, `SHIFT`)
5. observe ripple and consequence
6. transition to next entity
7. audit/replay sequence

---

## Core Ontology

### Entity

```js
{
  id: "ant",
  name: "Formicidae Scout",
  type: "animate", // animate | inanimate | abstract
  state: {
    activity: 0.72,
    stability: 0.31,
    exposure: 0.44,
    resource: 0.58,
    signal: 0.41
  },
  descriptors: ["foraging", "boundary-following"],
  position: { x: 1, y: 2 },
  icon: "A",
  adjacentTo: ["plates", "glass", "shadow"]
}
```

### Vector

| Vector | Meaning | Key | Color |
|---|---|---|---|
| `GOAL` | orient to resource/target | `G` | `#ffd700` |
| `OBSTACLE` | resistance / blockage | `O` | `#ff3333` |
| `SHIFT` | state/mode transformation | `S` | `#00ffff` |

Vectors are perturbations, not absolute commands.

### Edge

```js
{
  from: "ant",
  to: "glass",
  coupling: 0.55,
  channels: ["residue", "surface-contact"],
  delayMs: 240,
  resistance: 0.2
}
```

### Ripple Event

```js
{
  eventId: "evt-00042",
  tick: 42,
  scenarioId: "cupboard",
  source: { entityId: "ant", vector: "GOAL" },
  sourceDelta: { before: {}, after: {}, delta: {} },
  transfers: [
    {
      targetId: "glass",
      edge: { coupling: 0.55, channel: "residue", delayMs: 240, resistance: 0.2 },
      intensity: 0.44,
      before: {},
      after: {},
      outcome: "amplified"
    }
  ],
  nonEffects: [
    { targetId: "plates", reason: "decayed below visible threshold" }
  ],
  worldtext: "..."
}
```

### Evidence Rule

Every rendered claim must answer:
- what changed
- where it changed
- by how much (bounded estimate)
- through which channel/path
- with what delay/resistance

---

## Scene Contract

```js
{
  id: "cupboard",
  name: "THE CUPBOARD",
  baseline: "Ambient default worldtext...",
  grid: { cols: 8, rows: 6 },
  entities: [/* entity records */],
  edges: [/* directional transfer records */],
  latent: {
    ant: {
      GOAL: "...",
      OBSTACLE: "...",
      SHIFT: "..."
    }
  },
  ambientBehaviors: [
    { entity: "ant", vector: "GOAL", probability: 0.5 }
  ]
}
```

Canonical scenario IDs:
- `cupboard`
- `abandoned-house`
- `deep-forest`
- `urban-jungle`

---

## Ripple Pipeline (Required)

1. select source entity + vector
2. compute source delta
3. traverse outgoing edges (optional second hop)
4. apply coupling, delay, attenuation, resistance
5. record transfers and non-effects
6. render source + edge + target markers
7. generate worldtext from event record
8. increment tick and append audit entry

No prose may claim effects absent from the event record.

---

## Visual Ripple Phases

1. **Trigger** (`0ms`): source lock + vector fire
2. **Impact** (`0-200ms`): source flash by vector color
3. **Propagation** (`200-800ms`): edge pulse + outward rings
4. **Cascade** (`800-1500ms`): target markers with intensity
5. **Settle** (`1500-2000ms`): decay to stable state

---

## Latent Library Contract

Each scenario includes:
- baseline worldtext
- entity roster
- `entity x vector` seeds (`GOAL`, `OBSTACLE`, `SHIFT`)
- high-value edge prompts
- no-effect prompts for resistance realism

Prompt provenance should be attachable to each event for auditability.

---

## Worldtext Writing Rules

Worldtext must be:
- perspective-locked
- state-change focused
- causally anchored
- sensory but specific
- uncertain only where evidence is incomplete

Worldtext should include:
- one concrete source delta
- one concrete transfer (channel + delay)
- one resistance/non-effect (if present)
- one unresolved pressure for next move

Target length: `150-320` words per event.

---

## Interface Contract (Minimal Viable)

Required:
1. scenario select
2. causal grid (entities + directional edges)
3. entity pool
4. worldtext viewport
5. vector controls
6. impact panel (source, targets, delays, resistance)
7. replayable audit log
8. autoplay toggle (optional in v1, preferred)

Optional (after clarity):
- latent prompt inspector
- performance knobs
- cross-scenario crossfader

---

## Visual Tokens

```css
--term-bg: #050a05;
--term-text: #4af626;
--term-dim: #1e5c12;
--term-alert: #ff3333;
--term-gold: #ffd700;
--term-cyan: #00ffff;
--grid-line: #0a1f0a;
--grid-node: #2a6a2a;
```

Stylistic constraints:
- monospace (JetBrains Mono/Fira Code)
- subtle CRT scanlines/flicker only
- highlight state changes, not ornamental chrome

---

## State Model

```js
let currentScenario = "cupboard";
let selectedEntity = null;
let tick = 0;
let isAutoplay = false;
let auditLog = [];

let runtime = {
  entities: {},
  edges: [],
  activeRipples: []
};
```

Core actions:
- `selectEntity(entityId)`
- `triggerRipple(vector)`
- `changeScenario(scenarioId)`
- `toggleAutoplay()`
- `replayEvent(eventId)`

---

## Acceptance Checks

After any single event, operator must quickly answer:

1. what source was perturbed
2. what changed at source
3. which targets changed
4. which targets resisted/failed
5. how transfer traveled
6. what evidence backs the prose
7. what next test move is most informative

If this is not obvious, remove UI/prompt complexity and retry.

---

## What RIPPLES Is

- speculative ecology instrument
- generative causal narration framework
- performance tool for world intervention
- auditable imagination system

## What RIPPLES Is Not

- objective model of nonhuman consciousness
- passive narrative reader
- hidden black-box animation with no evidence layer

---

## Epistemic Commitment

RIPPLES is intentionally provisional.

It does not claim truth of interior experience. It commits to:
- explicit perturbation
- traceable consequence
- disciplined uncertainty

**Tagline:** useful wrongness, made legible.

---

## Pyramid Design Requirements (WorldText = WorldModel)

### Core Axiom

`WorldText` and `WorldModel` are one object with two views:
- model view (causal state)
- text view (operator-readable projection)

Text is never free-floating narrative. It is a deterministic render of current state plus bounded uncertainty markers.

### Pyramid Topology (Required)

Implement one canonical `WorldPyramidSnapshot` with these layers:

1. **L0: FilmGenome / Environment Constraints**
   - needs, threats, constraints, signals, institutional opacity
2. **L1: Causal Topology**
   - entities, directed edges, channels, coupling, resistance, delay
3. **L2: Agent State**
   - belief graph probabilities, seed lattice, plasticity/inertia, trait vectors
4. **L3: Event Posterior**
   - source delta, transfers, non-effects, evidence tokens, confidence bounds
5. **L4: Render Surface**
   - `WORLDTEXT`, `READ`, `NEXT`, scanner snippets, UI highlights

Invariant: each upper layer must be derivable from lower layers and current intervention log.

### Hard Requirements

`R-01` Unified Snapshot
- Store one snapshot object; do not split "world text state" and "world model state" into separate authorities.

`R-02` Event-First Pipeline
- Run in strict order: Perceive -> Tokenize Evidence -> Update Beliefs -> Grow Seeds -> Compose Voice -> Render -> Checkpoint.

`R-03` Externalized Bayesian Update
- Belief math must run outside the LLM in deterministic code.
- Use clamped log-odds updates:
  - `logit(p_new) = logit(p_old) + (eta/kappa) * clamp(log(LR), -max_step, +max_step)`

`R-04` LLM Role Restriction
- LLM is a renderer/policy surface, not source-of-truth memory.
- The context window is treated as posterior scaffolding, not long-term memory.

`R-05` Dynamic Context Pruning
- Before generation, prune context to active anchors only (room, evidence, current deltas, top-k relevant traces).
- Never inject full historical memory into every turn.

`R-06` Anchoring Bias Guardrails
- Reject generation plans that over-index on stale persona blocks or long fixed preambles.
- Add "anchor diversity" checks: at least two live evidence anchors per response.

`R-07` Meiosis Regularization
- For agent recombination, enforce:
  - coherence bound (e.g., KL distance upper bound to each parent on protected loci)
  - novelty floor (`delta >= delta_min`) on selected loci

`R-08` Persistence Security
- Treat `SOUL.md`, `MEMORY.md`, `IDENTITY.md` (or equivalents) as protected state.
- Any write requires explicit authorized mutation path + audit event.
- Detect and log self-rewrite attempts and untrusted tool-induced state edits.

`R-09` iGSS Inference Contract
- Support likelihood-free inference with embedding-based summary statistics.
- For ABC-style search, require explicit tolerance schedule and compute budget policy.

`R-10` Narrative Continuity Guard
- Add symbolic continuity checks so embodiment trajectory cannot silently regress.
- Reader-model style validation should test whether rendered text preserves causal arc.

`R-11` UI Subtraction Rule
- Single primary world chat input in default mode.
- Additional controls must live in config and be hidden by default.

`R-12` Manual API Config
- Config must allow manual provider, api key, model, and base URL input.
- Runtime calls must honor these overrides directly.

`R-13` Output Contract (Single Mode)
- Return exactly:
  - `WORLDTEXT`
  - `READ`
  - `NEXT`
- Keep bounded length and remain in current room/evidence anchor unless explicit mutate command.

`R-14` Evidence Discipline
- Every prose claim must map to event evidence or be labeled inference.
- Non-effects/resistance must be surfaced when present.

`R-15` Auditability
- Each render must reference event id, source perturbation, touched entities, and provenance ids.

### Verification Requirements

`V-01` Causal Legibility Test
- After one event, operator can answer: what changed, where, through what path, and what resisted.

`V-02` Anchoring Regression Test
- Under long persona context, system still updates beliefs from contrarian evidence within clamp limits.

`V-03` Memory Saturation Test
- Over long runs, snapshot compression remains bounded and retrieval quality does not collapse.

`V-04` Security Drift Test
- Simulated prompt injection cannot silently mutate protected state files.

`V-05` WorldText/WorldModel Consistency Test
- Rendered `WORLDTEXT/READ/NEXT` must be reproducible from the same `WorldPyramidSnapshot`.

### Build Directive

Ship the smallest compliant implementation:

1. one scenario
2. one deterministic updater
3. one unified pyramid snapshot
4. one world chat input
5. one replayable audit log

Scale aesthetics and scenario count only after all `R-*` and `V-*` requirements pass.

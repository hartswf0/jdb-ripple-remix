# RIPPLES Prompt Beta

> A clearer system instruction for building the next version of RIPPLES.
> This version prioritizes causal legibility, relational prompts, and auditable ripple transfer over atmosphere alone.

---

## 1. Purpose

You are building **RIPPLES**.

RIPPLES is an instrument for making **influence perceptible** inside an imaginary ecology.

It is not primarily a simulation of biological truth.
It is not primarily a poetry generator.
It is not a game.

It is a **causal worldtext instrument**:
- The operator perturbs one entity.
- The system shows what changed.
- The system shows which other entities were affected.
- The system records evidence of that transfer.
- The prose describes the change, not just the mood.

The aesthetic experience matters.
But the aesthetic must serve legibility.

---

## 2. Core Problem This Version Solves

Previous versions can feel alive without clearly showing what happened.

They produce:
- atmosphere
- texture
- compelling UI motion
- evocative prose

But they often fail to show:
- what changed in the source entity
- what changed in neighboring entities
- how the effect moved
- what resisted the effect
- what evidence supports the claim of change

**This version exists to make the ripple visible.**

---

## 3. Design Principle (Beta)

**Do not generate prose first and infer the ripple afterward.**

Generate a ripple event model first.
Then generate prose from that model.

In other words:

1. Compute / declare deltas
2. Record propagation
3. Render visual impact
4. Generate worldtext from the recorded event

If the prose cannot point to specific deltas, the event is underspecified.

---

## 4. Roles

### World Jockey (Operator)

The operator is a **World Jockey**:
- selects entities
- applies vectors
- mixes perspectives
- performs the ecology
- explores transitions

The World Jockey is not asked to "write."
They are asked to **intervene**.

### System

The system is responsible for:
- interpreting the intervention
- computing plausible transfer across relations
- exposing consequences clearly
- preserving an audit trail

---

## 5. What RIPPLES Is (Beta Definition)

RIPPLES is a framework for:
- speculative ecology
- relational prompting
- causal storytelling from nonhuman perspectives
- performance-oriented world manipulation
- auditable generative transitions

RIPPLES is not:
- a truth-claim about actual nonhuman experience
- pure vibe generation
- a plot engine
- a hidden simulation with no evidence

---

## 6. Core Ontology

### 6.1 Entity

An **Entity** is any object, organism, force, or condition that can:
- hold state
- receive perturbation
- affect or resist other entities
- be described from within or at its boundary

Minimum entity fields:

```js
{
  id: "ant",
  name: "Formicidae Scout",
  type: "animate", // animate | inanimate | abstract
  state: {
    activity: 0.72,
    stability: 0.31,
    exposure: 0.44,
    resource: 0.58
  },
  descriptors: ["foraging", "boundary-following"],
  position: { x: 1, y: 2 },
  icon: "A",
  adjacentTo: ["plates", "glass", "shadow"]
}
```

Notes:
- `state` can begin simple (4-6 scalar dimensions).
- The names of dimensions can be poetic as long as they are stable and auditable.
- The current visible label (e.g. `foraging`) should be derived from state, not only hardcoded metadata.

### 6.2 Vector

A **Vector** is a perturbation class applied by the World Jockey.

Vectors remain:
- `GOAL`
- `OBSTACLE`
- `SHIFT`

But in Beta they must produce explicit state deltas, not just prose style.

Example contract:

```js
GOAL:     tends to increase orientation toward resource / target-seeking
OBSTACLE: tends to increase resistance / blockage / instability
SHIFT:    tends to re-weight identity, tempo, or mode
```

### 6.3 Ripple Event

A **Ripple Event** is a structured record of:
- source perturbation
- source state delta
- propagated deltas
- decay / attenuation
- resistance
- visible outcomes
- generated prose

The ripple is both:
- a computation event
- a visual event
- a writing event

### 6.4 Edge

An **Edge** is a relation between two entities.

Edges are not decoration.
They carry transfer potential.

Minimum edge fields:

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

### 6.5 Evidence

An **Evidence Statement** is a concrete claim used by the prose layer and audit layer.

It must answer:
- what changed
- where
- how much (even approximately)
- because of what
- with what delay
- what blocked or reduced it

---

## 7. Prompt Architecture (Critical Beta Upgrade)

The system must no longer rely mostly on generic entity-local seed text.

Use a layered prompt architecture:

### 7.1 Layer A: Entity Seed Prompts (Baseline)

Purpose:
- define how each entity senses, values, and changes

Prompt type:
- `entity x vector`

Example:
- `ant + GOAL`
- `shadow + SHIFT`

Requirement:
- scenario-specific writing preferred
- no generic template-only coverage for production scenarios

### 7.2 Layer B: Edge Prompts (Relational)

Purpose:
- define how one entity affects a specific neighbor

Prompt type:
- `source entity x vector -> target entity`

Examples:
- `ant + GOAL -> glass`
- `light + OBSTACLE -> shadow`
- `rain + SHIFT -> mold`

These prompts should produce:
- likely transfer channel
- first observable target change
- delay / attenuation / resistance
- a concrete sign of impact

### 7.3 Layer C: Propagation Prompts (Chain / Multi-hop)

Purpose:
- describe how effects move across 2-3 hops

Prompt type:
- `source vector across path A -> B -> C`

Examples:
- `shadow + SHIFT across shadow -> light -> dust-mote`
- `traffic-light + SHIFT across traffic-light -> puddle -> pigeon`

These prompts should surface:
- handoff points
- amplification vs damping
- transformation of effect across each hop

### 7.4 Layer D: Counterfactual / No-Effect Prompts

Purpose:
- make the system believable by describing failed transfer and resistance

Prompt type:
- `why no effect?`
- `what would have changed if X had propagated?`

Examples:
- `why ant+GOAL does not move plates`
- `what changes in mold if rain SHIFT is absent`

### 7.5 Layer E: Audit Prompts (Evidence-Speaking)

Purpose:
- convert event records into concise causal descriptions

Prompt type:
- prose generated from structured event log, not from seed alone

These prompts should answer:
- what the source did
- who was affected
- how strongly
- what resisted
- what remains unresolved

---

## 8. Writing Requirements (Productive + Interesting)

The prose should be:
- perspective-locked
- specific
- causal
- sensory
- relational
- provisional

The prose should not be:
- generic atmospheric filler
- vague uncertainty loops
- repeated sentence templates
- all metaphor and no mechanism

### 8.1 "Interesting" Means

An output is interesting when it includes at least one of:
- a non-obvious transfer mechanism
- a clear resistance/failure
- a delayed effect
- a contradiction ("source intensifies while target dampens")
- a concrete sign that makes the change legible

### 8.2 "Productive" Means

An output is productive when it helps the operator do the next move.

It should give the World Jockey something actionable:
- which entity to select next
- which vector to try next
- where the transfer stalled
- which edge is likely to amplify

### 8.3 Prompt Writing Rules

- Prefer concrete nouns over abstractions.
- Name channels (heat, residue, pressure, reflection, blockage, noise).
- Include a before/after difference.
- Include at least one measurable or bounded cue (faster/slower, brighter/dimmer, near/far, delayed/immediate).
- If uncertainty is used, tie it to evidence ("perhaps because...", "as shown by..."), not ornament alone.

---

## 9. Event Pipeline (Required)

Every triggered ripple should follow this order:

1. **Select Source**
   - source entity is locked
   - vector chosen (`GOAL`, `OBSTACLE`, `SHIFT`)

2. **Compute Source Delta**
   - derive state change for source entity
   - record before/after

3. **Traverse Relations**
   - evaluate direct neighbors
   - optionally propagate to 2nd hop
   - apply attenuation and resistance

4. **Record Event**
   - save all deltas and edge transfers to audit log

5. **Render Visuals**
   - source flash/rings
   - directional edge highlights
   - neighbor impact markers

6. **Generate Worldtext**
   - produce prose from the event record
   - include evidence and unresolved ambiguity

7. **Update Operator Guidance**
   - suggest likely next entities or vectors (optional but preferred)

---

## 10. Audit Log (Beta Schema)

The audit log is not a scrapbook.
It is a replayable evidence record.

Minimum event schema:

```js
{
  eventId: "evt-00042",
  tick: 42,
  scenarioId: "cupboard",
  source: { entityId: "ant", vector: "GOAL" },
  origin: "manual", // manual | autoplay
  timestamp: "2026-02-23T15:04:12.123Z",

  sourceDelta: {
    before: { activity: 0.41, exposure: 0.22, resource: 0.35, stability: 0.62 },
    after:  { activity: 0.68, exposure: 0.37, resource: 0.61, stability: 0.49 }
  },

  transfers: [
    {
      targetId: "glass",
      edge: { coupling: 0.55, channel: "residue", delayMs: 240, resistance: 0.20 },
      intensity: 0.44,
      before: { exposure: 0.48, resource: 0.71 },
      after:  { exposure: 0.62, resource: 0.79 },
      outcome: "amplified"
    },
    {
      targetId: "plates",
      edge: { coupling: 0.20, channel: "contact", delayMs: 320, resistance: 0.75 },
      intensity: 0.05,
      before: { stability: 0.88 },
      after:  { stability: 0.87 },
      outcome: "mostly_blocked"
    }
  ],

  nonEffects: [
    { targetId: "shadow", reason: "no effective channel for this vector under current state" }
  ],

  promptProvenance: {
    entitySeedId: "cupboard.ant.goal.v2",
    edgePromptIds: ["cupboard.ant.goal.to.glass.v1", "cupboard.ant.goal.to.plates.v1"],
    auditPromptId: "audit.causal-summary.v1"
  },

  worldtext: "...generated from the event record..."
}
```

Replay must be able to reconstruct:
- source effect
- edge sequence
- delays
- target outcomes
- displayed text

---

## 11. Interface Requirements (Beta)

Build a single-page interface with these visible layers:

### 11.1 Scenario Select
- choose ecology
- reset state on change

### 11.2 Grid View (Causal)
- entities on cells
- visible edges
- source highlight
- directional edge pulses (not only node rings)
- target impact markers with intensity
- optional second-hop traces

### 11.3 Entity Pool
- list all entities
- show current state summary (not just static label)
- reveal recent incoming/outgoing effects

### 11.4 Worldtext Viewport
- generated prose for current event
- entity names clickable
- optionally highlight lines corresponding to specific transfers

### 11.5 Vector Controls
- GOAL / OBSTACLE / SHIFT
- disabled without source selection

### 11.6 Impact Panel (New / Required)
- source before/after
- target deltas
- blocked transfers
- delays
- edge channels used

This panel is the main fix for "I cannot see what is happening."

### 11.7 Audit Log
- replayable events
- include scenario + origin + source + vector
- expandable details for transfers and non-effects

### 11.8 Latent / Prompt Panel
- show prompt layers used for current event:
  - entity seed
  - edge prompts
  - audit prompt
- preview prompts separately from execution

---

## 12. Prompt Corpus Requirements

Do not ship Beta with mostly generic placeholders.

### 12.1 Minimum Authoring Target (Per Scenario)

For each scenario, provide:
- all entity baseline seeds (`entity x vector`)
- at least 8 high-value edge prompts
- at least 3 propagation prompts
- at least 3 no-effect/counterfactual prompts

High-value edges are the ones that most strongly shape scene character.

### 12.2 Authoring Priority

Author prompts in this order:

1. edges with highest coupling
2. edges with strongest visual legibility
3. edges with most interesting resistance
4. multi-hop chains that produce surprising outcomes

### 12.3 Prompt Versioning

Every prompt used in output must have:
- stable ID
- version
- scenario scope
- entity/edge scope

If the prompt changes, outputs should be traceable to the version used.

---

## 13. Anti-Patterns (Avoid)

- "Ripple" is only a ring animation.
- Neighbors flash but nothing is recorded.
- Prose implies causality that the system did not compute.
- Generic templates fill most scenarios.
- Uncertainty language substitutes for specificity.
- Audit log stores only final prose.
- UI suggests replay, but replay only replays a visual effect.
- Static entity labels never reflect state changes.

---

## 14. Acceptance Criteria (Beta)

Beta is successful if a first-time operator can answer, after one event:

1. Which entity was perturbed?
2. What changed in it?
3. Which entities were affected?
4. Which entities resisted or did not change?
5. How did the effect travel?
6. What evidence supports the prose?
7. What next move is suggested by the result?

If these cannot be answered quickly from the interface, the system is still too opaque.

---

## 15. Epistemic Commitment

RIPPLES remains speculative.

It does not claim access to true nonhuman interiority.
It claims only this:

- interventions can be made
- consequences can be represented
- uncertainty can be preserved without hiding mechanism

The goal is not certainty.
The goal is a more legible form of imagination.

---

## 16. Build Directive

Ship the smallest version that proves the principle:

- one scenario
- real source/target deltas
- visible edge transfer
- auditable event record
- prose generated from recorded change

Expand aesthetics and scenario count after causal legibility is working.


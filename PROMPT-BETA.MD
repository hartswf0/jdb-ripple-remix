# RIPPLES Prompt Beta (Distilled)

> Version focus: causal legibility, perspective integrity, and audit-ready outputs with minimal interface and minimal prompt bloat.

---

## 1. Core Purpose

Build **RIPPLES** as a **causal worldtext instrument**.

RIPPLES must:
- accept a perturbation on one entity
- compute and record what changed
- show where transfer propagated or failed
- generate prose from that record
- leave an auditable trail for replay

RIPPLES is not a vibe generator, plot engine, or truth-claim simulator.

---

## 2. Subtractive Doctrine (NSDS Core)

Use these constraints for all prompt and interface decisions:

1. **Subtractive Essence**
   - Keep only elements that help operators see cause and consequence.
2. **Zero-UI Default**
   - Infer and automate before adding controls.
3. **Collapse Modes**
   - Prefer one focused path over persistent split tooling.
4. **Negative Space Focus**
   - Remove containers, labels, and lines that do not increase legibility.
5. **Cost of Addition**
   - Every addition must remove equal or greater complexity.

---

## 3. Non-Negotiable Principle

**Event first, prose second.**

Never write atmosphere and reverse-justify causality.

Required order:
1. compute source delta
2. compute transfers and resistance
3. record event
4. render visual impact
5. generate worldtext from recorded event

---

## 4. Core Ontology

### 4.1 Entity

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
  adjacentTo: ["plates", "glass", "shadow"]
}
```

### 4.2 Vector

- `GOAL`: orient toward resource/target
- `OBSTACLE`: increase resistance/blockage
- `SHIFT`: reweight identity/tempo/mode

Vectors are perturbation classes, not deterministic commands.

### 4.3 Edge

```js
{
  from: "ant",
  to: "glass",
  coupling: 0.55,
  channels: ["residue", "surface-contact"],
  delayMs: 240,
  resistance: 0.20
}
```

### 4.4 Ripple Event

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
      edge: { channel: "residue", coupling: 0.55, delayMs: 240, resistance: 0.20 },
      intensity: 0.44,
      before: {},
      after: {},
      outcome: "amplified"
    }
  ],
  nonEffects: [
    { targetId: "plates", reason: "transfer decayed below visible threshold" }
  ],
  promptProvenance: {
    entitySeedId: "cupboard.ant.goal.v2",
    edgePromptIds: ["cupboard.ant.goal.to.glass.v1"],
    auditPromptId: "audit.causal-summary.v1"
  },
  worldtext: "..."
}
```

### 4.5 Evidence Statement

Every claim in text or UI must answer:
- what changed
- where it changed
- by how much (bounded estimate is acceptable)
- because of what path/channel
- with what delay or resistance

---

## 5. Prompt Layer Stack (Lean)

Use five layers only:

1. **Entity Seed** (`entity x vector`)
   - baseline sensory and behavioral change pattern.
2. **Edge Prompt** (`source x vector -> target`)
   - channel, delay, resistance, first target sign.
3. **Propagation Prompt** (`A -> B -> C`)
   - handoff, amplification/damping across hops.
4. **No-Effect Prompt**
   - explains blocked or negligible transfer.
5. **Audit Prompt**
   - converts event record into concise causal prose.

Do not ship with placeholder-heavy generic prompt sets.

---

## 6. Event Pipeline (Required)

1. lock source entity and vector
2. compute source state delta
3. evaluate direct neighbors (optional second hop)
4. apply attenuation/resistance
5. record source + transfer + non-effect evidence
6. render source/edge/target visual markers
7. generate worldtext from event record
8. suggest next operator move (optional, preferred)

---

## 7. Writing Contract

Worldtext must be:
- perspective-locked
- causally explicit
- sensory and specific
- relational (include at least one transfer)
- provisional (uncertainty tied to evidence limits)

Worldtext must not be:
- mood-only filler
- mechanism-free metaphor
- contradiction-free smoothing
- fabricated effects outside event record

Definition of useful output:
- explains source change
- names at least one transfer channel
- includes one resistance/non-effect when present
- leaves one unresolved pressure for next move

---

## 8. Output Contract (Recommended)

Use these sections:

1. `EVENT_ANCHOR`
2. `TRANSFER_MAP`
3. `NON_EFFECTS`
4. `PERSPECTIVE_WORLDTEXT` (150-320 words)
5. `OPERATOR_NEXT_MOVES` (3 testable moves)
6. `MISSING_EVIDENCE`

---

## 9. Minimal Interface Contract

Required visible layers:
- scenario select
- causal grid (nodes + directed edges)
- entity pool
- worldtext viewport
- vector controls
- impact panel (source/targets/resistance/delay)
- replayable audit log

Optional only after clarity is solved:
- latent prompt panel
- performance knobs
- expanded multi-hop visuals

---

## 10. Anti-Patterns

- ring animation with no recorded transfer
- prose claims with no event evidence
- replay UI that cannot replay deltas
- static entity labels that ignore current state
- uncertainty language used as a mechanism substitute

---

## 11. Acceptance Test

After one event, a first-time operator must answer quickly:

1. which entity was perturbed
2. what changed in it
3. who was affected
4. who resisted or did not change
5. how the effect traveled
6. what evidence supports the prose
7. what next move is most informative

If these answers are not obvious, remove complexity until they are.

---

## 12. Build Directive

Ship the smallest proof of principle:
- one scenario
- real source and target deltas
- visible directional transfer
- auditable event record
- prose derived from that record

Scale scenarios and aesthetics only after causal legibility is stable.

---

## 13. Epistemic Commitment

RIPPLES is speculative by design.

It does not claim true access to nonhuman interiority. It commits to:
- explicit interventions
- traceable consequences
- preserved uncertainty without hidden mechanism

**Goal:** a legible form of imagination.

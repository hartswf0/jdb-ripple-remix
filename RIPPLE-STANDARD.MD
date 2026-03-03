# RIPPLES Runtime Constitution (RRC-1)

## Why this exists
Current branches solve parts of the problem, but each line encodes policy differently.  
RRC-1 defines one **portable specification** that all engine variants must execute.

This is the shift:
- from "different files with different behavior"
- to "one constitutional runtime contract, multiple UI skins"

## Core Principle
**The specification is a prompt-compiler and policy-engine, not a document.**  
The engine reads RRC-1 and derives:
1. Prompt constraints
2. Auto decision policy
3. Recording behavior
4. Quality thresholds
5. Branch lifecycle status

---

## 1. Canonical Line Registry
Every line declares status and intent.

- `core`: production baseline
- `staging`: candidate for merge
- `experimental`: rapid divergence allowed
- `frozen`: reference only

Required fields:
- `line_id`
- `status`
- `inherits_from`
- `last_parity_check`
- `owner`

---

## 2. Prompt Contract (Pass-1 Worldtext)
All lines must compile generation from the same contract:

- Tagged output only: `[FRAGMENT]`, optional/required `[SPAWN]`, optional `[TAG]`
- Fragment count range
- Therefore requirement policy
- Spawn requirement policy by mode
- Thematic anchor policy (root seed continuity)

This removes branch-specific drift in model behavior.

---

## 3. Auto Policy Contract
Modes are canonical:
- `MANUAL`
- `FULL_AUTO`
- `SEMI_AUTO`

Each cycle chooses one action from:
- `continue`
- `branch`
- `tag_mutate`
- `vector_jump`

Selection is weighted and bounded by:
- min/max spawn cadence
- depth guard
- repetition guard
- anchor-distance guard

---

## 4. Quality Gate Contract
Every run is scored with explicit thresholds.

Minimum required metrics:
- `spawn_rate` (spawns per N steps)
- `continuity_score` (semantic relation to root seed)
- `repetition_index` (duplicate/near-duplicate fragment pressure)
- `vector_utilization` (how often therefore-jumps are consumed)
- `tag_balance` (OBSTACLE/GOAL/SHIFT distribution)

A run is "valid" only if all core thresholds pass.

---

## 5. Recording Contract
Recording is standardized across lines:
- `SCENE` (canvas only)
- `CONTEXT` (map + chat + overlays)
- `first_prompt_record` behavior
- transcript + event log export is mandatory
- recording manifest per take is mandatory

---

## 6. Parity Contract
A branch can ship only if it passes parity checks for:
- control vocabulary (mode, focus, import/export, record)
- camera behavior (focus lock, recenter, auto-follow)
- parser behavior (atomic line handling)
- import/export roundtrip integrity

---

## 7. Promotion Contract
`staging -> core` requires:
1. parity pass
2. quality-gate pass on benchmark runs
3. recording pass (video + transcript + manifest)
4. operator review note

Without this, branch remains `staging` or `experimental`.

---

## RRC-1 Minimal Manifest Example
```json
{
  "version": "RRC-1",
  "line_registry": {
    "ripple-engine": { "status": "core", "inherits_from": null },
    "r-eng-02": { "status": "staging", "inherits_from": "ripple-engine" },
    "rp-02": { "status": "experimental", "inherits_from": "ripple-engine" },
    "rp-03": { "status": "experimental", "inherits_from": "ripple-engine" },
    "rp-04": { "status": "frozen", "inherits_from": "rp-02" }
  },
  "prompt_contract": {
    "tagged_only": true,
    "fragments": { "min": 3, "max": 4 },
    "therefore_required_in_auto": true,
    "spawn_policy": {
      "manual": "optional",
      "full_auto": "required_min_1",
      "semi_auto": "required_on_selected_jump"
    }
  },
  "auto_policy": {
    "weights": { "continue": 0.36, "branch": 0.24, "tag_mutate": 0.20, "vector_jump": 0.20 },
    "guards": {
      "max_consecutive_continue": 3,
      "min_spawn_per_8_steps": 2,
      "max_repetition_index": 0.22
    }
  },
  "quality_gates": {
    "spawn_rate": { "min": 0.20, "max": 0.55 },
    "continuity_score": { "min": 0.62 },
    "repetition_index": { "max": 0.22 },
    "vector_utilization": { "min": 0.25 },
    "tag_balance_entropy": { "min": 0.80 }
  },
  "recording_contract": {
    "modes": ["SCENE", "CONTEXT"],
    "first_prompt_record": true,
    "must_export": ["video", "transcript", "event_manifest"]
  }
}
```

---

## What this changes immediately
1. Branches stop being ambiguous identities and become declared lifecycle states.  
2. Prompt behavior becomes comparable across all lines.  
3. Auto mode becomes measurable, not aesthetic guesswork.  
4. Recording outputs become conference-reliable artifacts.

---

## First implementation steps
1. Add `rrc-1.json` as runtime config source.
2. Refactor each line to read mode/prompt/quality from config.
3. Add a post-run scorer that writes `run_report.json`.
4. Expose status badges in `index.html` from line registry.


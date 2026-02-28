# PROMPT-OM-STRUCTURAL.MD

## Purpose

Define a high-rigor prompt architecture for:

1. Structural Analysis of Evolutionary LLM Agent Architectures
2. Inverse Generative Simulation (iGSS) reasoning
3. Operationally actionable diagnostics from theory corpus + event evidence

This mode is implemented in `moss-om-reality-warper.html` as `structural_igss`.

---

## Core Contract

The model must output exactly these top-level headings:

1. `NON_OBVIOUS_INSIGHTS`
2. `TENSIONS_CONTRADICTIONS`
3. `SO_WHAT`
4. `WHATS_MISSING`

No heading substitution.

---

## Section Grammar

### 1) NON_OBVIOUS_INSIGHTS

- Exactly 4 insights.
- Each insight must include:
  - `Claim`
  - `Mechanism`
  - `Why non-obvious`
  - `Operational implication`

### 2) TENSIONS_CONTRADICTIONS

- Exactly 3 tensions.
- Each tension must include:
  - `Paradox`
  - `Failure mode`
  - `Mitigation path`

### 3) SO_WHAT

- Must include one `Core Implication`.
- Must include at least 3 domains of application.
- Each domain must include concrete operational impact.

### 4) WHATS_MISSING

- Must include:
  - `Missing Question`
  - `Critical Assumption`
  - `Next Inquiry`
- `Next Inquiry` must be empirically testable.

---

## Evidence Policy

- Distinguish observed evidence vs inference.
- If evidence is missing, explicitly say so.
- At least one security argument is required.
  - Example class: persistent memory / epigenetic hijacking.
- At least one inference argument is required.
  - Example class: ABC tolerance, synthetic likelihood, density-ratio, embedding statistics.

---

## Mathematical Rigor Policy

At least one of the following must appear when relevant:

- log-odds belief update rule
- KL coherence / novelty constraints for meiosis
- ABC acceptance/tolerance criterion
- sensitivity or identifiability caveat

The model should use equations or pseudo-equations when they sharpen mechanism clarity.

---

## Prompt Stack (Recommended)

1. `SYSTEM_LAYER`: enforce section grammar and evidence discipline
2. `THEORY_LAYER`: provide long-form structural corpus
3. `EVENT_LAYER`: include live causal event JSON when available
4. `CONSTRAINT_LAYER`: fixed output headings and required counts
5. `OPS_LAYER`: force operational implications and testable next inquiry

---

## Demo Workflow (OM UI)

1. Open `moss-om-reality-warper.html`
2. Toggle console (`R`)
3. In LLM Workbench:
   - Mode: `Structural iGSS Analysis`
   - Click `DEMO THEORY` (or paste your own corpus)
4. Optionally trigger a ripple event (BANG/HALT/MOD) to add live event context
5. Click `BUILD`
6. Copy `BUNDLE` and run with your model endpoint

---

## Anti-Patterns

- Mood-only summary with no mechanism
- Security warnings without attack path
- Formula dumping with no operational consequence
- Generic recommendations not tied to extracted structure

---

## Acceptance Test

A valid output lets an operator answer, quickly:

1. What 4 non-obvious structural insights actually matter?
2. What 3 paradoxes can break the architecture first?
3. What decisions change now because of this analysis?
4. What exact question and experiment should run next?

If not, the prompt is under-specified and must be tightened.

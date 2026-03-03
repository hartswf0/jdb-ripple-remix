(function () {
  "use strict";

  const STOP = new Set([
    "the", "a", "an", "and", "or", "but", "if", "to", "of", "in", "on",
    "at", "for", "with", "as", "is", "are", "was", "were", "be", "been",
    "this", "that", "these", "those", "it", "its", "from", "by", "into",
    "through", "near", "over", "under", "therefore"
  ]);

  const FALLBACK = {
    version: "RRC-1-FALLBACK",
    line_registry: {},
    prompt_contract: {
      tagged_only: true,
      fragments: { min: 3, max: 4 },
      therefore_required_in_auto: true,
      spawn_policy: {
        manual: "optional",
        full_auto: "required_min_1",
        semi_auto: "required_on_selected_jump"
      }
    },
    auto_policy: {
      weights: { continue: 0.36, branch: 0.24, tag_mutate: 0.2, vector_jump: 0.2 },
      guards: { max_consecutive_continue: 3, min_spawn_per_8_steps: 2, max_repetition_index: 0.22 }
    },
    quality_gates: {
      spawn_rate: { min: 0.2, max: 0.55 },
      continuity_score: { min: 0.62 },
      repetition_index: { max: 0.22 },
      vector_utilization: { min: 0.25 },
      tag_balance_entropy: { min: 0.8 }
    },
    recording_contract: {
      modes: ["SCENE", "CONTEXT"],
      first_prompt_record: true,
      must_export: ["video", "transcript", "event_manifest"]
    }
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function clamp01(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return 0;
    return Math.max(0, Math.min(1, v));
  }

  function tokenize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !STOP.has(t));
  }

  function normalizedWeights(raw) {
    const base = {
      continue: Number(raw?.continue || 0),
      branch: Number(raw?.branch || 0),
      tag_mutate: Number(raw?.tag_mutate || 0),
      vector_jump: Number(raw?.vector_jump || 0)
    };
    const sum = base.continue + base.branch + base.tag_mutate + base.vector_jump;
    if (!Number.isFinite(sum) || sum <= 0) {
      return { continue: 0.36, branch: 0.24, tag_mutate: 0.2, vector_jump: 0.2 };
    }
    return {
      continue: base.continue / sum,
      branch: base.branch / sum,
      tag_mutate: base.tag_mutate / sum,
      vector_jump: base.vector_jump / sum
    };
  }

  function pickWeighted(weights) {
    const entries = [
      ["continue", weights.continue],
      ["branch", weights.branch],
      ["tag_mutate", weights.tag_mutate],
      ["vector_jump", weights.vector_jump]
    ];
    let roll = Math.random();
    for (const [name, w] of entries) {
      roll -= w;
      if (roll <= 0) return name;
    }
    return "continue";
  }

  function applyActionGuards(action, context, guards) {
    const c = context || {};
    const g = guards || {};
    const maxConsecutive = Number(g.max_consecutive_continue || 0);

    if (action === "continue" && Number(c.consecutiveContinue || 0) >= maxConsecutive && maxConsecutive > 0) {
      if (c.canBranch) return "branch";
      if (c.canVectorJump) return "vector_jump";
      if (c.canTagMutate) return "tag_mutate";
    }

    if (action === "vector_jump" && !c.canVectorJump) {
      return c.canBranch ? "branch" : "continue";
    }
    if (action === "branch" && !c.canBranch) {
      return c.canVectorJump ? "vector_jump" : "continue";
    }
    if (action === "tag_mutate" && !c.canTagMutate) {
      return c.canBranch ? "branch" : "continue";
    }
    return action;
  }

  function shannonEntropy(parts) {
    const values = Object.values(parts).filter((n) => n > 0);
    if (!values.length) return 0;
    const total = values.reduce((a, b) => a + b, 0);
    let h = 0;
    for (const v of values) {
      const p = v / total;
      h -= p * Math.log2(p);
    }
    const maxH = Math.log2(values.length || 1);
    if (!Number.isFinite(maxH) || maxH <= 0) return 0;
    return clamp01(h / maxH);
  }

  async function loadConfig(url = "rrc-1.json") {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const parsed = await res.json();
      return { ...clone(FALLBACK), ...parsed };
    } catch (_) {
      return clone(FALLBACK);
    }
  }

  function getLineSpec(config, lineId) {
    return config?.line_registry?.[lineId] || null;
  }

  function createTracker(lineId, config) {
    return {
      version: config?.version || "RRC-1",
      lineId,
      startedAt: new Date().toISOString(),
      endedAt: null,
      rootSeed: "",
      rootTokens: new Set(),
      actions: {
        continue: 0,
        branch: 0,
        tag_mutate: 0,
        vector_jump: 0
      },
      counts: {
        autoSteps: 0,
        fragments: 0,
        spawns: 0,
        vectorsUsed: 0,
        tags: { OBSTACLE: 0, GOAL: 0, SHIFT: 0 }
      },
      repetition: { total: 0, duplicate: 0, seen: new Set() },
      continuity: { hits: 0, total: 0 },
      stepWindow: [],
      state: { consecutiveContinue: 0 },
      events: []
    };
  }

  function setRootSeed(tracker, text) {
    if (!tracker || tracker.rootSeed) return;
    const seed = String(text || "").trim();
    if (!seed) return;
    tracker.rootSeed = seed;
    tracker.rootTokens = new Set(tokenize(seed));
  }

  function recordAction(tracker, action) {
    if (!tracker || !action || !tracker.actions[action]) return;
    tracker.actions[action] += 1;
    tracker.counts.autoSteps += 1;
    if (action === "continue") {
      tracker.state.consecutiveContinue += 1;
    } else {
      tracker.state.consecutiveContinue = 0;
    }
  }

  function recordFragment(tracker, text) {
    if (!tracker) return;
    const line = String(text || "").trim().toLowerCase();
    if (!line) return;
    tracker.counts.fragments += 1;
    tracker.repetition.total += 1;
    if (tracker.repetition.seen.has(line)) {
      tracker.repetition.duplicate += 1;
    } else {
      tracker.repetition.seen.add(line);
    }
    const words = tokenize(line);
    if (!words.length) return;
    let hit = false;
    for (const w of words) {
      if (tracker.rootTokens.has(w)) {
        hit = true;
        break;
      }
    }
    tracker.continuity.total += 1;
    if (hit) tracker.continuity.hits += 1;
  }

  function recordSpawn(tracker) {
    if (!tracker) return;
    tracker.counts.spawns += 1;
    tracker.stepWindow.push(1);
    if (tracker.stepWindow.length > 8) tracker.stepWindow.shift();
  }

  function recordVectorUse(tracker) {
    if (!tracker) return;
    tracker.counts.vectorsUsed += 1;
  }

  function recordTagMutation(tracker, tag) {
    if (!tracker) return;
    const t = String(tag || "").toUpperCase();
    if (tracker.counts.tags[t] != null) {
      tracker.counts.tags[t] += 1;
    }
  }

  function recordEvent(tracker, type, text, meta) {
    if (!tracker) return;
    tracker.events.push({
      at: new Date().toISOString(),
      type: String(type || "sys"),
      text: String(text || ""),
      ...(meta || {})
    });
    if (tracker.events.length > 1000) {
      tracker.events = tracker.events.slice(-1000);
    }
  }

  function chooseAutoAction(config, tracker, context) {
    const weights = normalizedWeights(config?.auto_policy?.weights || FALLBACK.auto_policy.weights);
    const guards = config?.auto_policy?.guards || FALLBACK.auto_policy.guards;
    const ctx = {
      consecutiveContinue: Number(tracker?.state?.consecutiveContinue || 0),
      canVectorJump: Boolean(context?.canVectorJump),
      canBranch: Boolean(context?.canBranch),
      canTagMutate: context?.canTagMutate !== false
    };

    const recentSpawns = Number(tracker?.stepWindow?.reduce((a, b) => a + b, 0) || 0);
    const minSpawnPer8 = Number(guards.min_spawn_per_8_steps || 0);
    if (minSpawnPer8 > 0 && (tracker?.counts?.autoSteps || 0) >= 8 && recentSpawns < minSpawnPer8) {
      return ctx.canBranch ? "branch" : "continue";
    }

    let action = pickWeighted(weights);
    const repIdx = tracker?.repetition?.total
      ? tracker.repetition.duplicate / tracker.repetition.total
      : 0;
    const repMax = Number(guards.max_repetition_index || 1);
    if (action === "continue" && repIdx > repMax) {
      action = ctx.canBranch ? "branch" : (ctx.canVectorJump ? "vector_jump" : "tag_mutate");
    }
    return applyActionGuards(action, ctx, guards);
  }

  function collectParitySnapshot(doc) {
    const d = doc || (typeof document !== "undefined" ? document : null);
    const w = typeof window !== "undefined" ? window : {};
    if (!d) {
      return {
        control_vocabulary: false,
        camera_focus: false,
        atomic_parser: false,
        import_export_roundtrip: false
      };
    }
    return {
      control_vocabulary: Boolean(d.getElementById("btn-run-mode") && d.getElementById("btn-focus") && d.getElementById("btn-import") && d.getElementById("btn-export")),
      camera_focus: typeof w.recenterView === "function" && typeof w.focusCameraOnLayer === "function",
      atomic_parser: typeof w.splitAtomicLines === "function",
      import_export_roundtrip: typeof w.exportTopography === "function" && typeof w.importTopographyFile === "function"
    };
  }

  function finalizeRun(tracker, config, paritySnapshot = null) {
    const gates = config?.quality_gates || FALLBACK.quality_gates;
    const requiredParity = config?.parity_contract?.required_checks || [];
    tracker.endedAt = new Date().toISOString();

    const autoSteps = Math.max(1, Number(tracker.counts.autoSteps || 0));
    const spawnRate = Number(tracker.counts.spawns || 0) / autoSteps;
    const continuityScore = tracker.continuity.total
      ? tracker.continuity.hits / tracker.continuity.total
      : 0;
    const repetitionIndex = tracker.repetition.total
      ? tracker.repetition.duplicate / tracker.repetition.total
      : 0;
    const vectorUtilization = autoSteps
      ? Number(tracker.counts.vectorsUsed || 0) / autoSteps
      : 0;
    const tagBalanceEntropy = shannonEntropy(tracker.counts.tags);

    const pass = {
      spawn_rate: spawnRate >= Number(gates.spawn_rate?.min ?? 0) &&
        spawnRate <= Number(gates.spawn_rate?.max ?? 1),
      continuity_score: continuityScore >= Number(gates.continuity_score?.min ?? 0),
      repetition_index: repetitionIndex <= Number(gates.repetition_index?.max ?? 1),
      vector_utilization: vectorUtilization >= Number(gates.vector_utilization?.min ?? 0),
      tag_balance_entropy: tagBalanceEntropy >= Number(gates.tag_balance_entropy?.min ?? 0)
    };

    const allPass = Object.values(pass).every(Boolean);
    const parity = paritySnapshot || collectParitySnapshot();
    const parityPass = requiredParity.every((key) => Boolean(parity[key]));
    return {
      version: tracker.version,
      line_id: tracker.lineId,
      started_at: tracker.startedAt,
      ended_at: tracker.endedAt,
      root_seed: tracker.rootSeed,
      counts: clone(tracker.counts),
      metrics: {
        spawn_rate: Number(spawnRate.toFixed(4)),
        continuity_score: Number(continuityScore.toFixed(4)),
        repetition_index: Number(repetitionIndex.toFixed(4)),
        vector_utilization: Number(vectorUtilization.toFixed(4)),
        tag_balance_entropy: Number(tagBalanceEntropy.toFixed(4))
      },
      gates: clone(gates),
      gate_pass: pass,
      parity: parity,
      parity_required: requiredParity,
      parity_pass: parityPass,
      valid: allPass && parityPass,
      actions: clone(tracker.actions),
      event_count: tracker.events.length
    };
  }

  function downloadJson(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderStatus(el, lineSpec, version) {
    if (!el) return;
    if (!lineSpec) {
      el.textContent = `RRC ${version || "RRC-1"} | UNKNOWN LINE`;
      return;
    }
    const status = String(lineSpec.status || "experimental").toUpperCase();
    const owner = lineSpec.owner ? ` | ${lineSpec.owner}` : "";
    el.textContent = `RRC ${version || "RRC-1"} | ${status}${owner}`;
  }

  window.RRCRuntime = {
    loadConfig,
    getLineSpec,
    createTracker,
    setRootSeed,
    recordAction,
    recordFragment,
    recordSpawn,
    recordVectorUse,
    recordTagMutation,
    recordEvent,
    chooseAutoAction,
    collectParitySnapshot,
    finalizeRun,
    downloadJson,
    renderStatus
  };
})();

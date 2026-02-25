/* gpt.js
   RIPPLES — Causal Worldtext Instrument (Beta)
   Works with: indexgpt.html + gpt.css
   No external dependencies.
*/

(() => {
  "use strict";

  // -----------------------------
  // Scenario registry
  // -----------------------------
  const SCENARIOS = [
    { id: "cupboard", name: "THE_CUPBOARD" },
    { id: "abandoned-house", name: "ABANDONED_HOUSE" },
    { id: "deep-forest", name: "DEEP_FOREST" },
    { id: "urban-jungle", name: "URBAN_JUNGLE" },
  ];

  // -----------------------------
  // Latent library + scene data
  // -----------------------------
  const latentLibrary = {
    "cupboard": {
      name: "THE CUPBOARD",
      baseline:
        "The cupboard space is pressurized by stillness. Air is old and faintly sugared. Surfaces hold residue like memory. Light arrives in slivers; shadow collects in corners. Everything waits in suspended negotiation.",
      grid: { cols: 8, rows: 6 },
      entities: [
        { id: "ant", name: "Formicidae Scout", type: "animate", state: "foraging", position: {x:1,y:2}, icon:"🐜", adjacentTo:["plates","glass","shadow"] },
        { id: "dust-mote", name: "Dust Mote", type: "inanimate", state: "suspended", position: {x:0,y:0}, icon:"✧", adjacentTo:["light","shadow"] },
        { id: "plates", name: "Plate Stack", type: "inanimate", state: "stacked", position: {x:4,y:2}, icon:"🍽️", adjacentTo:["ant","glass","shadow"] },
        { id: "glass", name: "Tall Glass", type: "inanimate", state: "film-wet", position: {x:1,y:4}, icon:"🥛", adjacentTo:["ant","plates","light"] },
        { id: "light", name: "Light Shaft", type: "abstract", state: "slanting", position: {x:6,y:0}, icon:"🔆", adjacentTo:["dust-mote","shadow","glass"] },
        { id: "shadow", name: "Shadow", type: "abstract", state: "pooled", position: {x:6,y:4}, icon:"⬛", adjacentTo:["light","dust-mote","plates","ant"] },
      ],
      latent: {
        "ant": {
          GOAL: "The Ant entity abandons the boundary cracks, navigating the ceramic topography of the plate stack. It traces an invisible chemical scent-line toward the tall glasses where a residue of dried liquid remains. Antennae process gradients. The world becomes a map of sugar probability.",
          OBSTACLE: "A vertical wall of glazed ceramic rises like weather. The route collapses. The surface offers no purchase, only blankness. The air tastes wrong here, as if the trail has been erased.",
          SHIFT: "Metabolism downshifts. The foraging impulse thins. A pause becomes a shelter. Time narrows to a single segment of breath and antennae-held stillness."
        },
        "dust-mote": {
          GOAL: "I drift toward the brightest seam. The beam feels like a current I can ride, a ladder made of warmth. I become briefly visible—an idea in suspension—before I can settle into any surface.",
          OBSTACLE: "The Dust Mote encounters a downdraft. The convection current reverses. It spirals downward, away from the light shaft. The air becomes opposition. It settles on the rim of a glass, adhering to residual moisture. Stillness replaces motion.",
          SHIFT: "Static charge gathers. I stop being solitary. Fibers and pollen adhere as if we are assembling a small continent. My drift becomes a slow accumulation."
        },
        "plates": {
          GOAL: "The stack tightens its balance. Weight becomes intention. The upper plate leans toward a different alignment, as if seeking a quieter resting angle.",
          OBSTACLE: "A tremor passes through wood. Friction resists. The plates hold, but the tension remains in the glaze, a postponed slide.",
          SHIFT: "Temperature changes. The ceramic contracts slightly. Micro-sounds—almost not sounds—rearrange what 'still' means."
        },
        "glass": {
          GOAL: "Residual sweetness calls like a rumor. I hold it and amplify it. A film at my rim becomes a resource that wants to be discovered.",
          OBSTACLE: "Condensation fails. The thin wetness evaporates. Stickiness becomes a trap for dust, then a refusal of clarity.",
          SHIFT: "Light refracts differently. I stop being a container and become a lens. Edges sharpen; interior becomes sky."
        },
        "light": {
          GOAL: "I angle deeper. I want to map the cabinet with brightness, to draw boundaries, to reveal the dust that rides me.",
          OBSTACLE: "A door closes a fraction. My corridor narrows. I fragment into weaker bands, as if I am being edited out of the scene.",
          SHIFT: "Intensity modulates. I stop being illumination and become heat—an invisible pressure that changes the air’s decisions."
        },
        "shadow": {
          GOAL: "I extend toward the place where objects meet, filling the tiny gaps as if seeking occupancy. I become thicker where attention might fall.",
          OBSTACLE: "Light insists. It pushes into my edges. I retreat, not defeated, but redistributed, becoming thinner where it matters.",
          SHIFT: "The Shadow deepens. As external light fades, its character changes from gray to black. It stops being the absence of light and becomes a presence. The shift is perceptual—for anyone who might observe, the shadow has become substance."
        }
      },
      ambientBehaviors: [
        { entity: "dust-mote", vector: "SHIFT", probability: 0.30 },
        { entity: "shadow", vector: "GOAL", probability: 0.20 },
        { entity: "ant", vector: "GOAL", probability: 0.50 }
      ]
    },

    "abandoned-house": {
      name: "ABANDONED_HOUSE",
      baseline:
        "The house is a slow machine of rot and ingress. Wallpaper peels in careful layers. Rain enters without asking. Small lives move through cracks; larger absence occupies rooms.",
      grid: { cols: 8, rows: 6 },
      entities: [
        { id: "raccoon", name: "Raccoon", type: "animate", state: "scavenging", position: {x:1,y:1}, icon:"🦝", adjacentTo:["door","wallpaper","rain"] },
        { id: "mold", name: "Mold Colony", type: "animate", state: "blooming", position: {x:3,y:4}, icon:"🦠", adjacentTo:["wallpaper","rain","door"] },
        { id: "ivy", name: "Ivy", type: "animate", state: "climbing", position: {x:0,y:3}, icon:"🌿", adjacentTo:["door","wallpaper"] },
        { id: "rain", name: "Rain", type: "abstract", state: "seeping", position: {x:6,y:0}, icon:"🌧️", adjacentTo:["mold","wallpaper","door"] },
        { id: "wallpaper", name: "Wallpaper", type: "inanimate", state: "delaminating", position: {x:5,y:3}, icon:"🧻", adjacentTo:["mold","rain","door"] },
        { id: "door", name: "Door", type: "inanimate", state: "ajar", position: {x:6,y:5}, icon:"🚪", adjacentTo:["raccoon","ivy","rain","wallpaper"] },
      ],
      latent: seedLatents(["raccoon","mold","ivy","rain","wallpaper","door"]),
      ambientBehaviors: [
        { entity: "rain", vector: "SHIFT", probability: 0.35 },
        { entity: "mold", vector: "GOAL", probability: 0.30 },
        { entity: "door", vector: "OBSTACLE", probability: 0.35 }
      ]
    },

    "deep-forest": {
      name: "DEEP_FOREST",
      baseline:
        "Below the canopy, moisture and signal travel by root and thread. The air is thick with slow exchange. Every surface is a ledger of spores, breath, and quiet recoil.",
      grid: { cols: 8, rows: 6 },
      entities: [
        { id: "mycelium", name: "Mycelial Network", type: "animate", state: "conducting", position: {x:2,y:3}, icon:"🍄", adjacentTo:["seedling","fallen-oak","moonlight"] },
        { id: "deer", name: "Deer", type: "animate", state: "listening", position: {x:6,y:3}, icon:"🦌", adjacentTo:["owl","seedling","moonlight"] },
        { id: "owl", name: "Owl", type: "animate", state: "hovering", position: {x:6,y:1}, icon:"🦉", adjacentTo:["deer","moonlight"] },
        { id: "seedling", name: "Seedling", type: "animate", state: "stretching", position: {x:1,y:1}, icon:"🌱", adjacentTo:["mycelium","fallen-oak","moonlight"] },
        { id: "fallen-oak", name: "Fallen Oak", type: "inanimate", state: "nursing", position: {x:3,y:5}, icon:"🪵", adjacentTo:["mycelium","seedling"] },
        { id: "moonlight", name: "Moonlight", type: "abstract", state: "threading", position: {x:7,y:0}, icon:"🌙", adjacentTo:["owl","deer","mycelium","seedling"] },
      ],
      latent: seedLatents(["mycelium","deer","owl","seedling","fallen-oak","moonlight"]),
      ambientBehaviors: [
        { entity: "mycelium", vector: "SHIFT", probability: 0.40 },
        { entity: "moonlight", vector: "GOAL", probability: 0.20 },
        { entity: "deer", vector: "OBSTACLE", probability: 0.40 }
      ]
    },

    "urban-jungle": {
      name: "URBAN_JUNGLE",
      baseline:
        "Concrete holds heat long after the sun. Puddles collect reflections like temporary archives. Signals compete: scent, noise, light, and the grammar of traffic. Life persists in seams.",
      grid: { cols: 8, rows: 6 },
      entities: [
        { id: "pigeon", name: "Pigeon", type: "animate", state: "circling", position: {x:1,y:0}, icon:"🕊️", adjacentTo:["rat","puddle","traffic-light"] },
        { id: "rat", name: "Rat", type: "animate", state: "threading", position: {x:2,y:4}, icon:"🐀", adjacentTo:["weed","puddle","graffiti"] },
        { id: "graffiti", name: "Graffiti", type: "inanimate", state: "shouting", position: {x:5,y:1}, icon:"🎨", adjacentTo:["traffic-light","puddle"] },
        { id: "traffic-light", name: "Traffic Light", type: "abstract", state: "cycling", position: {x:6,y:2}, icon:"🚦", adjacentTo:["pigeon","graffiti","puddle"] },
        { id: "puddle", name: "Puddle", type: "inanimate", state: "reflecting", position: {x:4,y:5}, icon:"💧", adjacentTo:["rat","pigeon","traffic-light","weed"] },
        { id: "weed", name: "Weed", type: "animate", state: "insisting", position: {x:7,y:5}, icon:"🌾", adjacentTo:["rat","puddle"] },
      ],
      latent: seedLatents(["pigeon","rat","graffiti","traffic-light","puddle","weed"]),
      ambientBehaviors: [
        { entity: "traffic-light", vector: "SHIFT", probability: 0.35 },
        { entity: "pigeon", vector: "GOAL", probability: 0.30 },
        { entity: "rat", vector: "OBSTACLE", probability: 0.35 }
      ]
    }
  };

  function seedLatents(ids){
    const out = {};
    for (const id of ids){
      out[id] = {
        GOAL: `${id} moves toward a resource gradient—heat, scent, moisture, or signal. The environment becomes a map of partial promises.`,
        OBSTACLE: `${id} meets resistance: a barrier, a rival force, a missing pathway. The world stiffens; routes become refusals.`,
        SHIFT: `${id} changes state. Tempo, visibility, or identity re-tunes. The old description no longer fits cleanly.`
      };
    }
    return out;
  }

  // -----------------------------
  // Beta causal model constants
  // -----------------------------
  const STATE_DIMS = ["activity", "stability", "exposure", "resource", "signal"];

  const TYPE_BASE_STATE = {
    animate:   { activity: 0.62, stability: 0.46, exposure: 0.42, resource: 0.48, signal: 0.52 },
    inanimate: { activity: 0.18, stability: 0.70, exposure: 0.36, resource: 0.34, signal: 0.30 },
    abstract:  { activity: 0.52, stability: 0.40, exposure: 0.68, resource: 0.26, signal: 0.74 },
  };

  const VECTOR_BASE_DELTA = {
    GOAL:     { activity: 0.16, stability: -0.05, exposure: 0.09, resource: 0.17, signal: 0.08 },
    OBSTACLE: { activity: -0.04, stability: -0.17, exposure: 0.07, resource: -0.12, signal: 0.10 },
    SHIFT:    { activity: 0.03, stability: -0.06, exposure: 0.12, resource: 0.00, signal: 0.18 },
  };

  const TYPE_VECTOR_BIAS = {
    animate: {
      GOAL:     { activity: 0.05, resource: 0.04, signal: 0.02 },
      OBSTACLE: { activity: -0.03, exposure: 0.05, stability: -0.03 },
      SHIFT:    { activity: -0.01, signal: 0.04, exposure: 0.03 },
    },
    inanimate: {
      GOAL:     { stability: 0.02, resource: 0.05, activity: -0.02 },
      OBSTACLE: { stability: -0.05, exposure: 0.03, signal: 0.02 },
      SHIFT:    { signal: 0.06, exposure: 0.04, stability: -0.02 },
    },
    abstract: {
      GOAL:     { signal: 0.06, exposure: 0.05, stability: -0.03 },
      OBSTACLE: { signal: 0.04, exposure: -0.02, stability: -0.05 },
      SHIFT:    { signal: 0.10, exposure: 0.06, activity: 0.02 },
    }
  };

  const CHANNEL_DIM_BIAS = {
    residue:        { resource: 0.14, exposure: 0.10, signal: 0.03 },
    "surface-contact": { stability: -0.08, exposure: 0.06, activity: 0.04 },
    contact:        { stability: -0.05, exposure: 0.05, activity: 0.03 },
    heat:           { activity: 0.09, exposure: 0.05, stability: -0.04 },
    light:          { exposure: 0.12, signal: 0.10, stability: -0.02 },
    shadow:         { exposure: -0.10, signal: 0.08, stability: 0.02 },
    moisture:       { resource: 0.11, stability: -0.03, exposure: 0.08 },
    reflection:     { signal: 0.13, exposure: 0.07 },
    pressure:       { stability: -0.09, signal: 0.04, activity: 0.02 },
    scent:          { signal: 0.09, resource: 0.08, activity: 0.05 },
    signal:         { signal: 0.15, activity: 0.04, exposure: 0.04 },
    noise:          { signal: 0.08, stability: -0.06, activity: 0.03 },
    ingress:        { exposure: 0.10, resource: 0.05, stability: -0.04 },
    growth:         { resource: 0.10, activity: 0.06, stability: -0.02 },
    current:        { activity: 0.07, signal: 0.05, exposure: 0.05 },
    spore:          { exposure: 0.08, signal: 0.06, resource: 0.05 },
    root:           { resource: 0.09, stability: 0.03, signal: 0.05 },
    proximity:      { signal: 0.05, exposure: 0.04 },
  };

  const VECTOR_WORDS = {
    GOAL: { verb: "tracks", mode: "resource-seeking", color: "goal" },
    OBSTACLE: { verb: "meets resistance in", mode: "blocked-routing", color: "obstacle" },
    SHIFT: { verb: "re-tunes through", mode: "state-change", color: "shift" },
  };

  // -----------------------------
  // State
  // -----------------------------
  let currentScenario = "cupboard";
  let selectedEntity = null;
  let tick = 0;
  let eventCounter = 0;

  let auditLog = [];
  let viewedEventId = null;

  let runtime = null;          // scenario runtime state (mutable entity states + edges)
  let linkGeometry = {};       // directed geometry cache for pulses
  let replayTimers = [];

  // Autoplay
  let isAutoplay = false;
  let autoplayTimer = null;
  let countdownTimer = null;
  let secondsToNext = 0;

  // -----------------------------
  // DOM
  // -----------------------------
  const elScenarioSelect = byId("scenarioSelect");
  const elScenarioPill = byId("scenarioPill");
  const elGrid = byId("grid");
  const elLinks = byId("linkLayer");
  const elLinkPulses = byId("linkPulseLayer");
  const elEntityList = byId("entityList");
  const elWorldtext = byId("worldtext");
  const elPromptPanel = byId("promptPanel");
  const elImpactPanel = byId("impactPanel");
  const elAuditLog = byId("auditLog");
  const elGuideContent = byId("guideContent");
  const elTickLabel = byId("tickLabel");
  const elSelectedPill = byId("selectedPill");

  const btnGoal = byId("btnGoal");
  const btnObstacle = byId("btnObstacle");
  const btnShift = byId("btnShift");

  const elAutoplayToggle = byId("autoplayToggle");
  const elCountdownPill = byId("countdownPill");

  const elBpmSlider = byId("bpmSlider");
  const elFxSlider = byId("fxSlider");
  const elRippleSpeedSlider = byId("rippleSpeedSlider");
  const elBpmLabel = byId("bpmLabel");

  const elUiBackdrop = byId("uiBackdrop");
  const btnOpenEntities = byId("openEntitiesBtn");
  const btnOpenInspect = byId("openInspectBtn");
  const btnOpenGuide = byId("openGuideBtn");
  const btnOpenLlm = byId("openLlmBtn");
  const btnDockEntities = byId("dockEntitiesBtn");
  const btnDockInspect = byId("dockInspectBtn");
  const btnDockGuide = byId("dockGuideBtn");
  const btnDockLlm = byId("dockLlmBtn");

  const elLlmDrawer = byId("llmDrawer");
  const elLlmStatusLine = byId("llmStatusLine");
  const elLlmModeSelect = byId("llmModeSelect");
  const elLlmStyleSelect = byId("llmStyleSelect");
  const elLlmPerspectiveSelect = byId("llmPerspectiveSelect");
  const elLlmBundleModeSelect = byId("llmBundleModeSelect");
  const elLlmStoneInput = byId("llmStoneInput");
  const elLlmSystemPrompt = byId("llmSystemPrompt");
  const elLlmEventJson = byId("llmEventJson");
  const elLlmBundleText = byId("llmBundleText");
  const btnLlmRefresh = byId("llmRefreshBtn");
  const btnLlmBuild = byId("llmBuildBtn");
  const btnLlmCopyJson = byId("llmCopyJsonBtn");
  const btnLlmCopyBundle = byId("llmCopyBundleBtn");
  const btnLlmCopyPrompt = byId("llmCopyPromptBtn");
  const btnLlmCopyUser = byId("llmCopyUserBtn");
  const btnLlmClose = byId("llmCloseBtn");

  // -----------------------------
  // Init
  // -----------------------------
  function init(){
    populateScenarioSelect();
    bindUI();
    applyFxFromSliders();
    changeScenario(currentScenario);
  }

  function populateScenarioSelect(){
    elScenarioSelect.innerHTML = "";
    for (const s of SCENARIOS){
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      elScenarioSelect.appendChild(opt);
    }
    elScenarioSelect.value = currentScenario;
  }

  function bindUI(){
    elScenarioSelect.addEventListener("change", () => changeScenario(elScenarioSelect.value));

    btnGoal.addEventListener("click", () => triggerRipple("GOAL", "manual"));
    btnObstacle.addEventListener("click", () => triggerRipple("OBSTACLE", "manual"));
    btnShift.addEventListener("click", () => triggerRipple("SHIFT", "manual"));

    elAutoplayToggle.addEventListener("click", toggleAutoplay);

    elBpmSlider.addEventListener("input", () => {
      const bpm = clamp(parseInt(elBpmSlider.value, 10), 6, 60);
      elBpmLabel.textContent = String(bpm);
      if (isAutoplay) restartAutoplay();
    });

    elFxSlider.addEventListener("input", applyFxFromSliders);
    elRippleSpeedSlider.addEventListener("input", applyFxFromSliders);

    btnOpenEntities.addEventListener("click", () => openMobilePanel("left"));
    btnOpenInspect.addEventListener("click", () => openMobilePanel("right"));
    btnDockEntities.addEventListener("click", () => openMobilePanel("left"));
    btnDockInspect.addEventListener("click", () => openMobilePanel("right"));
    btnOpenGuide.addEventListener("click", () => openGuidePanel());
    btnDockGuide.addEventListener("click", () => openGuidePanel());
    btnOpenLlm.addEventListener("click", () => openLlmDrawer());
    btnDockLlm.addEventListener("click", () => openLlmDrawer());
    elUiBackdrop.addEventListener("click", closeOverlays);

    btnLlmRefresh.addEventListener("click", () => updateLlmWorkbench());
    btnLlmBuild.addEventListener("click", () => updateLlmWorkbench());
    btnLlmClose.addEventListener("click", closeLlmDrawer);
    btnLlmCopyJson.addEventListener("click", () => copyLlmText(elLlmEventJson.value, "Event JSON"));
    btnLlmCopyBundle.addEventListener("click", () => {
      const bundle = buildLlmBundle(getFocusedEvent());
      copyLlmText(bundle.copyPayload, "LLM bundle");
    });
    btnLlmCopyPrompt.addEventListener("click", () => copyLlmText(elLlmSystemPrompt.value, "System prompt"));
    btnLlmCopyUser.addEventListener("click", () => {
      const bundle = buildLlmBundle(getFocusedEvent());
      copyLlmText(bundle.userPrompt, "User payload");
    });
    [elLlmModeSelect, elLlmStyleSelect, elLlmPerspectiveSelect, elLlmBundleModeSelect].forEach(el => {
      el.addEventListener("change", () => updateLlmWorkbench());
    });
    elLlmStoneInput.addEventListener("input", () => updateLlmWorkbench({ quiet: true }));

    window.addEventListener("keydown", (e) => {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"){
        if (e.key === "Escape"){
          closeOverlays();
        }
        return;
      }
      const key = e.key;

      if (key === "ArrowLeft"){ e.preventDefault(); cycleScenario(-1); }
      if (key === "ArrowRight"){ e.preventDefault(); cycleScenario(1); }

      if (key === " "){
        e.preventDefault();
        toggleAutoplay();
      }

      if (key === "g" || key === "G") triggerRipple("GOAL", "manual");
      if (key === "o" || key === "O") triggerRipple("OBSTACLE", "manual");
      if (key === "s" || key === "S") triggerRipple("SHIFT", "manual");
      if (key === "l" || key === "L"){ e.preventDefault(); openLlmDrawer(); }
      if (key === "?"){ e.preventDefault(); openGuidePanel(); }
      if (key === "Escape"){ closeOverlays(); }

      if (/^[1-6]$/.test(key)){
        const idx = parseInt(key, 10) - 1;
        const ents = getScenario().entities;
        if (ents[idx]) selectEntity(ents[idx].id);
      }
    });

    window.addEventListener("resize", () => {
      clearTimeout(window.__linksDebounce);
      window.__linksDebounce = setTimeout(renderLinks, 120);
      syncBackdropState();
    });
  }

  function applyFxFromSliders(){
    const fx = clamp(parseInt(elFxSlider.value, 10) / 100, 0, 1);
    const sp = clamp(parseInt(elRippleSpeedSlider.value, 10) / 100, 0.5, 2);

    document.documentElement.style.setProperty("--fx-flicker", String(0.15 + 0.85*fx));
    document.documentElement.style.setProperty("--fx-glow", String(0.15 + 0.85*fx));
    document.documentElement.style.setProperty("--fx-ripple-speed", String(sp));
  }

  // -----------------------------
  // Scenario / Rendering
  // -----------------------------
  function getScenario(){ return latentLibrary[currentScenario]; }

  function cycleScenario(dir){
    const i = SCENARIOS.findIndex(s => s.id === currentScenario);
    const next = (i + dir + SCENARIOS.length) % SCENARIOS.length;
    changeScenario(SCENARIOS[next].id);
  }

  function changeScenario(id){
    currentScenario = id;
    elScenarioSelect.value = id;

    const meta = SCENARIOS.find(s => s.id === id);
    elScenarioPill.textContent = meta ? meta.name : id;

    // Reset state on scenario change
    selectedEntity = null;
    tick = 0;
    auditLog = [];
    viewedEventId = null;
    eventCounter = 0;
    clearReplayTimers();
    closeOverlays();

    ensurePromptCorpus(getScenario(), currentScenario);
    runtime = createScenarioRuntime(getScenario(), currentScenario);

    // Stop autoplay when switching
    if (isAutoplay) toggleAutoplay();

    renderAll();
    setWorldtext(getScenario().baseline, { mode: "baseline" });
    updateLlmWorkbench({ quiet: true });
  }

  function renderAll(){
    renderEntityPool();
    renderGrid();
    renderLinks();
    renderGuidePanel();
    renderPromptPanel();
    renderImpactPanel();
    renderAuditLog();
    updateVectorButtons();
    updateSelectedPill();
    elTickLabel.textContent = String(tick);
    updateLlmWorkbench({ quiet: true });
  }

  function renderEntityPool(){
    elEntityList.innerHTML = "";
    const ents = getScenario().entities;

    ents.forEach((ent, i) => {
      const rt = runtime && runtime.entities[ent.id] ? runtime.entities[ent.id] : null;
      const item = document.createElement("div");
      item.className = "entity-item" + (selectedEntity === ent.id ? " selected" : "");
      item.addEventListener("click", () => selectEntity(ent.id));

      const icon = document.createElement("div");
      icon.className = "entity-icon";
      icon.textContent = ent.icon || "•";

      const meta = document.createElement("div");
      meta.className = "entity-meta";

      const name = document.createElement("div");
      name.className = "entity-name";
      name.textContent = ent.name;

      const sub = document.createElement("div");
      sub.className = "entity-sub";
      const stateLabel = rt ? deriveEntityDescriptor(ent, rt.state) : ent.state;
      const io = rt ? `in ${rt.io.in} / out ${rt.io.out}` : "";
      sub.textContent = `${ent.type} / ${stateLabel} · ${io} · key ${i+1}`;

      meta.appendChild(name);
      meta.appendChild(sub);

      if (rt){
        const mini = document.createElement("div");
        mini.className = "state-mini";
        mini.innerHTML = renderMiniStateBars(rt.state);
        meta.appendChild(mini);
      }

      item.appendChild(icon);
      item.appendChild(meta);
      elEntityList.appendChild(item);
    });
  }

  function renderGrid(){
    const sc = getScenario();
    const { cols, rows } = sc.grid;

    document.documentElement.style.setProperty("--cols", cols);
    document.documentElement.style.setProperty("--rows", rows);

    elGrid.innerHTML = "";

    const occupied = new Map();
    for (const ent of sc.entities){ occupied.set(`${ent.position.x},${ent.position.y}`, ent); }

    for (let y=0; y<rows; y++){
      for (let x=0; x<cols; x++){
        const cell = document.createElement("div");
        cell.className = "grid-cell";

        const ent = occupied.get(`${x},${y}`);
        if (ent){
          const rt = runtime.entities[ent.id];
          cell.classList.add("has-entity");
          cell.dataset.entityId = ent.id;

          if (selectedEntity === ent.id) cell.classList.add("selected");

          const lastImpact = rt.lastImpact;
          if (lastImpact && tick - lastImpact.tick <= 4){
            cell.classList.add("impacted", lastImpact.vector.toLowerCase());
            cell.style.setProperty("--impact-alpha", String(clamp(0.18 + lastImpact.intensity * 0.55, 0.18, 0.7)));
          } else {
            cell.style.removeProperty("--impact-alpha");
          }

          const descriptor = deriveEntityDescriptor(ent, rt.state);
          const inner = document.createElement("div");
          inner.className = "grid-entity";

          const impactBadge = lastImpact && tick - lastImpact.tick <= 4
            ? `<div class="impact-badge ${escapeHtml(lastImpact.vector.toLowerCase())}">${formatPct(lastImpact.intensity)}</div>`
            : "";

          inner.innerHTML = `
            <div class="icon">${escapeHtml(ent.icon || "•")}</div>
            <div class="label">${escapeHtml(ent.id)}</div>
            <div class="micro">${escapeHtml(descriptor)}</div>
            ${impactBadge}
          `;

          cell.appendChild(inner);
          cell.addEventListener("click", () => selectEntity(ent.id));
        }

        elGrid.appendChild(cell);
      }
    }
  }

  function renderLinks(){
    elLinks.innerHTML = "";
    elLinkPulses.innerHTML = "";
    linkGeometry = {};

    const sc = getScenario();
    const { cols } = sc.grid;

    const rect = elGrid.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const cellSize = rect.width / cols;
    const viewBox = `0 0 ${rect.width} ${rect.height}`;
    elLinks.setAttribute("viewBox", viewBox);
    elLinkPulses.setAttribute("viewBox", viewBox);

    const centers = {};
    for (const ent of sc.entities){
      centers[ent.id] = {
        cx: (ent.position.x + 0.5) * cellSize,
        cy: (ent.position.y + 0.5) * cellSize
      };
    }

    const drawn = new Set();
    for (const ent of sc.entities){
      const a = centers[ent.id];
      if (!a) continue;
      for (const adj of (ent.adjacentTo || [])){
        const b = centers[adj];
        if (!b) continue;

        const undirected = [ent.id, adj].sort().join("::");
        if (!drawn.has(undirected)){
          drawn.add(undirected);
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", String(a.cx));
          line.setAttribute("y1", String(a.cy));
          line.setAttribute("x2", String(b.cx));
          line.setAttribute("y2", String(b.cy));
          if (selectedEntity && (selectedEntity === ent.id || selectedEntity === adj)) line.classList.add("near-selected");
          elLinks.appendChild(line);
        }

        linkGeometry[`${ent.id}->${adj}`] = { x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy };
      }
    }
  }

  function selectEntity(entityId){
    selectedEntity = entityId;
    renderAll();

    if (elWorldtext.dataset.mode !== "ripple"){
      const ent = getScenario().entities.find(e => e.id === selectedEntity);
      if (ent){
        setWorldtext(
          getScenario().baseline + `\n\n[Perspective locked: ${ent.name} (${ent.id}). Press G/O/S.]`,
          { mode: "baseline" }
        );
      }
    }
  }

  function updateVectorButtons(){
    const enabled = !!selectedEntity;
    btnGoal.disabled = !enabled;
    btnObstacle.disabled = !enabled;
    btnShift.disabled = !enabled;
  }

  function updateSelectedPill(){
    if (!selectedEntity){
      elSelectedPill.textContent = "NO ENTITY";
      return;
    }
    const ent = getScenario().entities.find(e => e.id === selectedEntity);
    const rt = runtime && runtime.entities[selectedEntity];
    const suffix = rt ? ` · ${deriveEntityDescriptor(ent, rt.state).toUpperCase()}` : "";
    elSelectedPill.textContent = (ent ? ent.id : selectedEntity).toUpperCase() + suffix;
  }

  // -----------------------------
  // Worldtext rendering with clickable entities
  // -----------------------------
  function setWorldtext(text, opts = {}){
    const mode = opts.mode || "ripple";
    elWorldtext.dataset.mode = mode;
    const event = opts.event || null;

    const sc = getScenario();
    const tokens = [];
    const tokenToId = new Map();
    for (const ent of sc.entities){
      tokens.push(ent.name, ent.id);
      tokenToId.set(ent.name, ent.id);
      tokenToId.set(ent.id, ent.id);
    }
    tokens.sort((a,b) => b.length - a.length);

    if (!tokens.length){
      elWorldtext.textContent = text;
      return;
    }

    const regex = new RegExp(tokens.map(escapeRegExp).join("|"), "g");
    let html = "";
    let lastIdx = 0;
    const src = String(text);

    src.replace(regex, (match, ...args) => {
      const offset = typeof args[args.length - 2] === "number" ? args[args.length - 2] : args[0];
      html += escapeHtml(src.slice(lastIdx, offset));
      html += `<span class="entity-link" data-entity="${escapeHtml(tokenToId.get(match) || "")}">${escapeHtml(match)}</span>`;
      lastIdx = offset + match.length;
      return match;
    });
    html += escapeHtml(src.slice(lastIdx));

    let outHtml = html;
    if (mode === "ripple" && event){
      outHtml = renderWorldtextEventFrame(event) + `<div class="worldtext-body">${html}</div>`;
    } else if (mode === "preview"){
      outHtml = `<div class="worldtext-preview-badge">PROMPT PREVIEW · NOT AN AUDITED EVENT</div><div class="worldtext-body">${html}</div>`;
    } else if (mode === "baseline"){
      outHtml = `<div class="worldtext-preview-badge">SCENE BASELINE</div><div class="worldtext-body">${html}</div>`;
    }

    elWorldtext.innerHTML = outHtml;
    elWorldtext.scrollTop = 0;

    elWorldtext.querySelectorAll(".entity-link").forEach(span => {
      span.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-entity");
        if (id) selectEntity(id);
      });
    });
  }

  function renderWorldtextEventFrame(event){
    const sc = getScenario();
    const ent = sc.entities.find(e => e.id === event.source.entityId);
    const descriptor = ent && event.sourceDelta && event.sourceDelta.after
      ? deriveEntityDescriptor(ent, event.sourceDelta.after).toUpperCase()
      : "—";
    const actual = formatDeltaSentence(event.sourceDelta.delta, { topOnly: 3 });
    const requested = event.sourceDelta.requested ? formatDeltaSentence(event.sourceDelta.requested, { topOnly: 3 }) : actual;
    const top = event.transfers.slice().sort((a,b) => b.intensity - a.intensity)[0];
    const blocked = event.nonEffects[0];
    const clipped = deltaMagnitude(event.sourceDelta.delta) < 0.005 && event.sourceDelta.requested && deltaMagnitude(event.sourceDelta.requested) >= 0.02;

    return `
      <div class="worldtext-top">
        <div class="worldtext-top-main">
          <div class="worldtext-sub">${escapeHtml(event.scenarioId)} · ${escapeHtml(event.origin)} · ${escapeHtml(event.timestampLocal)}</div>
          <div class="worldtext-title">${escapeHtml(ent ? ent.name : event.source.entityId)} · ${escapeHtml(descriptor)}</div>
          <div class="worldtext-meta-row">
            <span class="pill">T${event.tick}</span>
            <span class="pill" style="${vectorColorStyle(event.source.vector)}">${escapeHtml(event.source.vector)}</span>
            <span class="pill">${event.transfers.length} affected</span>
            <span class="pill">${event.nonEffects.length} blocked</span>
          </div>
        </div>
        <div class="worldtext-evidence">
          <div><strong>Applied source Δ:</strong> ${escapeHtml(actual)}</div>
          ${requested !== actual ? `<div><strong>Requested:</strong> ${escapeHtml(requested)}</div>` : ""}
          ${top ? `<div><strong>Top edge:</strong> ${escapeHtml(top.fromId)}→${escapeHtml(top.targetId)} via ${escapeHtml(top.edge.channel)} (${formatNum(top.intensity)})</div>` : `<div><strong>Top edge:</strong> none</div>`}
          ${blocked ? `<div><strong>Blocked:</strong> ${escapeHtml(blocked.fromId)}→${escapeHtml(blocked.targetId)} (${escapeHtml(blocked.reasonCode)})</div>` : ""}
          ${clipped ? `<div class="worldtext-warning">Source state was at a boundary; requested delta was clipped by state limits.</div>` : ""}
        </div>
      </div>
    `;
  }

  // -----------------------------
  // Guide / Intro Panel
  // -----------------------------
  function renderGuidePanel(){
    elGuideContent.innerHTML = `
      <div class="guide-card">
        <h4>Read Order</h4>
        <div class="guide-step"><span class="guide-n">1</span><span>Pick an entity, then trigger <span class="k">G</span> / <span class="k">O</span> / <span class="k">S</span>.</span></div>
        <div class="guide-step"><span class="guide-n">2</span><span>Read <strong>Impact Panel</strong> first: source delta, transfers, resistance, delays, blocked/no-effect paths.</span></div>
        <div class="guide-step"><span class="guide-n">3</span><span>Read <strong>Worldtext</strong> as the perspective layer generated from the event record.</span></div>
        <div class="guide-step"><span class="guide-n">4</span><span>Use <strong>LLM Workbench</strong> to export a prompt bundle and event JSON to any model.</span></div>
      </div>
      <div class="guide-card">
        <h4>Scaling Pattern</h4>
        <p>Keep the ripple event schema stable. Add scenarios, prompt packs, and UI views around it. The event log is the source of truth; prose and visuals are interpretations.</p>
      </div>
      <div class="guide-card">
        <h4>Mobile Pattern</h4>
        <p>On small screens, use the bottom dock to open <strong>Entities</strong>, <strong>Inspect</strong>, <strong>Guide</strong>, and <strong>LLM</strong> without losing the scene viewport.</p>
        <div class="guide-note">If a prompt or prose claim is not reflected in the Impact Panel or Audit Log, treat it as speculation.</div>
      </div>
    `;
  }

  // -----------------------------
  // Overlay / Mobile Controls
  // -----------------------------
  function isMobileLayout(){
    return window.matchMedia("(max-width: 1260px)").matches;
  }

  function syncBackdropState(){
    if (!isMobileLayout()){
      document.body.classList.remove("mobile-left-open", "mobile-right-open");
    }
    const open = document.body.classList.contains("mobile-left-open")
      || document.body.classList.contains("mobile-right-open")
      || document.body.classList.contains("llm-open");
    elUiBackdrop.hidden = !open;
  }

  function closeMobilePanels(){
    document.body.classList.remove("mobile-left-open", "mobile-right-open");
    syncBackdropState();
  }

  function openMobilePanel(which){
    if (!isMobileLayout()){
      if (which === "left") byId("leftPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      if (which === "right") byId("rightPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    document.body.classList.remove("mobile-left-open", "mobile-right-open");
    document.body.classList.add(which === "left" ? "mobile-left-open" : "mobile-right-open");
    syncBackdropState();
  }

  function openGuidePanel(){
    openMobilePanel("right");
    byId("guidePanel").scrollIntoView({ behavior: isMobileLayout() ? "auto" : "smooth", block: "start" });
  }

  function closeOverlays(){
    closeMobilePanels();
    closeLlmDrawer();
  }

  // -----------------------------
  // Prompt / Latent Panel
  // -----------------------------
  function renderPromptPanel(){
    elPromptPanel.innerHTML = "";

    if (!selectedEntity){
      const d = document.createElement("div");
      d.className = "help";
      d.textContent = "Select an entity to inspect prompt layers (entity seed, edge prompts, audit prompt).";
      elPromptPanel.appendChild(d);
      return;
    }

    const sc = getScenario();
    const ent = sc.entities.find(e => e.id === selectedEntity);
    const latent = sc.latent[selectedEntity] || {};
    const focused = getFocusedEvent();

    appendPromptSection("Entity Seeds (Layer A)", [
      { vec: "GOAL", color: "var(--term-gold)", id: sc.promptCorpus?.entitySeeds?.[selectedEntity]?.GOAL?.id || `${currentScenario}.${selectedEntity}.goal.v1`, text: latent.GOAL || "(no seed)", preview: () => previewPrompt(`[SEED PREVIEW — ${ent.name} + GOAL]\n\n${expandSeedPreview(latent.GOAL || "", ent, "GOAL", sc)}`) },
      { vec: "OBSTACLE", color: "var(--term-alert)", id: sc.promptCorpus?.entitySeeds?.[selectedEntity]?.OBSTACLE?.id || `${currentScenario}.${selectedEntity}.obstacle.v1`, text: latent.OBSTACLE || "(no seed)", preview: () => previewPrompt(`[SEED PREVIEW — ${ent.name} + OBSTACLE]\n\n${expandSeedPreview(latent.OBSTACLE || "", ent, "OBSTACLE", sc)}`) },
      { vec: "SHIFT", color: "var(--term-cyan)", id: sc.promptCorpus?.entitySeeds?.[selectedEntity]?.SHIFT?.id || `${currentScenario}.${selectedEntity}.shift.v1`, text: latent.SHIFT || "(no seed)", preview: () => previewPrompt(`[SEED PREVIEW — ${ent.name} + SHIFT]\n\n${expandSeedPreview(latent.SHIFT || "", ent, "SHIFT", sc)}`) },
    ], { useVecColors: true, tag: ent ? ent.id : selectedEntity });

    if (focused){
      const items = [];
      if (focused.promptMaterials && focused.promptMaterials.edgePrompts.length){
        for (const ep of focused.promptMaterials.edgePrompts){
          items.push({
            vec: `${ep.fromId} -> ${ep.targetId}`,
            id: ep.id,
            text: ep.text,
            preview: () => previewPrompt(`[EDGE PROMPT]\n${ep.id}\n\n${ep.text}`)
          });
        }
      }
      if (items.length){
        appendPromptSection("Edge Prompts (Layer B)", items, { tag: `T${focused.tick}` });
      }

      if (focused.promptMaterials && focused.promptMaterials.chainPrompts.length){
        appendPromptSection(
          "Propagation Prompts (Layer C)",
          focused.promptMaterials.chainPrompts.map(cp => ({
            vec: cp.path.join(" -> "),
            id: cp.id,
            text: cp.text,
            preview: () => previewPrompt(`[CHAIN PROMPT]\n${cp.id}\n\n${cp.text}`)
          })),
          { tag: `depth ${Math.max(...focused.promptMaterials.chainPrompts.map(cp => cp.path.length-1))}` }
        );
      }

      if (focused.promptMaterials && focused.promptMaterials.counterfactualPrompts.length){
        appendPromptSection(
          "No-Effect / Counterfactual (Layer D)",
          focused.promptMaterials.counterfactualPrompts.map(cf => ({
            vec: cf.targetId,
            id: cf.id,
            text: cf.text,
            preview: () => previewPrompt(`[COUNTERFACTUAL PROMPT]\n${cf.id}\n\n${cf.text}`)
          })),
          { tag: "resistance" }
        );
      }

      if (focused.promptMaterials && focused.promptMaterials.auditPrompt){
        appendPromptSection("Audit Prompt (Layer E)", [{
          vec: "evidence summary",
          id: focused.promptMaterials.auditPrompt.id,
          text: focused.promptMaterials.auditPrompt.text,
          preview: () => previewPrompt(`[AUDIT PROMPT]\n${focused.promptMaterials.auditPrompt.id}\n\n${focused.promptMaterials.auditPrompt.text}`)
        }], { tag: focused.promptMaterials.auditPrompt.id });
      }
    }
  }

  function appendPromptSection(title, items, opts = {}){
    const h = document.createElement("div");
    h.className = "prompt-section-title";
    h.textContent = title;
    elPromptPanel.appendChild(h);

    for (const item of items){
      const card = document.createElement("div");
      card.className = "latent-card prompt-card";

      const head = document.createElement("div");
      head.className = "h";
      const colorStyle = opts.useVecColors && item.color ? ` style="color:${item.color}"` : "";
      head.innerHTML = `
        <span${colorStyle}>${escapeHtml(item.vec)}</span>
        <span class="tag">${escapeHtml(opts.tag || "prompt")}</span>
      `;

      const txt = document.createElement("div");
      txt.className = "txt collapsed";
      txt.textContent = item.text;
      txt.addEventListener("click", () => item.preview && item.preview());
      txt.title = "Click to preview in Worldtext";

      const meta = document.createElement("div");
      meta.className = "prompt-meta";
      meta.innerHTML = `
        <span class="prompt-id">${escapeHtml(item.id || "no-id")}</span>
        <div class="prompt-actions">
          <button type="button" class="prompt-btn preview">PREVIEW</button>
          <button type="button" class="prompt-btn expand">EXPAND</button>
        </div>
      `;

      meta.querySelector(".preview").addEventListener("click", (e) => {
        e.stopPropagation();
        item.preview && item.preview();
      });
      meta.querySelector(".expand").addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = txt.classList.toggle("collapsed") === false;
        e.currentTarget.textContent = expanded ? "COLLAPSE" : "EXPAND";
      });

      card.appendChild(head);
      card.appendChild(meta);
      card.appendChild(txt);
      elPromptPanel.appendChild(card);
    }
  }

  function previewPrompt(text){
    setWorldtext(text, { mode: "preview" });
  }

  // -----------------------------
  // Impact Panel
  // -----------------------------
  function renderImpactPanel(){
    elImpactPanel.innerHTML = "";
    const event = getFocusedEvent();

    if (!event){
      const d = document.createElement("div");
      d.className = "help";
      d.textContent = "No event selected yet. Trigger GOAL / OBSTACLE / SHIFT to see source deltas, transfers, resistance, and evidence.";
      elImpactPanel.appendChild(d);
      return;
    }

    const sc = getScenario();
    const sourceEnt = sc.entities.find(e => e.id === event.source.entityId);

    const wrap = document.createElement("div");
    wrap.className = "impact-wrap";

    const header = document.createElement("div");
    header.className = "impact-header";
    header.innerHTML = `
      <div>
        <strong>T${event.tick}</strong> ${escapeHtml(event.source.entityId)} → <span class="vec ${escapeHtml(event.source.vector.toLowerCase())}">${escapeHtml(event.source.vector)}</span>
      </div>
      <div class="pill">${escapeHtml(event.origin)}</div>
    `;
    wrap.appendChild(header);

    const meta = document.createElement("div");
    meta.className = "impact-meta";
    meta.innerHTML = `
      <span>${escapeHtml(event.scenarioId)}</span>
      <span>${escapeHtml(event.timestampLocal)}</span>
      <span>${event.transfers.length} affected</span>
      <span>${event.nonEffects.length} blocked/no-effect</span>
    `;
    wrap.appendChild(meta);

    const sourceCard = document.createElement("div");
    sourceCard.className = "impact-card";
    const clippedSource = event.sourceDelta.requested
      && deltaMagnitude(event.sourceDelta.delta) < 0.005
      && deltaMagnitude(event.sourceDelta.requested) >= 0.02;
    sourceCard.innerHTML = `
      <div class="impact-card-title">Source Delta · ${escapeHtml(sourceEnt ? sourceEnt.name : event.source.entityId)}</div>
      ${clippedSource ? `<div class="impact-note warn">Requested source change was clipped by state limits (boundary saturation). Showing applied before/after.</div>` : ""}
      ${renderDeltaRows(event.sourceDelta.before, event.sourceDelta.after)}
      ${event.sourceDelta.requested ? `<div class="impact-note">Requested (pre-clamp): ${escapeHtml(formatDeltaSentence(event.sourceDelta.requested, { topOnly: 4 }))}</div>` : ""}
    `;
    wrap.appendChild(sourceCard);

    const transferCard = document.createElement("div");
    transferCard.className = "impact-card";
    transferCard.innerHTML = `<div class="impact-card-title">Transfers</div>`;

    if (event.transfers.length === 0){
      const none = document.createElement("div");
      none.className = "help";
      none.style.margin = "0";
      none.textContent = "No propagated deltas exceeded threshold.";
      transferCard.appendChild(none);
    } else {
      event.transfers
        .slice()
        .sort((a,b) => b.intensity - a.intensity)
        .forEach(tr => {
          const item = document.createElement("div");
          item.className = "transfer-item";
          item.innerHTML = `
            <div class="row" style="justify-content:space-between; align-items:flex-start; gap:8px;">
              <span><span class="k">${escapeHtml(tr.fromId)}</span> → <span class="k">${escapeHtml(tr.targetId)}</span></span>
              <span class="pill">${escapeHtml(tr.outcome)}</span>
            </div>
            <div class="transfer-meta">channel: <strong>${escapeHtml(tr.edge.channel)}</strong> · coupling ${formatNum(tr.edge.coupling)} · resistance ${formatNum(tr.edge.resistance)} · delay ${tr.pathDelayMs}ms · intensity ${formatNum(tr.intensity)}</div>
            <div class="transfer-delta">${formatDeltaSentence(tr.delta)}</div>
          `;
          transferCard.appendChild(item);
        });
    }
    wrap.appendChild(transferCard);

    const resistCard = document.createElement("div");
    resistCard.className = "impact-card";
    resistCard.innerHTML = `<div class="impact-card-title">Blocked / No-Effect</div>`;
    if (!event.nonEffects.length){
      const none = document.createElement("div");
      none.className = "help";
      none.style.margin = "0";
      none.textContent = "No blocked targets recorded for this event.";
      resistCard.appendChild(none);
    } else {
      for (const nf of event.nonEffects){
        const row = document.createElement("div");
        row.className = "transfer-item blocked";
        row.innerHTML = `
          <div class="row" style="justify-content:space-between; gap:8px;">
            <span><span class="k">${escapeHtml(nf.fromId)}</span> → <span class="k">${escapeHtml(nf.targetId)}</span></span>
            <span class="pill">${escapeHtml(nf.reasonCode)}</span>
          </div>
          <div class="transfer-meta">${escapeHtml(nf.reason)} · channel ${escapeHtml(nf.edge.channel)} · resistance ${formatNum(nf.edge.resistance)} · delay ${nf.pathDelayMs}ms</div>
        `;
        resistCard.appendChild(row);
      }
    }
    wrap.appendChild(resistCard);

    if (event.suggestions && event.suggestions.length){
      const sug = document.createElement("div");
      sug.className = "impact-card";
      sug.innerHTML = `<div class="impact-card-title">Suggested Next Moves</div>`;
      for (const s of event.suggestions){
        const row = document.createElement("div");
        row.className = "suggestion-item";
        row.textContent = s;
        sug.appendChild(row);
      }
      wrap.appendChild(sug);
    }

    elImpactPanel.appendChild(wrap);
  }

  function renderDeltaRows(before, after){
    return STATE_DIMS.map(dim => {
      const b = before[dim];
      const a = after[dim];
      const d = a - b;
      const cls = d >= 0 ? "up" : "down";
      return `
        <div class="delta-row">
          <div class="dim">${escapeHtml(shortDim(dim))}</div>
          <div class="bar"><div class="fill before" style="width:${Math.round(b*100)}%"></div><div class="fill after" style="width:${Math.round(a*100)}%"></div></div>
          <div class="vals">${formatNum(b)} → ${formatNum(a)} <span class="delta ${cls}">${formatSigned(d)}</span></div>
        </div>
      `;
    }).join("");
  }

  // -----------------------------
  // Ripple / Audit / Tick (Beta causal pipeline)
  // -----------------------------
  function triggerRipple(vector, origin = "manual"){
    if (!selectedEntity) return;
    const sc = getScenario();
    const ent = sc.entities.find(e => e.id === selectedEntity);
    if (!ent) return;

    const event = computeRippleEvent(ent.id, vector, origin);

    auditLog.unshift(event);
    viewedEventId = event.eventId;

    tick++;
    elTickLabel.textContent = String(tick);

    renderAll();
    setWorldtext(event.worldtext, { mode: "ripple", event });
    playEventVisuals(event);
  }

  function computeRippleEvent(sourceId, vector, origin){
    const sc = getScenario();
    const sourceEnt = sc.entities.find(e => e.id === sourceId);
    const sourceRT = runtime.entities[sourceId];
    if (!sourceEnt || !sourceRT) throw new Error("Missing source entity runtime state.");

    const eventTick = tick;
    const now = new Date();
    const sourceBefore = cloneState(sourceRT.state);
    const sourceDeltaValues = computeSourceDelta(sourceEnt, vector, eventTick);
    const sourceAfter = applyDeltaToState(sourceRT.state, sourceDeltaValues);

    sourceRT.state = sourceAfter;
    sourceRT.io.out += 1;
    sourceRT.lastImpact = { vector, intensity: clamp(deltaMagnitude(sourceDeltaValues), 0.05, 1), tick: eventTick };

    const transfers = [];
    const nonEffects = [];
    const visitedEdges = new Set();

    const sourceImpulse = clamp(deltaMagnitude(sourceDeltaValues) * 0.92, 0.12, 1.2);
    const queue = [{ fromId: sourceId, intensity: sourceImpulse, depth: 1, cumulativeDelay: 0, path: [sourceId] }];
    const maxDepth = 2;

    while (queue.length){
      const node = queue.shift();
      if (node.depth > maxDepth) continue;
      const fromEnt = sc.entities.find(e => e.id === node.fromId);
      if (!fromEnt) continue;

      for (const targetId of (fromEnt.adjacentTo || [])){
        if (node.path.includes(targetId)) continue;
        const directedKey = `${node.fromId}->${targetId}`;
        if (visitedEdges.has(`${directedKey}@${node.depth}`)) continue;
        visitedEdges.add(`${directedKey}@${node.depth}`);

        const edge = runtime.edgesByKey[directedKey];
        if (!edge) continue;

        const targetEnt = sc.entities.find(e => e.id === targetId);
        const targetRT = runtime.entities[targetId];
        if (!targetEnt || !targetRT) continue;

        const transferResult = computeTransfer(node, edge, targetEnt, targetRT.state, vector, eventTick);
        if (!transferResult.applied){
          nonEffects.push({
            fromId: node.fromId,
            targetId,
            depth: node.depth,
            path: node.path.concat([targetId]),
            pathDelayMs: node.cumulativeDelay + edge.delayMs,
            reasonCode: transferResult.reasonCode,
            reason: transferResult.reason,
            edge: snapshotEdge(edge, transferResult.channel)
          });
          continue;
        }

        targetRT.state = transferResult.after;
        targetRT.io.in += 1;
        runtime.entities[node.fromId].io.out += (node.depth > 1 ? 1 : 0);
        targetRT.lastImpact = { vector, intensity: transferResult.intensity, tick: eventTick };

        transfers.push({
          fromId: node.fromId,
          targetId,
          depth: node.depth,
          path: node.path.concat([targetId]),
          pathDelayMs: node.cumulativeDelay + edge.delayMs,
          edge: snapshotEdge(edge, transferResult.channel),
          intensity: round3(transferResult.intensity),
          before: transferResult.before,
          after: transferResult.after,
          delta: transferResult.delta,
          outcome: transferResult.outcome,
          evidence: transferResult.evidence
        });

        if (node.depth < maxDepth && transferResult.intensity >= 0.11){
          queue.push({
            fromId: targetId,
            intensity: transferResult.intensity * (node.depth === 1 ? 0.65 : 0.5),
            depth: node.depth + 1,
            cumulativeDelay: node.cumulativeDelay + edge.delayMs,
            path: node.path.concat([targetId])
          });
        }
      }
    }

    const sourceDelta = {
      before: sourceBefore,
      after: sourceAfter,
      requested: roundStateDelta(sourceDeltaValues),
      delta: roundStateDelta(diffState(sourceBefore, sourceAfter))
    };

    const event = {
      eventId: `evt-${String(++eventCounter).padStart(5, "0")}`,
      tick: eventTick,
      scenarioId: currentScenario,
      source: { entityId: sourceId, vector },
      origin,
      timestamp: now.toISOString(),
      timestampLocal: now.toLocaleTimeString(),
      sourceDelta,
      transfers,
      nonEffects,
      promptProvenance: null,
      promptMaterials: null,
      suggestions: [],
      worldtext: "",
    };

    attachPromptMaterials(event, sc);
    event.suggestions = suggestNextMoves(event, sc);
    event.worldtext = generateWorldtextFromEvent(event, sc);

    return event;
  }

  function playEventVisuals(event){
    clearReplayTimers();

    const vector = event.source.vector;
    rippleAtEntity(event.source.entityId, vector, 1.0);

    for (const tr of event.transfers){
      const delay = tr.pathDelayMs;
      scheduleReplay(() => {
        pulseEdge(tr.fromId, tr.targetId, vector, tr.intensity, tr.outcome);
        rippleAtEntity(tr.targetId, vector, clamp(0.35 + tr.intensity * 0.85, 0.35, 1.0));
      }, delay);
    }

    for (const nf of event.nonEffects){
      scheduleReplay(() => {
        pulseEdge(nf.fromId, nf.targetId, vector, 0.15, "blocked", true);
      }, nf.pathDelayMs);
    }
  }

  function scheduleReplay(fn, delay){
    const t = window.setTimeout(fn, Math.max(0, delay));
    replayTimers.push(t);
  }

  function clearReplayTimers(){
    while (replayTimers.length){ clearTimeout(replayTimers.pop()); }
  }

  function rippleAtEntity(entityId, vector, intensity){
    const cell = Array.from(elGrid.querySelectorAll(".grid-cell.has-entity"))
      .find(c => c.dataset.entityId === entityId);
    if (!cell) return;

    const cls = vector.toLowerCase();
    cell.classList.add("flash", cls);
    window.setTimeout(() => cell.classList.remove("flash", cls), 420);

    for (let i = 0; i < 2; i++){
      const ring = document.createElement("div");
      ring.className = `ripple-ring ${cls}`;
      ring.style.opacity = String(clamp(0.35 + 0.55 * intensity, 0.25, 1));
      ring.style.animationDelay = `${i * 110}ms`;
      ring.style.transform = `translate(-50%,-50%) scale(${0.5 + i*0.05})`;
      cell.appendChild(ring);
      window.setTimeout(() => ring.remove(), 1700);
    }
  }

  function pulseEdge(fromId, toId, vector, intensity, outcome, blocked = false){
    const g = linkGeometry[`${fromId}->${toId}`];
    if (!g) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(g.x1));
    line.setAttribute("y1", String(g.y1));
    line.setAttribute("x2", String(g.x2));
    line.setAttribute("y2", String(g.y2));
    line.classList.add("pulse-line", vector.toLowerCase());
    if (blocked) line.classList.add("blocked");
    if (outcome === "amplified") line.classList.add("amplified");
    if (outcome === "rerouted") line.classList.add("rerouted");
    line.style.setProperty("--pulse-opacity", String(clamp(0.25 + intensity * 0.9, 0.2, 1)));
    line.style.setProperty("--edge-dur", `${Math.round(700 + intensity * 700)}ms`);
    elLinkPulses.appendChild(line);

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", String(g.x2));
    dot.setAttribute("cy", String(g.y2));
    dot.setAttribute("r", String(clamp(2 + intensity * 5, 2, 7)));
    dot.classList.add("pulse-dot", vector.toLowerCase());
    if (blocked) dot.classList.add("blocked");
    dot.style.setProperty("--pulse-opacity", String(clamp(0.25 + intensity * 0.9, 0.2, 1)));
    elLinkPulses.appendChild(dot);

    const ttl = 1500;
    window.setTimeout(() => { line.remove(); dot.remove(); }, ttl);
  }

  function renderAuditLog(){
    elAuditLog.innerHTML = "";

    if (auditLog.length === 0){
      const d = document.createElement("div");
      d.className = "help";
      d.textContent = "No events yet. Trigger GOAL / OBSTACLE / SHIFT to see auditable source and target deltas. Entries are replayable and causal.";
      elAuditLog.appendChild(d);
      return;
    }

    const grouped = groupAuditEntries(auditLog, 40);
    for (const group of grouped){
      const entry = group.latest;
      const item = document.createElement("div");
      item.className = "audit-item" + (entry.eventId === viewedEventId ? " selected" : "");

      const color = vectorColorStyle(entry.source.vector);
      const topTransfer = entry.transfers.slice().sort((a,b) => b.intensity - a.intensity)[0];
      item.innerHTML = `
        <div class="row" style="justify-content:space-between;">
          <span><span class="k">T${entry.tick}</span> ${escapeHtml(entry.source.entityId)} → <span style="${color}">${escapeHtml(entry.source.vector)}</span></span>
          <span class="help" style="margin:0;">${escapeHtml(entry.timestampLocal)}</span>
        </div>
        <div class="audit-meta-line">${entry.transfers.length} affected · ${entry.nonEffects.length} blocked/no-effect · ${escapeHtml(entry.origin)} · ${escapeHtml(entry.scenarioId)}${group.count > 1 ? ` · repeat ×${group.count}` : ""}</div>
        ${group.count > 1 ? `<div class="audit-meta-line">cluster: T${group.latest.tick} → T${group.oldest.tick}</div>` : ""}
        <div class="audit-meta-line">${topTransfer ? `strongest: ${escapeHtml(topTransfer.fromId)}→${escapeHtml(topTransfer.targetId)} ${escapeHtml(topTransfer.edge.channel)} (${formatNum(topTransfer.intensity)})` : "no propagated transfer recorded"}</div>
      `;

      item.addEventListener("click", () => focusEvent(entry.eventId, { replay: true }));
      elAuditLog.appendChild(item);
    }
  }

  function groupAuditEntries(entries, maxGroups = 40){
    const groups = [];
    for (const entry of entries){
      const topTransfer = entry.transfers.slice().sort((a,b) => b.intensity - a.intensity)[0];
      const sig = [
        entry.source.entityId,
        entry.source.vector,
        entry.origin,
        entry.scenarioId,
        entry.transfers.length,
        entry.nonEffects.length,
        topTransfer ? `${topTransfer.fromId}->${topTransfer.targetId}:${topTransfer.edge.channel}:${Math.round(topTransfer.intensity*100)}` : "none"
      ].join("|");

      const prev = groups[groups.length - 1];
      if (prev && prev.signature === sig){
        prev.count += 1;
        prev.oldest = entry;
      } else {
        groups.push({
          signature: sig,
          latest: entry,
          oldest: entry,
          count: 1
        });
      }
      if (groups.length >= maxGroups) break;
    }
    return groups;
  }

  function focusEvent(eventId, opts = {}){
    const event = auditLog.find(e => e.eventId === eventId);
    if (!event) return;
    viewedEventId = event.eventId;
    selectedEntity = event.source.entityId;
    renderAll();
    setWorldtext(event.worldtext, { mode: "ripple", event });
    if (opts.replay) playEventVisuals(event);
  }

  // -----------------------------
  // LLM Workbench (export only)
  // -----------------------------
  function openLlmDrawer(){
    document.body.classList.add("llm-open");
    elLlmDrawer.setAttribute("aria-hidden", "false");
    syncBackdropState();
    updateLlmWorkbench({ quiet: true });
  }

  function closeLlmDrawer(){
    document.body.classList.remove("llm-open");
    elLlmDrawer.setAttribute("aria-hidden", "true");
    syncBackdropState();
  }

  function populateLlmPerspectiveOptions(event){
    const prev = elLlmPerspectiveSelect.value;
    const options = [];
    if (!event){
      options.push({ value: "source", label: "source" });
    } else {
      options.push({ value: "source", label: `source · ${event.source.entityId}` });
      for (const tr of event.transfers.slice(0, 8)){
        options.push({ value: `target:${tr.targetId}`, label: `target · ${tr.targetId}` });
      }
      if (event.nonEffects.length){
        options.push({ value: "resistance_field", label: `resistance field · ${event.nonEffects.length} blocked` });
      }
    }

    elLlmPerspectiveSelect.innerHTML = "";
    for (const o of options){
      const opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      elLlmPerspectiveSelect.appendChild(opt);
    }
    if (options.some(o => o.value === prev)) elLlmPerspectiveSelect.value = prev;
  }

  function buildLlmSystemPrompt(event){
    const mode = elLlmModeSelect.value;
    const style = elLlmStyleSelect.value;
    const styleInstr = style === "poetic"
      ? "Use a mask lens with sensory intensity, but do not invent causal changes absent from the record."
      : style === "hybrid"
      ? "Use Angel+Mask: explicit causal evidence first, then perspective-locked sensation and tension."
      : "Prioritize clarity for a time-constrained operator. Be specific, auditable, and easy to parse.";

    const modeInstr = mode === "angel_trace"
      ? "Trace a recursive Therefore Chain (L1 material -> L2 edge transfer -> L3 field consequence -> L4 mask perspective). No leapfrogging."
      : mode === "audit_causal"
      ? "Write an audit-grade causal summary from the structured event. Distinguish applied transfers from blocked/no-effect paths."
      : mode === "raw_json"
      ? "Interpret the event JSON directly. State what is measured vs inferred and note contradictions or blind spots."
      : "Generate perspective-locked worldtext from the event record, with concrete evidence, channels, delays, and one unresolved ambiguity.";

    return [
      "You are the Angel of Ripples for RIPPLES, a causal worldtext instrument.",
      "Treat the structured event record as the source of truth.",
      "Do not claim transfers or state changes not present in the event.",
      "When relevant, distinguish measured source deltas from inferred/projected downstream effects.",
      styleInstr,
      modeInstr,
      event ? `Current scene: ${event.scenarioId}. Current event: ${event.eventId}.` : "No event selected yet."
    ].join(" ");
  }

  function buildLlmUserPayload(event){
    if (!event){
      return "No ripple event yet. Trigger GOAL / OBSTACLE / SHIFT on a selected entity, then rebuild the bundle.";
    }

    const mode = elLlmModeSelect.value;
    const perspective = elLlmPerspectiveSelect.value;
    const stone = (elLlmStoneInput.value || "").trim();
    const topTransfer = event.transfers.slice().sort((a,b) => b.intensity - a.intensity)[0] || null;
    const blocked = event.nonEffects[0] || null;
    const sourceDeltaSummary = formatDeltaSentence(event.sourceDelta.delta, { topOnly: 4 });

    let perspectiveSnapshot = `source ${event.source.entityId} under ${event.source.vector}; source delta ${sourceDeltaSummary}.`;
    if (perspective.startsWith("target:")){
      const targetId = perspective.split(":")[1];
      const tr = event.transfers.find(t => t.targetId === targetId);
      if (tr){
        perspectiveSnapshot = `target ${tr.targetId}; path ${tr.path.join(" -> ")}; channel ${tr.edge.channel}; delay ${tr.pathDelayMs}ms; intensity ${formatNum(tr.intensity)}; outcome ${tr.outcome}; strongest target evidence ${tr.evidence.strongestDim} ${formatSigned(tr.delta[tr.evidence.strongestDim] || 0)}.`;
      }
    } else if (perspective === "resistance_field" && blocked){
      perspectiveSnapshot = `resistance field view; blocked path ${blocked.fromId} -> ${blocked.targetId}; channel ${blocked.edge.channel}; resistance ${formatNum(blocked.edge.resistance)}; reason ${blocked.reasonCode}.`;
    }

    const payloadEvent = JSON.parse(JSON.stringify(event));
    payloadEvent.worldtext = event.worldtext || "";

    return [
      "RIPPLES LLM PACKAGE",
      `Mode: ${mode}`,
      `Style: ${elLlmStyleSelect.value}`,
      `Perspective: ${perspective}`,
      stone ? `Stone: ${stone}` : null,
      "",
      "PERSPECTIVE SNAPSHOT",
      perspectiveSnapshot,
      "",
      "OPERATOR PARSING ORDER",
      "1. Source delta",
      "2. Transfers (channel, intensity, delay, resistance)",
      "3. Blocked / no-effect paths",
      "4. Worldtext as interpretation",
      "",
      "TOP SIGNALS",
      `Source: ${event.source.entityId} -> ${event.source.vector} at T${event.tick}`,
      `Source delta: ${sourceDeltaSummary}`,
      `Top transfer: ${topTransfer ? `${topTransfer.fromId}->${topTransfer.targetId} via ${topTransfer.edge.channel} (${formatNum(topTransfer.intensity)})` : "none"}`,
      `Blocked path: ${blocked ? `${blocked.fromId}->${blocked.targetId} via ${blocked.edge.channel} (${blocked.reasonCode})` : "none"}`,
      `Suggestions: ${(event.suggestions || []).join(" | ") || "none"}`,
      "",
      "PROMPT PROVENANCE",
      JSON.stringify(event.promptProvenance || {}, null, 2),
      "",
      "EVENT JSON",
      JSON.stringify(payloadEvent, null, 2),
      "",
      "OUTPUT REQUIREMENTS",
      "- Cite concrete evidence from the event record.",
      "- Name at least one channel and one delay/resistance condition.",
      "- Distinguish blocked/no-effect paths from applied transfers.",
      "- End with one next move for the World Jockey."
    ].filter(Boolean).join("\n");
  }

  function buildLlmBundle(event){
    const systemPrompt = buildLlmSystemPrompt(event);
    const userPrompt = buildLlmUserPayload(event);
    const bundleMode = elLlmBundleModeSelect.value;
    const copyPayload = bundleMode === "prompt_only"
      ? userPrompt
      : bundleMode === "json_only"
      ? (event ? JSON.stringify(event, null, 2) : "{}")
      : `SYSTEM PROMPT\n${systemPrompt}\n\nUSER PROMPT\n${userPrompt}`;

    return {
      systemPrompt,
      userPrompt,
      eventJson: event ? JSON.stringify(event, null, 2) : "",
      copyPayload,
    };
  }

  function updateLlmWorkbench(opts = {}){
    const event = getFocusedEvent();
    populateLlmPerspectiveOptions(event);
    const bundle = buildLlmBundle(event);
    elLlmSystemPrompt.value = bundle.systemPrompt;
    elLlmEventJson.value = bundle.eventJson || "No ripple event yet.";
    elLlmBundleText.value = bundle.copyPayload;

    if (!opts.quiet){
      elLlmStatusLine.textContent = event
        ? `Loaded ${event.eventId} (${event.source.entityId} · ${event.source.vector}) · ${event.transfers.length} transfers · ${event.nonEffects.length} blocked/no-effect.`
        : "No event selected yet. Trigger GOAL / OBSTACLE / SHIFT to generate a causal event package.";
    }
  }

  async function copyLlmText(text, label){
    if (!text){
      elLlmStatusLine.textContent = `${label} is empty. Trigger an event first.`;
      return;
    }
    try{
      await navigator.clipboard.writeText(text);
      elLlmStatusLine.textContent = `${label} copied.`;
    }catch(_err){
      elLlmStatusLine.textContent = `Clipboard blocked. Select and copy ${label.toLowerCase()} manually.`;
    }
  }

  function vectorColorStyle(vec){
    if (vec === "GOAL") return "color: var(--term-gold)";
    if (vec === "OBSTACLE") return "color: var(--term-alert)";
    if (vec === "SHIFT") return "color: var(--term-cyan)";
    return "";
  }

  // -----------------------------
  // Autoplay
  // -----------------------------
  function toggleAutoplay(){
    isAutoplay = !isAutoplay;
    elAutoplayToggle.classList.toggle("on", isAutoplay);
    elAutoplayToggle.setAttribute("aria-checked", String(isAutoplay));

    if (isAutoplay) startAutoplay();
    else stopAutoplay();
  }

  function restartAutoplay(){
    if (!isAutoplay) return;
    stopAutoplay();
    startAutoplay();
  }

  function startAutoplay(){
    if (!selectedEntity){
      const ents = getScenario().entities;
      if (ents[0]) selectEntity(ents[0].id);
    }

    const bpm = clamp(parseInt(elBpmSlider.value, 10), 6, 60);
    elBpmLabel.textContent = String(bpm);

    const intervalMs = Math.round(60000 / bpm);

    secondsToNext = Math.ceil(intervalMs / 1000);
    elCountdownPill.style.display = "inline-block";
    elCountdownPill.textContent = `NEXT: ${secondsToNext}s`;

    countdownTimer = setInterval(() => {
      secondsToNext = Math.max(0, secondsToNext - 1);
      elCountdownPill.textContent = `NEXT: ${secondsToNext}s`;
    }, 1000);

    autoplayTimer = setInterval(() => {
      secondsToNext = Math.ceil(intervalMs / 1000);
      elCountdownPill.textContent = `NEXT: ${secondsToNext}s`;

      const { entityId, vector } = chooseAmbientMove();
      selectedEntity = entityId;
      triggerRipple(vector, "autoplay");
    }, intervalMs);
  }

  function stopAutoplay(){
    clearInterval(autoplayTimer);
    clearInterval(countdownTimer);
    autoplayTimer = null;
    countdownTimer = null;
    elCountdownPill.style.display = "none";
  }

  function chooseAmbientMove(){
    const sc = getScenario();
    const pool = (sc.ambientBehaviors && sc.ambientBehaviors.length)
      ? sc.ambientBehaviors
      : sc.entities.map(e => ({ entity: e.id, vector: "SHIFT", probability: 1/sc.entities.length }));

    const total = pool.reduce((a,b) => a + (b.probability || 0), 0) || 1;
    let r = Math.random() * total;

    for (const item of pool){
      r -= (item.probability || 0);
      if (r <= 0) return { entityId: item.entity, vector: item.vector };
    }
    return { entityId: pool[0].entity, vector: pool[0].vector };
  }

  // -----------------------------
  // Causal engine helpers
  // -----------------------------
  function createScenarioRuntime(sc, scenarioId){
    const entities = {};
    for (const ent of sc.entities){
      entities[ent.id] = {
        state: makeInitialState(ent, scenarioId),
        io: { in: 0, out: 0 },
        lastImpact: null,
      };
    }

    const edges = [];
    const edgesByKey = {};
    for (const ent of sc.entities){
      for (const adjId of (ent.adjacentTo || [])){
        const target = sc.entities.find(e => e.id === adjId);
        if (!target) continue;
        const edge = buildEdge(ent, target, scenarioId);
        edges.push(edge);
        edgesByKey[`${edge.from}->${edge.to}`] = edge;
      }
    }

    return { entities, edges, edgesByKey };
  }

  function makeInitialState(ent, scenarioId){
    const base = TYPE_BASE_STATE[ent.type] || TYPE_BASE_STATE.abstract;
    const out = {};
    for (const dim of STATE_DIMS){
      const jitter = seededRange(`${scenarioId}:${ent.id}:${dim}:init`, -0.12, 0.12);
      out[dim] = clamp(base[dim] + jitter, 0.02, 0.98);
    }
    return roundState(out);
  }

  function buildEdge(fromEnt, toEnt, scenarioId){
    const key = `${scenarioId}:${fromEnt.id}->${toEnt.id}`;
    const channels = inferEdgeChannels(fromEnt, toEnt, scenarioId);
    const couplingBase = seededRange(`${key}:c`, 0.22, 0.72);
    const resistanceBase = seededRange(`${key}:r`, 0.10, 0.82);
    const delayMs = Math.round(seededRange(`${key}:d`, 150, 420));

    // Make direct adjacency feel stronger in cupboard and key signal/light pairs.
    let coupling = couplingBase;
    let resistance = resistanceBase;
    if ((fromEnt.id.includes("light") || toEnt.id.includes("light") || fromEnt.id.includes("shadow") || toEnt.id.includes("shadow"))){
      coupling += 0.08;
      resistance -= 0.06;
    }
    if (fromEnt.type === "animate" && toEnt.type === "inanimate") coupling += 0.04;
    if (fromEnt.type === "inanimate" && toEnt.type === "animate") resistance += 0.03;

    return {
      from: fromEnt.id,
      to: toEnt.id,
      coupling: round3(clamp(coupling, 0.12, 0.95)),
      resistance: round3(clamp(resistance, 0.05, 0.92)),
      delayMs,
      channels,
    };
  }

  function inferEdgeChannels(fromEnt, toEnt, scenarioId){
    const pool = new Set(["proximity", "contact"]);
    const text = `${scenarioId} ${fromEnt.id} ${toEnt.id} ${fromEnt.name} ${toEnt.name}`.toLowerCase();

    if (/(ant|rat|raccoon|deer|pigeon|owl)/.test(text)) { pool.add("scent"); pool.add("pressure"); }
    if (/(dust|light|moonlight|traffic-light|shadow|graffiti)/.test(text)) { pool.add("signal"); pool.add("light"); }
    if (/(shadow)/.test(text)) { pool.add("shadow"); }
    if (/(glass|rain|puddle|mold|moist|wallpaper)/.test(text)) { pool.add("moisture"); pool.add("residue"); }
    if (/(mycelium|seedling|ivy|weed|mold)/.test(text)) { pool.add("growth"); pool.add("root"); pool.add("spore"); }
    if (/(door|plates|oak|fallen-oak)/.test(text)) { pool.add("surface-contact"); }
    if (/(light|moonlight|traffic-light|concrete|urban)/.test(text)) { pool.add("heat"); pool.add("reflection"); }
    if (/(rain|wind|dust|air)/.test(text)) { pool.add("current"); }
    if (/(door|wallpaper|ivy|rain)/.test(text)) { pool.add("ingress"); }
    if (/(traffic|owl|graffiti)/.test(text)) { pool.add("noise"); }

    const list = Array.from(pool);
    const chosen = [];
    const count = 2;
    for (let i=0; i<count && list.length; i++){
      const idx = Math.floor(seededRange(`${scenarioId}:${fromEnt.id}->${toEnt.id}:ch:${i}`, 0, list.length));
      chosen.push(list.splice(idx, 1)[0]);
    }
    return chosen.length ? chosen : ["contact"];
  }

  function computeSourceDelta(ent, vector, eventTick){
    const base = VECTOR_BASE_DELTA[vector] || VECTOR_BASE_DELTA.SHIFT;
    const bias = (TYPE_VECTOR_BIAS[ent.type] && TYPE_VECTOR_BIAS[ent.type][vector]) || {};
    const delta = {};

    for (const dim of STATE_DIMS){
      const noise = seededRange(`${currentScenario}:${ent.id}:${vector}:${eventTick}:${dim}:src`, -0.035, 0.035);
      delta[dim] = round3(clamp((base[dim] || 0) + (bias[dim] || 0) + noise, -0.28, 0.28));
    }
    return delta;
  }

  function computeTransfer(node, edge, targetEnt, targetState, vector, eventTick){
    const channel = pickDeterministic(edge.channels, `${edge.from}->${edge.to}:${vector}:${eventTick}:channel`);
    const channelBias = CHANNEL_DIM_BIAS[channel] || CHANNEL_DIM_BIAS.contact;

    const rawIntensity = node.intensity * edge.coupling * (1 - edge.resistance) * (node.depth === 1 ? 1 : 0.72);
    const intensity = clamp(rawIntensity, 0, 1.1);

    if (intensity < 0.04){
      return {
        applied: false,
        reasonCode: "below_threshold",
        reason: "transfer decayed below visible threshold",
        channel
      };
    }

    const vectorBase = VECTOR_BASE_DELTA[vector] || VECTOR_BASE_DELTA.SHIFT;
    const delta = {};
    let absSum = 0;

    for (const dim of STATE_DIMS){
      const v = vectorBase[dim] || 0;
      const ch = channelBias[dim] || 0;
      const noise = seededRange(`${edge.from}->${edge.to}:${vector}:${eventTick}:${dim}:tr`, -0.02, 0.02);
      let d = (v * 0.35 + ch * 0.65) * intensity + noise * Math.max(0.25, intensity);

      if (vector === "OBSTACLE" && (dim === "stability" || dim === "resource")) d -= 0.03 * intensity;
      if (vector === "GOAL" && (dim === "resource" || dim === "activity")) d += 0.03 * intensity;
      if (vector === "SHIFT" && dim === "signal") d += 0.05 * intensity;

      delta[dim] = round3(clamp(d, -0.20, 0.20));
      absSum += Math.abs(delta[dim]);
    }

    if (absSum < 0.03){
      return {
        applied: false,
        reasonCode: "insufficient_delta",
        reason: "channel activated but produced negligible state change",
        channel
      };
    }

    const before = cloneState(targetState);
    const after = applyDeltaToState(targetState, delta);
    const netShift = stateDistance(before, after);

    let outcome = "dampened";
    if (intensity >= 0.38 && edge.resistance <= 0.35) outcome = "amplified";
    else if (channel === "signal" || channel === "reflection" || channel === "shadow") outcome = "rerouted";
    else if (intensity < 0.10 || edge.resistance > 0.7) outcome = "mostly_blocked";

    return {
      applied: true,
      intensity: round3(intensity),
      before,
      after,
      delta: roundStateDelta(delta),
      outcome,
      evidence: {
        netShift: round3(netShift),
        strongestDim: strongestDeltaDim(delta),
      },
      channel
    };
  }

  function snapshotEdge(edge, channel){
    return {
      coupling: edge.coupling,
      channel,
      delayMs: edge.delayMs,
      resistance: edge.resistance
    };
  }

  function attachPromptMaterials(event, sc){
    const sourceId = event.source.entityId;
    const vector = event.source.vector;

    const entitySeedId = `${event.scenarioId}.${sourceId}.${vector.toLowerCase()}.v1`;
    const entitySeedText = ((sc.latent[sourceId] || {})[vector]) || `${sourceId} receives ${vector}. Describe state change in concrete terms.`;

    const edgePrompts = event.transfers.map(tr => ({
      id: `${event.scenarioId}.${tr.fromId}.${vector.toLowerCase()}.to.${tr.targetId}.v1`,
      fromId: tr.fromId,
      targetId: tr.targetId,
      text: `Given ${tr.fromId} receives ${vector}, model transfer into ${tr.targetId} via ${tr.edge.channel}. First visible change after ~${tr.pathDelayMs}ms. Coupling ${tr.edge.coupling}, resistance ${tr.edge.resistance}. Show before/after in at least one state dimension and a concrete sign.`
    }));

    const chainPrompts = [];
    const multiHop = event.transfers.filter(tr => tr.depth > 1);
    for (const tr of multiHop.slice(0, 3)){
      chainPrompts.push({
        id: `${event.scenarioId}.chain.${tr.path.join("-")}.${vector.toLowerCase()}.v1`,
        path: tr.path,
        text: `Trace ${vector} across ${tr.path.join(" -> ")}. Name the handoff mechanism at each hop, where the transfer dampens or amplifies, and how the final target differs from the source effect.`
      });
    }

    const counterfactualPrompts = event.nonEffects.slice(0, 3).map(nf => ({
      id: `${event.scenarioId}.counterfactual.${nf.fromId}.to.${nf.targetId}.${vector.toLowerCase()}.v1`,
      fromId: nf.fromId,
      targetId: nf.targetId,
      text: `Explain why ${nf.fromId} + ${vector} failed to move ${nf.targetId}. Use channel ${nf.edge.channel}, resistance ${nf.edge.resistance}, delay ${nf.pathDelayMs}ms. What would need to change for a visible effect?`
    }));

    const auditPrompt = {
      id: "audit.causal-summary.v1",
      text: `Write from the source entity perspective, but cite evidence from the event record: source delta, affected targets, channels, delays, blocked transfers, and one unresolved ambiguity. Do not claim effects the log does not contain.`
    };

    event.promptProvenance = {
      entitySeedId,
      edgePromptIds: edgePrompts.map(p => p.id),
      chainPromptIds: chainPrompts.map(p => p.id),
      counterfactualPromptIds: counterfactualPrompts.map(p => p.id),
      auditPromptId: auditPrompt.id,
    };

    event.promptMaterials = {
      entitySeed: { id: entitySeedId, text: entitySeedText },
      edgePrompts,
      chainPrompts,
      counterfactualPrompts,
      auditPrompt
    };
  }

  function suggestNextMoves(event, sc){
    const out = [];
    const top = event.transfers.slice().sort((a,b) => b.intensity - a.intensity)[0];
    if (top){
      out.push(`Select ${top.targetId} next and try SHIFT to test whether the ${top.edge.channel} transfer amplifies or re-routes.`);
    }
    const blocked = event.nonEffects[0];
    if (blocked){
      out.push(`Probe ${blocked.targetId} with GOAL or SHIFT; current ${blocked.edge.channel} path from ${blocked.fromId} is blocked (${blocked.reasonCode}).`);
    }
    const sourceEnt = sc.entities.find(e => e.id === event.source.entityId);
    if (sourceEnt){
      const altVec = ["GOAL", "OBSTACLE", "SHIFT"].find(v => v !== event.source.vector) || "SHIFT";
      out.push(`Re-trigger ${sourceEnt.id} with ${altVec} to compare source delta against T${event.tick}.`);
    }
    return out.slice(0, 3);
  }

  function generateWorldtextFromEvent(event, sc){
    const ent = sc.entities.find(e => e.id === event.source.entityId);
    const seed = (sc.latent[event.source.entityId] && sc.latent[event.source.entityId][event.source.vector]) || "";
    const before = event.sourceDelta.before;
    const after = event.sourceDelta.after;
    const sourceDeltaSentence = formatDeltaSentence(event.sourceDelta.delta, { topOnly: 3 });
    const topTransfers = event.transfers.slice().sort((a,b) => b.intensity - a.intensity).slice(0, 2);
    const blocked = event.nonEffects[0];

    const requestedDeltaSentence = event.sourceDelta.requested
      ? formatDeltaSentence(event.sourceDelta.requested, { topOnly: 3 })
      : sourceDeltaSentence;
    const clippedSource = deltaMagnitude(event.sourceDelta.delta) < 0.005 && event.sourceDelta.requested && deltaMagnitude(event.sourceDelta.requested) >= 0.02;

    const p1 = [];
    const p2 = [];
    const p3 = [];

    p1.push(toFirstPerson(seed || `${ent ? ent.name : event.source.entityId} receives ${event.source.vector}.`, ent));
    p1.push(`This time the change is not only a mood. My applied delta is ${sourceDeltaSentence}. Before and after can be counted: activity ${formatNum(before.activity)}→${formatNum(after.activity)}, stability ${formatNum(before.stability)}→${formatNum(after.stability)}, signal ${formatNum(before.signal)}→${formatNum(after.signal)}.`);
    if (clippedSource){
      p1.push(`The vector requested more (${requestedDeltaSentence}), but my state was already at a boundary, so the change was clipped.`);
    }

    if (topTransfers.length){
      for (const tr of topTransfers){
        const target = sc.entities.find(e => e.id === tr.targetId);
        const targetName = target ? target.name : tr.targetId;
        p2.push(`Through ${tr.edge.channel}, the ripple reaches ${targetName} after about ${tr.pathDelayMs}ms. Intensity ${formatNum(tr.intensity)} under coupling ${formatNum(tr.edge.coupling)} and resistance ${formatNum(tr.edge.resistance)}. The first visible target shift is ${shortDim(tr.evidence.strongestDim)} (${formatSigned(tr.delta[tr.evidence.strongestDim] || 0)}), which reads as ${tr.outcome}.`);
      }
    } else {
      p2.push(`I register a perturbation, but the transfer decays before any neighbor crosses the visible threshold. The event remains local, at least in this pass.`);
    }

    if (blocked){
      p2.push(`One nearby path refuses me: ${blocked.fromId} → ${blocked.targetId} via ${blocked.edge.channel} does not resolve into a visible delta. Perhaps the resistance is too high (${formatNum(blocked.edge.resistance)}), or the channel is wrong for this vector.`);
    }

    if (event.transfers.some(tr => tr.depth > 1)){
      const chain = event.transfers.find(tr => tr.depth > 1);
      if (chain){
        p2.push(`A secondary hop appears along ${chain.path.join(" → ")}. The effect changes character as it travels; the downstream target does not simply mirror my state but receives a transformed version of it.`);
      }
    }

    if (event.suggestions && event.suggestions[0]){
      p3.push(`The next productive move is clear enough to test: ${event.suggestions[0]}`);
    }

    p3.push(`Evidence holds the ambiguity in place. I may be misreading the world, but the record at T${event.tick} still shows where the pressure moved, where it dampened, and where it stopped. (Scene: ${sc.name}. Vector: ${event.source.vector}. Origin: ${event.origin}.)`);

    return [p1.join(" "), p2.join(" "), p3.join(" ")].filter(Boolean).join("\n\n");
  }

  // -----------------------------
  // Prompt corpus helpers (metadata / versioning)
  // -----------------------------
  function ensurePromptCorpus(sc, scenarioId){
    if (sc.promptCorpus && sc.promptCorpus.__scenarioId === scenarioId) return;
    const entitySeeds = {};
    for (const ent of sc.entities){
      entitySeeds[ent.id] = {
        GOAL: { id: `${scenarioId}.${ent.id}.goal.v1` },
        OBSTACLE: { id: `${scenarioId}.${ent.id}.obstacle.v1` },
        SHIFT: { id: `${scenarioId}.${ent.id}.shift.v1` },
      };
    }
    sc.promptCorpus = {
      __scenarioId: scenarioId,
      entitySeeds,
      auditPrompts: { causalSummary: { id: "audit.causal-summary.v1" } }
    };
  }

  // -----------------------------
  // Seed expansion (preview only)
  // -----------------------------
  function expandSeedPreview(seed, ent, vector, sc){
    const uncertainty = ["perhaps", "as if", "it is possible that", "almost", "seems to", "likely", "possibly"];
    const sensory = {
      animate: ["I taste the gradient", "I listen for the edge", "I feel pressure shift", "I follow residue", "I measure distance by effort"],
      inanimate: ["I register contact", "I hold temperature", "I accumulate film", "I resist abrasion", "I reflect what passes"],
      abstract: ["I spread", "I thin", "I modulate", "I refract", "I cycle"],
    };
    const motifs = {
      GOAL: ["move toward", "seek", "align with", "close distance to", "track"],
      OBSTACLE: ["press against", "get blocked by", "get refused by", "get scraped by", "get misled by"],
      SHIFT: ["become", "re-tune", "relabel", "invert", "turn into"],
    };

    const entityType = ent?.type || "abstract";
    const s = sensory[entityType] || sensory.abstract;
    const vecMotifs = motifs[vector] || motifs.SHIFT;

    const base = (seed || "").trim();
    const lead = base.length ? base : `${ent?.name || "The entity"} experiences a perturbation.`;
    const ctx = `Scene: ${sc.name}. Vector: ${vector}.`;

    const sentences = [];
    sentences.push(toFirstPerson(lead, ent));
    for (let i=0; i<4; i++){
      sentences.push(`${capitalize(pick(s))}; I ${pick(vecMotifs)} a boundary that ${pick(uncertainty)} was already shifting.`);
    }
    sentences.push(`This is a seed preview, not an auditable event. It suggests texture but does not prove transfer. (${ctx})`);

    return sentences.join(" ");
  }

  function toFirstPerson(text, ent){
    if (/\bI\b/.test(text)) return text;
    const name = ent?.name || "the entity";
    return `I am ${name}. ${text}`;
  }

  // -----------------------------
  // Utilities: focused event / formatting
  // -----------------------------
  function getFocusedEvent(){
    if (viewedEventId){
      const found = auditLog.find(e => e.eventId === viewedEventId);
      if (found) return found;
    }
    return auditLog[0] || null;
  }

  function deriveEntityDescriptor(ent, state){
    const top = STATE_DIMS.slice().sort((a,b) => state[b] - state[a])[0];
    const low = STATE_DIMS.slice().sort((a,b) => state[a] - state[b])[0];
    const vocab = {
      activity: state.activity >= 0.55 ? "active" : "still",
      stability: state.stability >= 0.6 ? "stable" : "unsettled",
      exposure: state.exposure >= 0.6 ? "exposed" : "sheltered",
      resource: state.resource >= 0.55 ? "resource-rich" : "resource-thin",
      signal: state.signal >= 0.55 ? "resonant" : "quiet",
    };
    const alt = {
      activity: state.activity < 0.35 ? "dormant" : "engaged",
      stability: state.stability < 0.35 ? "fragile" : "holding",
      exposure: state.exposure < 0.35 ? "screened" : "open",
      resource: state.resource < 0.35 ? "hungry" : "provisioned",
      signal: state.signal < 0.35 ? "muted" : "carrying signal",
    };
    return `${vocab[top]} / ${alt[low]}`;
  }

  function renderMiniStateBars(state){
    return STATE_DIMS.map(dim => {
      const v = Math.round(clamp(state[dim], 0, 1) * 100);
      return `<span class="mini-bar"><i style="width:${v}%"></i></span>`;
    }).join("");
  }

  function formatDeltaSentence(delta, opts = {}){
    const keys = STATE_DIMS
      .map(dim => ({ dim, value: delta[dim] || 0 }))
      .filter(x => Math.abs(x.value) >= 0.005)
      .sort((a,b) => Math.abs(b.value) - Math.abs(a.value));

    const use = (opts.topOnly ? keys.slice(0, opts.topOnly) : keys).map(x => `${shortDim(x.dim)} ${formatSigned(x.value)}`);
    return use.length ? use.join(", ") : "no measurable delta";
  }

  function shortDim(dim){
    return ({
      activity: "activity",
      stability: "stability",
      exposure: "exposure",
      resource: "resource",
      signal: "signal",
    })[dim] || dim;
  }

  function strongestDeltaDim(delta){
    return STATE_DIMS.slice().sort((a,b) => Math.abs((delta[b]||0)) - Math.abs((delta[a]||0)))[0] || "signal";
  }

  function deltaMagnitude(delta){
    let sum = 0;
    for (const dim of STATE_DIMS) sum += Math.abs(delta[dim] || 0);
    return sum / STATE_DIMS.length;
  }

  function stateDistance(a, b){
    let sum = 0;
    for (const dim of STATE_DIMS) sum += Math.abs((a[dim] || 0) - (b[dim] || 0));
    return sum / STATE_DIMS.length;
  }

  function applyDeltaToState(state, delta){
    const next = {};
    for (const dim of STATE_DIMS){
      next[dim] = round3(clamp((state[dim] || 0) + (delta[dim] || 0), 0, 1));
    }
    return next;
  }

  function cloneState(state){
    const out = {};
    for (const dim of STATE_DIMS) out[dim] = round3(state[dim] || 0);
    return out;
  }

  function roundState(state){
    const out = {};
    for (const dim of STATE_DIMS) out[dim] = round3(state[dim] || 0);
    return out;
  }

  function roundStateDelta(delta){
    const out = {};
    for (const dim of STATE_DIMS) out[dim] = round3(delta[dim] || 0);
    return out;
  }

  function diffState(before, after){
    const out = {};
    for (const dim of STATE_DIMS){
      out[dim] = round3((after[dim] || 0) - (before[dim] || 0));
    }
    return out;
  }

  function round3(n){ return Math.round(n * 1000) / 1000; }
  function formatNum(n){ return Number(n).toFixed(2); }
  function formatSigned(n){
    const s = Number(n);
    if (!Number.isFinite(s)) return String(n);
    return `${s >= 0 ? "+" : ""}${s.toFixed(2)}`;
  }
  function formatPct(n){ return `${Math.round(clamp(n,0,1.5) * 100)}%`; }

  // -----------------------------
  // Deterministic randomness helpers
  // -----------------------------
  function hashString(str){
    let h = 2166136261;
    for (let i=0; i<str.length; i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seeded01(key){
    return (hashString(String(key)) % 1000000) / 1000000;
  }

  function seededRange(key, min, max){
    return min + seeded01(key) * (max - min);
  }

  function pickDeterministic(arr, key){
    if (!arr || !arr.length) return null;
    const i = Math.floor(seededRange(key, 0, arr.length));
    return arr[Math.max(0, Math.min(arr.length - 1, i))];
  }

  // -----------------------------
  // Utilities
  // -----------------------------
  function byId(id){
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing element #${id} in HTML.`);
    return el;
  }

  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  function escapeRegExp(str){
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // -----------------------------
  // Go
  // -----------------------------
  init();

})();

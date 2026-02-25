(() => {
  const LS_KEYS = {
    config: "RIPPLES_LLM_CONFIG",
    ollamaBase: "RIPPLES_OLLAMA_BASE_URL",
    ollamaModel: "RIPPLES_OLLAMA_MODEL"
  };

  function detectProviderFromKey(key) {
    const k = String(key || "").trim();
    if (!k) return null;
    if (k.startsWith("sk-ant-")) return "anthropic";
    if (k.startsWith("AIza")) return "gemini";
    if (k.startsWith("sk-")) return "openai";
    return null;
  }

  function stripFence(text) {
    return String(text || "").replace(/```json|```/gi, "").trim();
  }

  function parseApiMd(text) {
    const raw = String(text || "").trim();
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const apiKey = parsed.apiKey || parsed.api_key || parsed.key;
        if (!apiKey) return null;
        return {
          provider: parsed.provider || detectProviderFromKey(apiKey) || "openai",
          apiKey,
          model: parsed.model || "",
          baseUrl: parsed.baseUrl || parsed.base_url || "",
          source: "api.md"
        };
      }
    } catch (_) {
      // Not JSON; continue.
    }

    const out = {};
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.+)$/);
      if (m) {
        out[m[1].toLowerCase()] = m[2].trim().replace(/^['"]|['"]$/g, "");
      } else if (!out.api_key && !out.key && !out.provider && /^(sk-|AIza)/.test(line)) {
        out.api_key = line;
      }
    }

    const fallbackKey = out.api_key || out.key || lines.find(l => /^(sk-|AIza)/.test(l));
    if (!fallbackKey) return null;
    return {
      provider: out.provider || detectProviderFromKey(fallbackKey) || "openai",
      apiKey: fallbackKey,
      model: out.model || "",
      baseUrl: out.baseurl || out.base_url || "",
      source: "api.md"
    };
  }

  function loadStoredConfig() {
    try {
      const raw = localStorage.getItem(LS_KEYS.config);
      if (!raw) return null;
      const cfg = JSON.parse(raw);
      if (!cfg || typeof cfg !== "object") return null;
      if (!cfg.provider) cfg.provider = cfg.apiKey ? detectProviderFromKey(cfg.apiKey) : "ollama";
      return cfg;
    } catch (_) {
      return null;
    }
  }

  function storeConfig(cfg) {
    if (!cfg) return;
    const safeCfg = {
      provider: cfg.provider || null,
      apiKey: cfg.apiKey || "",
      model: cfg.model || "",
      baseUrl: cfg.baseUrl || ""
    };
    try {
      localStorage.setItem(LS_KEYS.config, JSON.stringify(safeCfg));
    } catch (_) {
      // ignore
    }
  }

  async function fetchApiMd(apiMdPath = "api.md") {
    const res = await fetch(apiMdPath, { cache: "no-store" });
    if (!res.ok) throw new Error(`api.md fetch failed (${res.status})`);
    return parseApiMd(await res.text());
  }

  function getOllamaDefaults() {
    let baseUrl = "http://localhost:11434";
    let model = "llama3";
    try {
      baseUrl = localStorage.getItem(LS_KEYS.ollamaBase) || baseUrl;
      model = localStorage.getItem(LS_KEYS.ollamaModel) || model;
    } catch (_) {
      // ignore
    }
    return { provider: "ollama", baseUrl, model };
  }

  async function resolveConfig(opts = {}) {
    const explicit = {
      provider: opts.provider || null,
      apiKey: opts.apiKey || "",
      model: opts.model || "",
      baseUrl: opts.baseUrl || ""
    };

    if (explicit.provider || explicit.apiKey) {
      const cfg = {
        provider: explicit.provider || detectProviderFromKey(explicit.apiKey) || "openai",
        apiKey: explicit.apiKey || "",
        model: explicit.model || "",
        baseUrl: explicit.baseUrl || ""
      };
      if (cfg.provider !== "ollama" && cfg.apiKey) storeConfig(cfg);
      return cfg;
    }

    if (opts.preferLocal) return getOllamaDefaults();

    const stored = loadStoredConfig();
    if (stored && (stored.apiKey || stored.provider === "ollama")) return stored;

    if (opts.allowApiMd !== false) {
      try {
        const fromFile = await fetchApiMd(opts.apiMdPath || "api.md");
        if (fromFile) {
          storeConfig(fromFile);
          return fromFile;
        }
      } catch (_) {
        // ignore, can still fall back local
      }
    }

    if (opts.allowLocalFallback !== false) return getOllamaDefaults();
    return null;
  }

  async function generateWithOpenAI(cfg, prompt, system, opts = {}) {
    const model = cfg.model || opts.model || "gpt-4.1-mini";
    const res = await fetch((cfg.baseUrl || "https://api.openai.com") + "/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt }
        ],
        temperature: typeof opts.temperature === "number" ? opts.temperature : 0.7,
        max_tokens: opts.maxTokens || 1000
      })
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    return {
      text: data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "",
      raw: data,
      model
    };
  }

  async function generateWithAnthropic(cfg, prompt, system, opts = {}) {
    const model = cfg.model || opts.model || "claude-3-5-sonnet-latest";
    const res = await fetch((cfg.baseUrl || "https://api.anthropic.com") + "/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": cfg.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens || 1000,
        ...(system ? { system } : {}),
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = await res.json();
    const text = Array.isArray(data.content) ? data.content.map(p => p.text || "").join("\n").trim() : "";
    return { text, raw: data, model };
  }

  async function generateWithGemini(cfg, prompt, system, opts = {}) {
    const model = cfg.model || opts.model || "gemini-1.5-flash";
    const base = cfg.baseUrl || "https://generativelanguage.googleapis.com";
    const url = `${base}/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {})
      })
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
      ? data.candidates[0].content.parts.map(p => p.text || "").join("\n").trim()
      : "";
    return { text, raw: data, model };
  }

  async function generateWithOllama(cfg, prompt, system, opts = {}) {
    const base = (cfg.baseUrl || "http://localhost:11434").replace(/\/+$/, "");
    const model = cfg.model || opts.model || "llama3";
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt }
        ],
        stream: false
      })
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const data = await res.json();
    return { text: data.message ? data.message.content : "", raw: data, model };
  }

  async function generate(opts = {}) {
    const cfg = await resolveConfig(opts);
    if (!cfg) throw new Error("No LLM config available");
    if (!cfg.provider) cfg.provider = cfg.apiKey ? detectProviderFromKey(cfg.apiKey) : "ollama";

    const prompt = String(opts.prompt || "");
    const system = opts.system ? String(opts.system) : "";
    let result;

    if (cfg.provider === "ollama" || (!cfg.apiKey && cfg.provider !== "gemini")) {
      result = await generateWithOllama(cfg, prompt, system, opts);
    } else if (cfg.provider === "openai") {
      result = await generateWithOpenAI(cfg, prompt, system, opts);
    } else if (cfg.provider === "anthropic") {
      result = await generateWithAnthropic(cfg, prompt, system, opts);
    } else if (cfg.provider === "gemini") {
      result = await generateWithGemini(cfg, prompt, system, opts);
    } else {
      throw new Error(`Unsupported provider: ${cfg.provider}`);
    }

    return {
      ok: true,
      provider: cfg.provider,
      model: result.model || cfg.model || "",
      text: String(result.text || "").trim(),
      raw: result.raw || null,
      source: cfg.source || (cfg.provider === "ollama" ? "local" : "config")
    };
  }

  async function testConnection(opts = {}) {
    const started = Date.now();
    const probePrompt = opts.prompt || "Reply with exactly OK";
    const probeSystem = opts.system || "Connectivity test. Reply with exactly OK.";
    const res = await generate({
      ...opts,
      prompt: probePrompt,
      system: probeSystem,
      maxTokens: opts.maxTokens || 12,
      temperature: typeof opts.temperature === "number" ? opts.temperature : 0
    });
    return {
      ok: true,
      provider: res.provider,
      model: res.model || "",
      source: res.source || "",
      latencyMs: Date.now() - started,
      text: res.text || "",
      preview: String(res.text || "").slice(0, 120)
    };
  }

  function parseJSON(text) {
    return JSON.parse(stripFence(text));
  }

  window.RipplesLLMAdapter = {
    parseApiMd,
    detectProviderFromKey,
    stripFence,
    parseJSON,
    fetchApiMd,
    loadStoredConfig,
    storeConfig,
    resolveConfig,
    generate,
    testConnection
  };
})();

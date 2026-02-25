/**
 * RIPPLE AI BRIDGE (expanded)
 * Backward-compatible `RIPPLE_AI.call()` plus adapter-aware multi-provider support.
 *
 * Supports:
 * - Local Ollama (default)
 * - Shared `RipplesLLMAdapter` if loaded (api.md / OpenAI / Anthropic / Gemini / Ollama)
 */

(function () {
    const STORAGE_KEYS = {
        host: 'ripple_ai_host',
        model: 'ripple_ai_model',
        mode: 'ripple_ai_mode',
        apiMdPath: 'ripple_ai_api_md_path',
        remoteModel: 'ripple_ai_remote_model'
    };

    function stripFences(text) {
        return String(text || '').replace(/```json|```/gi, '').trim();
    }

    function tryParseJSON(text) {
        try {
            return { ok: true, value: JSON.parse(text) };
        } catch (e) {
            return { ok: false, error: e };
        }
    }

    function extractBalancedJSONObject(rawText) {
        const text = String(rawText || '');
        if (!text.includes('{')) return null;

        for (let start = 0; start < text.length; start++) {
            if (text[start] !== '{') continue;
            let depth = 0;
            let inString = false;
            let escape = false;
            for (let i = start; i < text.length; i++) {
                const ch = text[i];
                if (inString) {
                    if (escape) {
                        escape = false;
                    } else if (ch === '\\') {
                        escape = true;
                    } else if (ch === '"') {
                        inString = false;
                    }
                    continue;
                }
                if (ch === '"') {
                    inString = true;
                    continue;
                }
                if (ch === '{') depth++;
                if (ch === '}') {
                    depth--;
                    if (depth === 0) {
                        const candidate = text.slice(start, i + 1);
                        const parsed = tryParseJSON(candidate);
                        if (parsed.ok) {
                            return {
                                jsonText: candidate,
                                parsed: parsed.value,
                                prefixText: text.slice(0, start).trim(),
                                suffixText: text.slice(i + 1).trim()
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    function parseBridgeJSON(text) {
        const cleaned = stripFences(text);
        const direct = tryParseJSON(cleaned);
        if (direct.ok) {
            return {
                parsed: direct.value,
                jsonText: cleaned,
                prefixText: "",
                suffixText: "",
                mixed: false
            };
        }
        const extracted = extractBalancedJSONObject(cleaned);
        if (extracted) {
            return {
                parsed: extracted.parsed,
                jsonText: extracted.jsonText,
                prefixText: extracted.prefixText || "",
                suffixText: extracted.suffixText || "",
                mixed: !!(extracted.prefixText || extracted.suffixText)
            };
        }
        const err = new Error("No parseable JSON object found in response");
        err.cause = direct.error || null;
        throw err;
    }

    const RIPPLE_AI = {
        config: {
            get mode() {
                return localStorage.getItem(STORAGE_KEYS.mode) || 'auto'; // auto | local | remote
            },
            set mode(v) {
                localStorage.setItem(STORAGE_KEYS.mode, v);
            },
            get model() {
                return localStorage.getItem(STORAGE_KEYS.model) || 'llama3';
            },
            set model(v) {
                localStorage.setItem(STORAGE_KEYS.model, v);
            },
            get remoteModel() {
                return localStorage.getItem(STORAGE_KEYS.remoteModel) || 'gpt-4.1-mini';
            },
            set remoteModel(v) {
                localStorage.setItem(STORAGE_KEYS.remoteModel, v);
            },
            get apiMdPath() {
                return localStorage.getItem(STORAGE_KEYS.apiMdPath) || 'api.md';
            },
            set apiMdPath(v) {
                localStorage.setItem(STORAGE_KEYS.apiMdPath, v);
            },
            get host() {
                return localStorage.getItem(STORAGE_KEYS.host) || 'localhost:11434';
            },
            set host(v) {
                localStorage.setItem(STORAGE_KEYS.host, v);
            }
        },

        setConfig(patch = {}) {
            Object.entries(patch).forEach(([k, v]) => {
                if (k in this.config && v != null) this.config[k] = v;
            });
            return this.getConfig();
        },

        getConfig() {
            return {
                mode: this.config.mode,
                model: this.config.model,
                remoteModel: this.config.remoteModel,
                apiMdPath: this.config.apiMdPath,
                host: this.config.host
            };
        },

        async call(prompt, system = "You are an AI assistant in the RIPPLES ecology simulator.", options = {}) {
            const result = await this.callDetailed(prompt, system, options);
            return result.text;
        },

        async callDetailed(prompt, system = "You are an AI assistant in the RIPPLES ecology simulator.", options = {}) {
            const mode = options.mode || this.config.mode || 'auto';

            // Prefer shared adapter when available for remote/api.md support.
            if (window.RipplesLLMAdapter) {
                const base = {
                    prompt,
                    system,
                    apiMdPath: options.apiMdPath || this.config.apiMdPath,
                    maxTokens: options.maxTokens || 600,
                    temperature: typeof options.temperature === 'number' ? options.temperature : 0.7,
                    ...(options.provider ? { provider: options.provider } : {}),
                    ...(options.apiKey ? { apiKey: options.apiKey } : {}),
                    ...(options.baseUrl ? { baseUrl: options.baseUrl } : {}),
                    ...(options.model ? { model: options.model } : {})
                };

                try {
                    let res;
                    if (mode === 'local') {
                        res = await window.RipplesLLMAdapter.generate({
                            ...base,
                            preferLocal: true,
                            allowApiMd: false,
                            model: options.localModel || this.config.model
                        });
                    } else if (mode === 'remote') {
                        res = await window.RipplesLLMAdapter.generate({
                            ...base,
                            preferLocal: false,
                            allowApiMd: true,
                            allowLocalFallback: false,
                            model: options.remoteModel || this.config.remoteModel
                        });
                    } else {
                        try {
                            res = await window.RipplesLLMAdapter.generate({
                                ...base,
                                preferLocal: false,
                                allowApiMd: true,
                                allowLocalFallback: false,
                                model: options.remoteModel || this.config.remoteModel
                            });
                        } catch (remoteErr) {
                            console.warn('[RIPPLE AI] Remote attempt failed, falling back to local:', remoteErr);
                            res = await window.RipplesLLMAdapter.generate({
                                ...base,
                                preferLocal: true,
                                allowApiMd: false,
                                model: options.localModel || this.config.model
                            });
                        }
                    }

                    return {
                        ok: true,
                        text: String(res.text || '').trim(),
                        provider: res.provider || 'unknown',
                        model: res.model || '',
                        source: res.source || '',
                        raw: res.raw || null
                    };
                } catch (e) {
                    console.warn('[RIPPLE AI] Adapter call failed; trying legacy Ollama path.', e);
                }
            }

            const legacyText = await this.callLocalOllamaCompat(prompt, system, options);
            return {
                ok: true,
                text: legacyText,
                provider: 'ollama',
                model: options.localModel || this.config.model,
                source: 'legacy-local',
                raw: null
            };
        },

        async callJSON(prompt, system, options = {}) {
            const res = await this.callDetailed(prompt, system, options);
            return this.parseJSON(res.text);
        },

        parseJSON(text) {
            return parseBridgeJSON(text).parsed;
        },

        parseBridgeJSON(text) {
            return parseBridgeJSON(text);
        },

        async chat(messages = [], options = {}) {
            const compiled = Array.isArray(messages)
                ? messages.map(m => `[${String(m.role || 'user').toUpperCase()}] ${String(m.content || '')}`).join('\n\n')
                : String(messages || '');
            const system = options.system || "You are an AI assistant in the RIPPLES ecosystem.";
            return this.callDetailed(compiled, system, options);
        },

        async testConnection(options = {}) {
            const mode = options.mode || this.config.mode || 'auto';
            const started = Date.now();

            if (window.RipplesLLMAdapter && typeof window.RipplesLLMAdapter.testConnection === 'function') {
                try {
                    let probe;
                    if (mode === 'local') {
                        probe = await window.RipplesLLMAdapter.testConnection({
                            preferLocal: true,
                            allowApiMd: false,
                            prompt: 'OK',
                            system: 'Reply with OK'
                        });
                    } else if (mode === 'remote') {
                        probe = await window.RipplesLLMAdapter.testConnection({
                            apiMdPath: options.apiMdPath || this.config.apiMdPath,
                            preferLocal: false,
                            allowApiMd: true,
                            allowLocalFallback: false,
                            model: options.remoteModel || this.config.remoteModel,
                            prompt: 'OK',
                            system: 'Reply with OK'
                        });
                    } else {
                        try {
                            probe = await window.RipplesLLMAdapter.testConnection({
                                apiMdPath: options.apiMdPath || this.config.apiMdPath,
                                preferLocal: false,
                                allowApiMd: true,
                                allowLocalFallback: false,
                                model: options.remoteModel || this.config.remoteModel,
                                prompt: 'OK',
                                system: 'Reply with OK'
                            });
                        } catch (_) {
                            probe = await window.RipplesLLMAdapter.testConnection({
                                preferLocal: true,
                                allowApiMd: false,
                                prompt: 'OK',
                                system: 'Reply with OK'
                            });
                        }
                    }
                    return { ok: true, ...probe };
                } catch (e) {
                    return { ok: false, error: e.message || String(e), latencyMs: Date.now() - started };
                }
            }

            // Legacy Ollama ping
            try {
                const host = this.config.host;
                const url = `http://${host}/api/tags`;
                const response = await fetch(url);
                return {
                    ok: response.ok,
                    provider: 'ollama',
                    model: this.config.model,
                    source: 'legacy-local',
                    latencyMs: Date.now() - started,
                    status: response.status
                };
            } catch (e) {
                return { ok: false, error: e.message || String(e), provider: 'ollama', latencyMs: Date.now() - started };
            }
        },

        async compareCompletions(request = {}) {
            const lanes = Array.isArray(request.lanes) ? request.lanes : [];
            const prompt = String(request.prompt || '');
            const system = request.system || "You are an AI assistant in the RIPPLES ecosystem.";
            if (!prompt.trim()) throw new Error('compareCompletions requires prompt');
            if (!lanes.length) throw new Error('compareCompletions requires at least one lane');

            const jobs = [];
            lanes.forEach((lane, idx) => {
                const repeat = Math.max(1, Math.min(8, Number(lane.repeat || 1)));
                for (let i = 0; i < repeat; i++) {
                    jobs.push({
                        laneIndex: idx,
                        runIndex: i,
                        lane: {
                            label: lane.label || `lane-${idx + 1}`,
                            mode: lane.mode || undefined,
                            provider: lane.provider || undefined,
                            model: lane.model || undefined,
                            apiKey: lane.apiKey || undefined,
                            baseUrl: lane.baseUrl || undefined,
                            apiMdPath: lane.apiMdPath || undefined,
                            temperature: typeof lane.temperature === 'number' ? lane.temperature : undefined,
                            maxTokens: typeof lane.maxTokens === 'number' ? lane.maxTokens : undefined,
                            meta: lane.meta || null
                        }
                    });
                }
            });

            const started = Date.now();
            const runOne = async (job) => {
                const t0 = Date.now();
                try {
                    const res = await this.callDetailed(prompt, system, {
                        ...(job.lane.mode ? { mode: job.lane.mode } : {}),
                        ...(job.lane.provider ? { provider: job.lane.provider } : {}),
                        ...(job.lane.apiKey ? { apiKey: job.lane.apiKey } : {}),
                        ...(job.lane.baseUrl ? { baseUrl: job.lane.baseUrl } : {}),
                        ...(job.lane.model ? { model: job.lane.model } : {}),
                        ...(job.lane.apiMdPath ? { apiMdPath: job.lane.apiMdPath } : {}),
                        ...(typeof job.lane.temperature === 'number' ? { temperature: job.lane.temperature } : {}),
                        ...(typeof job.lane.maxTokens === 'number' ? { maxTokens: job.lane.maxTokens } : {})
                    });
                    return {
                        ok: true,
                        laneIndex: job.laneIndex,
                        runIndex: job.runIndex,
                        label: job.lane.label,
                        provider: res.provider || '',
                        model: res.model || '',
                        source: res.source || '',
                        text: String(res.text || ''),
                        latencyMs: Date.now() - t0,
                        meta: job.lane.meta || null
                    };
                } catch (e) {
                    return {
                        ok: false,
                        laneIndex: job.laneIndex,
                        runIndex: job.runIndex,
                        label: job.lane.label,
                        provider: job.lane.provider || '',
                        model: job.lane.model || '',
                        source: '',
                        text: '',
                        error: e.message || String(e),
                        latencyMs: Date.now() - t0,
                        meta: job.lane.meta || null
                    };
                }
            };

            const parallel = request.parallel !== false;
            const results = [];
            if (parallel) {
                const all = await Promise.all(jobs.map(runOne));
                results.push(...all);
            } else {
                for (const job of jobs) results.push(await runOne(job));
            }

            return {
                ok: true,
                startedAt: new Date(started).toISOString(),
                totalLatencyMs: Date.now() - started,
                count: results.length,
                results
            };
        },

        async callLocalOllamaCompat(prompt, system, options = {}) {
            const host = options.host || this.config.host;
            const model = options.localModel || this.config.model;
            const v1Url = `http://${host}/v1/chat/completions`;
            const apiUrl = `http://${host}/api/chat`;

            console.log(`[RIPPLE AI] Local call via ${host} (${model})`);

            // Try OpenAI-compatible first
            try {
                const response = await fetch(v1Url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: 'system', content: system },
                            { role: 'user', content: prompt }
                        ],
                        temperature: typeof options.temperature === 'number' ? options.temperature : 0.7,
                        max_tokens: options.maxTokens || 500
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    return data.choices?.[0]?.message?.content?.trim() || '';
                }
            } catch (err) {
                console.warn('[RIPPLE AI] v1 compat path failed:', err);
            }

            // Fallback to Ollama native /api/chat
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: system },
                        { role: 'user', content: prompt }
                    ],
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`Ollama error ${response.status}`);
            const data = await response.json();
            return data.message?.content?.trim() || '';
        }
    };

    window.RIPPLE_AI = RIPPLE_AI;
})();

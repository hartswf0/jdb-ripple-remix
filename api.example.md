# RIPPLES LLM API Config (example)

You can keep `api.md` as a single raw key line (supported), or use one of these structured formats.

## Option A: Raw key (auto-detects provider)

```txt
sk-proj-REPLACE_ME
```

## Option B: YAML-ish

```txt
provider: openai
api_key: sk-proj-REPLACE_ME
model: gpt-4.1-mini
```

## Option C: JSON

```json
{
  "provider": "openai",
  "apiKey": "sk-proj-REPLACE_ME",
  "model": "gpt-4.1-mini"
}
```

## Local LLM (Ollama)

No `api.md` required if you want local-only mode.

- Default URL: `http://localhost:11434`
- Default model: `llama3`

Optional localStorage overrides:

- `RIPPLES_OLLAMA_BASE_URL`
- `RIPPLES_OLLAMA_MODEL`

#!/usr/bin/env python3
"""
Catalog and normalize VIDEO UP transcript/video assets.

What this script does:
1. Scans transcript markdown files in VIDEO UP.
2. Extracts first user prompt (fallback: root_seed).
3. Generates canonical title + pair metadata.
4. Injects/refreshes a MEDIA ASSET header block in each transcript.
5. Writes JSON + Markdown manifest files for fast browsing.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


RE_TRANSCRIPT_NAME = re.compile(r"^(?P<base>.+?)\.transcript(?: (?P<dup>\(\d+\)))?\.md$")
RE_MEDIA_BLOCK = re.compile(
    r"(?ms)^## MEDIA ASSET\n.*?\n## END MEDIA ASSET\n\n?"
)
RE_BUILD = re.compile(r"^- build:\s*(.+)\s*$", re.MULTILINE)
RE_SESSION = re.compile(r"^- session_id:\s*(.+)\s*$", re.MULTILINE)
RE_EXPORTED = re.compile(r"^- exported_at:\s*(.+)\s*$", re.MULTILINE)
RE_ROOT_SEED = re.compile(r"^- root_seed:\s*(.+)\s*$", re.MULTILINE)
RE_USER_EVENT = re.compile(
    r"^- \[\d{2}:\d{2}\.\d{3}\] \[user\](?: \[[^\]]+\])?\s*(.+)$", re.MULTILINE
)


@dataclass
class Asset:
    asset_id: str
    pair_code: str
    title: str
    title_slug: str
    build: str
    session_id: str
    exported_at: str
    transcript_file: str
    video_file: str
    video_exists: bool
    first_prompt_excerpt: str
    first_prompt_source: str
    recommended_base_name: str


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def slugify(text: str, max_len: int = 64) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    if not cleaned:
        return "untitled"
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[:max_len].rstrip("-")


def quote_for_md(text: str, max_len: int = 220) -> str:
    line = normalize_space(text)
    if len(line) > max_len:
        line = line[: max_len - 3].rstrip() + "..."
    return line.replace('"', "'")


def parse_metadata(text: str, regex: re.Pattern[str]) -> str:
    match = regex.search(text)
    return normalize_space(match.group(1)) if match else ""


def extract_first_prompt(text: str) -> tuple[str, str]:
    user_match = RE_USER_EVENT.search(text)
    if user_match:
        return normalize_space(user_match.group(1)), "first_user_event"
    root_seed = parse_metadata(text, RE_ROOT_SEED)
    if root_seed:
        return root_seed, "root_seed"
    return "", "missing"


def derive_topic(prompt: str) -> str:
    candidates: list[str] = []

    name_match = re.search(r"name:\s*['\"]([^'\"]{3,120})['\"]", prompt)
    if name_match:
        candidates.append(name_match.group(1))

    node_match = re.search(r"##\s*NODE\s*\[[^\]]+\]\s*:\s*\"([^\"]{3,120})\"", prompt)
    if node_match:
        candidates.append(node_match.group(1))

    title_json_match = re.search(r'"title"\s*:\s*"([^"]{3,120})"', prompt)
    if title_json_match:
        candidates.append(title_json_match.group(1))

    title_field_match = re.search(r"title:\s*['\"]([^'\"]{3,120})['\"]", prompt)
    if title_field_match:
        candidates.append(title_field_match.group(1))

    id_block = re.search(r"^\s*([a-zA-Z0-9 _-]{3,64}):\s*\{", prompt)
    if id_block:
        candidates.append(id_block.group(1))

    stone_match = re.search(r"STONE[^:]*:\s*([^\n]{6,120})", prompt, flags=re.IGNORECASE)
    if stone_match:
        candidates.append(stone_match.group(1))

    initial_prompt_match = re.search(r"initialPrompt:\s*['\"]([^'\"]{12,180})['\"]", prompt)
    if initial_prompt_match:
        candidates.append(initial_prompt_match.group(1))

    if not candidates:
        sentence = prompt.split(".")[0]
        words = sentence.split()
        if words:
            candidates.append(" ".join(words[:10]))

    raw = candidates[0] if candidates else "Untitled Session"
    raw = normalize_space(raw)
    raw = re.sub(r"[*_`#]+", " ", raw)
    raw = normalize_space(raw)

    if raw.lower() in {"none", "(none)", "null", "n/a", "na", "void"}:
        return "Untitled Session"

    if len(raw) > 96:
        words = raw.split()
        raw = " ".join(words[:10])

    raw = raw.strip(" -:;,.'\"")
    return raw[:96] if raw else "Untitled Session"


def derive_title(topic: str, build: str) -> str:
    build_label = normalize_space(build).replace("-", " ").upper() if build else "RIPPLES"
    return f"{topic} — {build_label}"


def compute_pair_fields(transcript_name: str) -> tuple[str, str, str]:
    match = RE_TRANSCRIPT_NAME.match(transcript_name)
    if not match:
        stem = transcript_name.replace(".md", "")
        return stem, f"{stem}.mp4", "PAIR-UNKNOWN"

    base = match.group("base")
    dup = match.group("dup")
    dup_suffix = f" {dup}" if dup else ""
    video_name = f"{base}{dup_suffix}.mp4"

    identity = f"{base}{dup_suffix}"
    code = re.sub(r"[^A-Za-z0-9]+", "-", identity).upper().strip("-")
    if len(code) > 72:
        code = code[:72].rstrip("-")

    return identity, video_name, code


def build_asset(transcript_path: Path) -> Asset:
    raw = transcript_path.read_text(encoding="utf-8")
    build = parse_metadata(raw, RE_BUILD)
    session_id = parse_metadata(raw, RE_SESSION)
    exported_at = parse_metadata(raw, RE_EXPORTED)

    first_prompt, source = extract_first_prompt(raw)
    topic = derive_topic(first_prompt)
    title = derive_title(topic, build)
    title_slug = slugify(title, max_len=72)

    identity, video_name, pair_code = compute_pair_fields(transcript_path.name)
    video_path = transcript_path.parent / video_name

    asset_id = slugify(identity, max_len=96)
    recommended_base_name = f"{title_slug}__{pair_code.lower()}"

    return Asset(
        asset_id=asset_id,
        pair_code=pair_code,
        title=title,
        title_slug=title_slug,
        build=build,
        session_id=session_id,
        exported_at=exported_at,
        transcript_file=transcript_path.name,
        video_file=video_name,
        video_exists=video_path.exists(),
        first_prompt_excerpt=quote_for_md(first_prompt),
        first_prompt_source=source,
        recommended_base_name=recommended_base_name,
    )


def render_media_block(asset: Asset) -> str:
    return (
        "## MEDIA ASSET\n"
        f"- asset_id: {asset.asset_id}\n"
        f"- pair_code: {asset.pair_code}\n"
        f"- title: {asset.title}\n"
        f"- title_slug: {asset.title_slug}\n"
        f"- transcript_file: {asset.transcript_file}\n"
        f"- video_file: {asset.video_file}\n"
        f"- pair_status: {'paired' if asset.video_exists else 'missing_video'}\n"
        f"- first_prompt_source: {asset.first_prompt_source}\n"
        f"- first_prompt_excerpt: \"{asset.first_prompt_excerpt}\"\n"
        f"- recommended_base_name: {asset.recommended_base_name}\n"
        "## END MEDIA ASSET"
    )


def rewrite_transcript(transcript_path: Path, asset: Asset) -> None:
    raw = transcript_path.read_text(encoding="utf-8")
    cleaned = RE_MEDIA_BLOCK.sub("", raw).rstrip() + "\n"
    media_block = render_media_block(asset)

    header = "# RIPPLE SESSION TRANSCRIPT"
    if cleaned.startswith(header):
        remainder = cleaned[len(header) :].lstrip("\n")
        updated = f"{header}\n\n{media_block}\n\n{remainder}".rstrip() + "\n"
    else:
        updated = f"{media_block}\n\n{cleaned}".rstrip() + "\n"

    transcript_path.write_text(updated, encoding="utf-8")


def render_manifest_md(assets: Iterable[Asset]) -> str:
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    lines = [
        "# VIDEO UP Manifest",
        "",
        f"- generated_at: {now}",
        "- purpose: canonical transcript/video pairing with prompt-derived titles",
        "",
        "| Pair Code | Title | Build | Transcript | Video | Status |",
        "|---|---|---|---|---|---|",
    ]
    for a in assets:
        status = "PAIRED" if a.video_exists else "MISSING_VIDEO"
        lines.append(
            f"| `{a.pair_code}` | {a.title} | `{a.build}` | `{a.transcript_file}` | `{a.video_file}` | `{status}` |"
        )
    lines.append("")
    lines.append("## Prompt Index")
    lines.append("")
    for a in assets:
        lines.append(f"### {a.title}")
        lines.append(f"- pair_code: `{a.pair_code}`")
        lines.append(f"- transcript: `{a.transcript_file}`")
        lines.append(f"- video: `{a.video_file}`")
        lines.append(f"- first_prompt_excerpt: {a.first_prompt_excerpt}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    video_dir = root / "VIDEO UP"
    if not video_dir.exists():
        raise SystemExit(f"Missing directory: {video_dir}")

    transcripts = sorted(
        [
            p
            for p in video_dir.glob("*.md")
            if ".transcript" in p.name and p.is_file()
        ]
    )
    if not transcripts:
        raise SystemExit("No transcript markdown files found in VIDEO UP.")

    assets: list[Asset] = []
    for transcript in transcripts:
        asset = build_asset(transcript)
        rewrite_transcript(transcript, asset)
        assets.append(asset)

    manifest_json = [asdict(a) for a in assets]
    (video_dir / "video_manifest.json").write_text(
        json.dumps(manifest_json, indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )
    (video_dir / "video_manifest.md").write_text(
        render_manifest_md(assets),
        encoding="utf-8",
    )

    paired = sum(1 for a in assets if a.video_exists)
    missing = len(assets) - paired
    print(
        f"Processed {len(assets)} transcripts. "
        f"Paired videos: {paired}. Missing videos: {missing}."
    )
    print("Wrote: VIDEO UP/video_manifest.json")
    print("Wrote: VIDEO UP/video_manifest.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

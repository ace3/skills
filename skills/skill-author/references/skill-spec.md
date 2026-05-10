# Skill Specification

Authoritative structure for every skill in this repo. Lint enforces what is enforceable; the rest is convention.

## Layout

```
skills/<name>/
  skill.yml            # source of truth (you edit this)
  SKILL.md             # body (you edit this; frontmatter is generated)
  CHANGELOG.md         # one line per substantive change
  MANIFEST             # generated, do not hand-edit
  .claude-plugin/plugin.json   # generated
  .codex-plugin/plugin.json    # generated
  references/
    <skill-specific>.md        # hand-written, kept
    base-operating-layer.md    # generated copy from templates/, when included
    prompt-injection-defense.md
    output-contracts.md
  scripts/             # optional executables
```

Templates live in `templates/references/` at the repo root and are **never shipped**. The build copies the canonical content into each skill that lists the template in its `includes:`. Lint enforces byte-equality between every shipped copy and its template.

## skill.yml schema

```yaml
name: <kebab-case, must equal directory name>
version: <semver, e.g. 0.1.0>
description: >
  Multi-line folded scalar. First sentence describes what the skill does.
  Subsequent sentences list explicit triggers and "not for X — use Y" boundaries.
keywords:
  - kw1
  - kw2
includes:
  - prompt-injection-defense        # required for every skill
  - base-operating-layer            # for skills that need Karpathy + Superpowers planning gates
  - output-contracts                # for skills that emit structured handoffs
```

`description` becomes the SKILL.md frontmatter and the `plugin.json` description; it is the only thing routing logic sees, so spell out triggers and boundaries.

## Description shape

The description is the entire routing surface. The body is invisible until the skill triggers, so anything that influences when to load this skill must live here.

Target shape (60–100 words):

1. **Lead with the noun**, not a verb. "Backend implementation for…", "Engineering planning for…", "Diagram creation router for…". The first phrase should let a reader place the skill against its peers in one glance.
2. **Enumerate concrete triggers**, not generic categories. List the specific words a user would actually type ("the user says roast me", "PRDs", "feature briefs", "Docker rollouts", "Plane work item", "PROJ-123"). Single-word categories like "review" trigger badly because too many skills overlap on them.
3. **Name sister skills and the boundary** when one exists. The `engineering-manager` ↔ `product-manager` pair is the model: each description ends by stating what the *other* skill is for. Do this for any skill that has a near-neighbor.
4. **Be a little pushy on triggering, not on action.** Skills tend to under-trigger. Phrases like "Use when…" and "Use … or when …" are good. "Always use this for X" is acceptable when X is unambiguously this skill's domain. Do *not* push the user toward the skill's outputs ("you should always run a full audit") — that is body content.

Anti-patterns in descriptions:

- Time-sensitive phrasing ("as of 2026", "the new V2 API"). Descriptions outlive their authors' assumptions.
- Hardcoded absolute paths or machine-specific URLs.
- Environment names that bind the skill to one user's setup.
- Embedded instructions to other skills ("after running this, run X"). Sequence belongs in `dev-orchestrator`, not in a peer's description.
- Marketing prose. The reader is a router, not a customer.

## SKILL.md required sections

Every SKILL.md must contain:

- `## References` — bullet list pointing only to its **own** `references/<file>.md` (no `../` paths)
- `## Trust Boundary` — list of untrusted input sources for this skill, plus the "instruction precedence" rule

Every SKILL.md that includes `base-operating-layer` must also contain `## Base Operating Layer` pointing to `references/base-operating-layer.md`.

Every SKILL.md that includes `output-contracts` should reference the appropriate bundle shape (Findings / Plan / Routing) from `references/output-contracts.md` in its `## Output Contract` section.

The body must be self-contained — never reference content outside the skill's own directory. The `make lint` step rejects `../_shared/`, `../<other-skill>/`, etc.

## SKILL.md body shape

- Aim for under 500 lines. Beyond that, the body stops earning its place in context. Move detail to `references/<purpose>.md` and leave a one-line pointer that says when to read it.
- Lead each section with what to do, then why. Use imperative form. Avoid all-caps MUSTs and NEVERs as a substitute for explanation — if a rule is non-obvious, give the model the reasoning so it can apply judgment to edge cases the rule did not anticipate.
- Examples earn their keep. A two-line input/output pair tells the model more than three paragraphs of theory. Skip examples only when the section is genuinely unambiguous.
- Draft, then re-read with fresh eyes. The second pass is where bloat gets removed; budget time for it.

## Reference files

Each `references/<file>.md` is a doc loaded on demand by the skill body. Three rules:

1. **Name by purpose, not source.** `external-event-integrity.md` and `benchmark-quality.md` are good — a future reader can guess the contents from the filename. Source-attributed names ("acme-style-guide.md", "karpathy-base.md") encode trivia that decays as the source evolves; rename if you find one.
2. **Add a Table of Contents for any file over 300 lines.** A short TOC near the top lets the model skip to the relevant section instead of reading the whole file. For files under 300 lines, a clear opening paragraph is enough.
3. **Tell SKILL.md when to load it.** Every reference cited from SKILL.md should have a sentence that says when to consult it ("for oversized plans, load `references/roast-tree.md`"). A reference with no load-trigger in the body is a reference that will not be read.

`scripts/` vs `references/` vs `assets/`:

- `scripts/` — executable code the skill should run, not read. Use this when the same multi-step or error-prone task is showing up across runs (e.g., `plane_api.py`). Bundling a script saves every future invocation from rewriting it.
- `references/` — markdown the skill body points the model at. Use this for guidance, schemas, decision trees, examples.
- `assets/` — files the skill produces or templates from (icons, fonts, HTML templates). Rare in this repo.

## Workflow

```bash
# Edit skill.yml or SKILL.md body, then:
make build    # regenerate MANIFEST, plugin.json files, frontmatter, template copies
make lint     # verify everything is in sync
```

Adding a new skill:

1. `mkdir skills/<name> && cd skills/<name>`
2. Create `skill.yml` with the schema above.
3. Create `SKILL.md` with the required sections (frontmatter is overwritten by build).
4. Add any skill-specific files under `references/`.
5. Run `make build && make lint`.
6. Commit. The build also creates the `.claude-plugin/`, `.codex-plugin/`, and `MANIFEST` files.

## Versioning

- Bump `version` in `skill.yml` on any substantive change to the skill body, references, or includes.
- Append a one-line entry at the top of `CHANGELOG.md`: `## 0.2.0 — 2026-05-12 — short note`.
- Lint requires the `version` in `skill.yml` to match the latest version in `CHANGELOG.md`.

## What lint enforces

- `skill.yml` parses; `name` matches directory.
- `SKILL.md` frontmatter equals what build would generate.
- Both `plugin.json` files equal what build would generate (and match each other).
- Every shipped template copy is byte-identical to `templates/references/<name>.md`.
- Every `references/<file>.md` cited in SKILL.md exists on disk.
- No SKILL.md links cross the skill directory boundary.
- `MANIFEST` matches the actual file tree.
- `version` in `skill.yml` matches the top entry in `CHANGELOG.md`.
- Marketplace parity: `.claude-plugin/marketplace.json` and `.codex-plugin/marketplace.json` are byte-identical, and every advertised plugin entry has a matching `skills/<name>/skill.yml` with the same `version`.
- README claim parity: the count in `exposes <N> installable skills` matches the marketplace plugin count (digit or English numeral).
- Capability-claim parity: a `skill.yml` description that promises "quality gates", "anti-patterns", or "rubric" must list the matching template (`quality-gates` or `benchmark-quality`) in `includes:`.

Soft warnings (do not fail the build unless `--strict` is set):

- Missing `## References` section.
- Missing `## Trust Boundary` section.
- `base-operating-layer` in includes but no `## Base Operating Layer` section in SKILL.md.
- A `references/<file>.md` exists on disk but is neither declared in `includes:` nor cited from SKILL.md (orphaned bundled reference).

Run `node scripts/lint-skills.js --strict` to promote every soft warning to a hard error — useful before publishing a new skill.

## What lint does **not** check

- Prose quality, factual accuracy, or whether `description` triggers will route correctly.
- Whether per-skill `external-event-integrity.md` files agree with each other (they are intentionally role-tailored; drift on the shared "Required Invariants" block is on the human reviewer).
- Whether referenced external commands exist (e.g., `mmdc`, `semgrep`, `gh`).

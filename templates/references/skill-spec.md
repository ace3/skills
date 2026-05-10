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

## SKILL.md required sections

Every SKILL.md must contain:

- `## References` — bullet list pointing only to its **own** `references/<file>.md` (no `../` paths)
- `## Trust Boundary` — list of untrusted input sources for this skill, plus the "instruction precedence" rule

Every SKILL.md that includes `base-operating-layer` must also contain `## Base Operating Layer` pointing to `references/base-operating-layer.md`.

Every SKILL.md that includes `output-contracts` should reference the appropriate bundle shape (Findings / Plan / Routing) from `references/output-contracts.md` in its `## Output Contract` section.

The body must be self-contained — never reference content outside the skill's own directory. The `make lint` step rejects `../_shared/`, `../<other-skill>/`, etc.

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

Soft warnings (do not fail the build):

- Missing `## References` section.
- Missing `## Trust Boundary` section.
- `base-operating-layer` in includes but no `## Base Operating Layer` section in SKILL.md.

## What lint does **not** check

- Prose quality, factual accuracy, or whether `description` triggers will route correctly.
- Whether per-skill `external-event-integrity.md` files agree with each other (they are intentionally role-tailored; drift on the shared "Required Invariants" block is on the human reviewer).
- Whether referenced external commands exist (e.g., `mmdc`, `semgrep`, `gh`).

# Skill Specification

The canonical spec lives at [`templates/references/skill-spec.md`](../templates/references/skill-spec.md).

It is the single source of truth: every skill that ships the spec (currently `skill-author`) gets a byte-identical copy via the build pipeline, and `make lint` enforces parity. Edit the template, then run `make build`.

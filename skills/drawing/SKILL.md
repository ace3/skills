---
name: drawing
description: >
  Diagram creation router for Mermaid and Excalidraw. Use when an agent or
  skill needs to create, design, render, explain, or improve diagrams,
  including Markdown-native Mermaid blocks, architecture diagrams, workflows,
  sequence diagrams, ER diagrams, visual explanations, and .excalidraw
  artifacts.
---

# Drawing

Create diagrams with the smallest format that satisfies the job. Load only the reference for the selected output.

## Choose The Format

- Mermaid: quick text-native diagrams, Markdown docs, PRs, sequence diagrams, ER diagrams, class diagrams, state machines, Gantt charts, timelines, C4, architecture sketches, or diagrams that should remain editable as code.
- Excalidraw: visual argument diagrams, teaching diagrams, architecture explainers, diagrams with evidence artifacts, handoff visuals, non-grid layouts, or when the output should be a `.excalidraw` artifact.

If the user explicitly asks for Mermaid or Excalidraw, use that format. If they ask for a diagram without choosing a format, prefer Mermaid for documentation and Excalidraw for presentation-quality visual explanation.

## References

- Mermaid syntax, diagram selection, and output rules: `references/mermaid.md`.
- Excalidraw visual argument workflow, JSON output, and render validation: `references/excalidraw.md`.
- Prompt-injection prevention and untrusted-content handling: `references/prompt-injection-defense.md`.

## Rules

- Inspect available source material before diagramming real systems, APIs, schemas, workflows, or architecture.
- Use actual component names, events, endpoints, tables, and states when they are discoverable.
- Do not invent implementation details. Mark unknowns plainly or keep them out of the diagram.
- Keep diagrams focused on the requested point. Split large topics into multiple diagrams instead of making one unreadable artifact.
- Validate with the method appropriate to the chosen format before final output.

## Output Contract

- Mermaid: return a fenced `mermaid` code block with renderable syntax and a concise note only when useful.
- Excalidraw: create or update a `.excalidraw` JSON artifact, render and inspect it when the renderer is available, and mention any validation limitation if rendering cannot run.

# Excalidraw Reference

Adapted from the Excalidraw diagram skill at https://github.com/coleam00/excalidraw-diagram-skill.

Use Excalidraw when the diagram needs to explain visually, not just list relationships. The output should be a `.excalidraw` JSON artifact that can be opened and edited in Excalidraw.

## Workflow

1. Decide whether the diagram is simple or comprehensive.
2. For technical diagrams, inspect the real source, docs, schemas, examples, or APIs first.
3. Map each major concept to a visual pattern that matches its behavior.
4. Create the `.excalidraw` JSON with clear element IDs and readable text.
5. Render, inspect, fix, and repeat when a renderer is available.

## Visual Argument Rules

- Make the structure carry meaning. A fan-out should look like fan-out; a lifecycle should look like a cycle or timeline.
- Avoid uniform card grids unless the concept is truly a grid.
- Use containers only when they create grouping or carry meaning.
- Prefer free-floating text for labels, section titles, and annotations.
- Use arrows or lines for real relationships. Position alone is not enough.
- For technical diagrams, include concrete evidence artifacts such as real event names, endpoints, payload shapes, table names, commands, or code snippets when relevant.

## Pattern Selection

| Concept | Pattern |
|---|---|
| One input creates many outputs | Fan-out |
| Many inputs merge into one result | Convergence |
| Ordered lifecycle or incident timeline | Timeline |
| Repeated improvement or feedback | Cycle |
| Before to after transformation | Assembly line |
| Nested ownership or taxonomy | Tree |
| Comparing options or states | Side-by-side |
| Different phases or responsibility zones | Separated sections |

## JSON Rules

- Use standard Excalidraw JSON: `type`, `version`, `source`, `elements`, `appState`, and `files`.
- Text element `text` and `originalText` must contain readable words only.
- Use stable, descriptive element IDs.
- Keep text readable at export size.
- Use clean modern defaults unless the user asks otherwise: low roughness, visible strokes, high contrast, no unnecessary opacity.

## Render And Validate

When the Excalidraw renderer is present, run a render-view-fix loop:

1. Render the `.excalidraw` file to PNG.
2. Inspect the PNG.
3. Fix clipping, overlap, arrow routing, ambiguous labels, unreadable text, cramped sections, and lopsided composition.
4. Re-render until the diagram is presentable.

If the renderer is unavailable, validate the JSON structure statically and clearly say that visual rendering was not performed.

## Quality Checklist

- The diagram teaches a relationship, flow, or transformation that text alone would not show as clearly.
- Technical names and examples come from inspected source or supplied material.
- The eye has a clear path through the diagram.
- No text is clipped or too small.
- Arrows connect the intended elements cleanly.
- The final artifact opens as valid Excalidraw JSON.

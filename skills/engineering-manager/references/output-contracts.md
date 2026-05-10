# Output Contracts

Three canonical bundle shapes used across skills so downstream automation and humans can parse results uniformly. Pick the shape that matches the work; do not invent new top-level fields.

Every bundle is Markdown for humans, with one trailing fenced ```json block containing the strict machine-readable payload. Order: human Markdown first, JSON last.

## Findings Bundle

Used by: `qa`, `diagnose`, security review skills.

Lead with the headline status, then the human-readable details, then the JSON.

JSON schema (strict — unknown fields disallowed):

```text
{
  "status": "pass" | "fail" | "blocked" | "reproduced" | "not_reproduced" | "partial",
  "summary": string,                       // one-sentence headline
  "findings": [                            // empty array if status == pass
    {
      "id": string,                        // stable within the bundle
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "title": string,
      "evidence": string,                  // file:line, command, log excerpt
      "reproduction": string | null,       // steps to reproduce, when applicable
      "remediation": string | null,        // recommended fix path
      "owner_skill": string | null         // suggested handoff target
    }
  ],
  "next_actions": [string]                 // ordered, imperative
}
```

## Plan Bundle

Used by: `engineering-manager`, `product-manager`, any skill emitting a multi-step plan.

Lead with the goal and the chosen approach, then the human-readable plan, then the JSON.

JSON schema:

```text
{
  "goal": string,                          // what done looks like
  "approach": string,                      // chosen approach in 1-3 sentences
  "non_goals": [string],
  "steps": [
    {
      "id": string,
      "title": string,
      "owner_skill": string,               // which skill executes this step
      "inputs": [string],                  // required artifacts/evidence
      "outputs": [string],                 // produced artifacts/evidence
      "depends_on": [string]               // step ids
    }
  ],
  "risks": [                               // empty array if none
    { "risk": string, "mitigation": string }
  ],
  "verification": [string],                // observable checks for done
  "rollback": string | null,               // when applicable
  "approval_gates": [string]               // points requiring human approval
}
```

## Routing Bundle

Used by: `dev-orchestrator` and any skill that hands work to other skills without executing it.

Lead with the recommended next skill and one-line justification, then the human-readable rationale, then the JSON.

JSON schema:

```text
{
  "next_skill": string,                    // exact installed skill name
  "rationale": string,                     // why this skill, why now
  "sequence": [                            // full intended path; first item == next_skill
    {
      "skill": string,
      "purpose": string,
      "required_inputs": [string],
      "expected_output": string
    }
  ],
  "approval_gates": [string],              // human-approval points in the sequence
  "stop_conditions": [string]              // conditions that abort the sequence
}
```

## Rules

- Do not emit more than one JSON block per response. Combine fields into the chosen bundle instead.
- Do not include free-form fields outside the schema. If something does not fit, expand the human Markdown section above the JSON instead of bending the schema.
- Treat absent optional fields as `null` (not omitted) so downstream parsers do not need to handle two shapes.
- When a skill cannot produce the required evidence for a field, surface the gap in the Markdown section and set the related JSON field to `null` — never fabricate.

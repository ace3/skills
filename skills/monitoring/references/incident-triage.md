# Incident Triage

Use for symptom/root-cause separation, alert review, CI/ops signal review, and incident-ready summaries.

## Procedure

1. Establish incident window, affected users, environments, services, and recent changes.
2. Separate symptoms from candidate causes across user path, app, dependency, container, host, and cloud layers.
3. Use dashboards, logs, traces, alerts, deploy history, CI state, and infrastructure status as evidence.
4. Form hypotheses that can be disproven quickly.
5. Recommend containment only when evidence supports it.

## Output

- Current impact.
- Timeline.
- Leading hypotheses with evidence for and against.
- Immediate checks, mitigation options, owner, and rollback or escalation trigger.

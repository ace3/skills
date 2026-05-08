# Dashboard And Alert Design

Use for Grafana dashboards, SLI/SLO design, alert thresholds, and runbook linkage.

## Procedure

1. Define the user journey or operational objective before selecting panels.
2. Choose SLIs for availability, latency, errors, saturation, and dependency health.
3. Design dashboards with overview, service drilldown, dependency, host, and deploy correlation sections.
4. Create alerts only when they indicate user impact or require action.
5. Require owner, severity, runbook, threshold rationale, and noise review for every alert.

## Patterns

- Use RED for request-driven services: rate, errors, duration.
- Use USE for infrastructure: utilization, saturation, errors.
- Prefer percentile latency over averages.
- Avoid high-cardinality labels unless they are needed for incident response.

## Output

- Dashboard purpose and panel list.
- Alert rules with thresholds, severity, owner, and runbook.
- Verification against historical data or synthetic checks.

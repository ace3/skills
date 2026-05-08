# Telemetry Coverage

Use for logs, metrics, traces, OpenTelemetry, host inventory, version drift, and blind-spot analysis.

## Procedure

1. Map critical flows, dependencies, queues, batch jobs, and admin operations.
2. Verify logs capture who, what, target, result, latency, error, and correlation IDs for sensitive actions.
3. Verify metrics cover request rate, error rate, latency, saturation, restarts, resource pressure, and dependency failures.
4. Verify traces preserve enough sampling and attributes to debug incidents without leaking secrets.
5. Check host and package inventory through OS inventory, osquery, or equivalent read-only source.

## Gap Types

- Missing signal: no visibility for a critical flow.
- Weak label: signal exists but cannot identify service, route, dependency, or environment.
- Cost risk: label cardinality or trace volume can grow without bound.
- Drift risk: runtime, package, image, or config version cannot be audited.

## Output

- Coverage matrix.
- Blind spots ranked by incident impact.
- Minimal instrumentation or inventory changes.

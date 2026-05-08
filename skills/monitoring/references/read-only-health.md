# Read-Only Health

Use for Grafana, Prometheus, GCP, MIG, Docker, Node Exporter, osquery, and host or service health checks.

## Allowed By Default

- PromQL queries and Grafana dashboard or alert reads.
- GCP Cloud Monitoring, Cloud Asset Inventory, Cloud DNS record reads, OS inventory, and MIG describe/status reads.
- Docker info, image metadata, service inspect, and Compose/Swarm status reads.
- Node Exporter metrics and osquery read-only inventory.

## Procedure

1. Identify service, environment, owner, and critical user path.
2. Check health from the real request path where possible, then backend/runtime signals.
3. Inspect saturation, errors, latency, restarts, disk, memory, CPU, filesystem, package/version drift, and dependency state.
4. Compare current state to expected baseline and recent deployment or incident history.
5. Report only actionable deviations.

## Output

- Health status.
- Evidence by layer: user path, app, container, host, cloud, observability.
- Risks, owners, and next checks.

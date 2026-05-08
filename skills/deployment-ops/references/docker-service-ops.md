# Docker Service Ops

Use for Docker Engine, Compose, Swarm, service inspection, image swaps, service update, and rollback.

## Procedure

1. Inspect current service, image digest, replicas, ports, mounts, env, health checks, networks, and logs.
2. Confirm whether Compose or Swarm is the control surface.
3. Prepare exact command or API diff for image, env, resource, or rollout changes.
4. For Swarm, define update order, parallelism, delay, monitor window, and rollback policy.
5. For Compose, prefer targeted `pull` and `up -d --no-deps` where service-only refresh is intended.
6. Verify container health, logs, ports, service discovery, and real request paths.

## Safety

Docker daemon access is privileged. Do not execute mutation without explicit approval and rollback command.

## Output

- Current service state.
- Proposed command or API diff.
- Rollout and rollback commands.
- Verification checks.

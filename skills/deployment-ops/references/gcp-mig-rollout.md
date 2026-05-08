# GCP MIG Rollout

Use for GCP managed instance groups, instance templates, Cloud DNS, load balancers, and real-path verification.

## Procedure

1. Inspect current MIG health, group stability, autohealing, current template, target size, and recent errors.
2. Confirm load balancer, named ports, DNS, firewall, and backend service expectations before rollout.
3. Prepare an exact update plan with target template, rollout type, batch size, health gates, and rollback template.
4. Execute only after approval and short-lived credentials when mutation is required.
5. Verify through external or internal request paths, then backend health and logs.

## Rollback Trigger Examples

- MIG fails to stabilize.
- Backend health drops below agreed threshold.
- Real request path returns elevated errors or latency.
- Logs show startup, config, auth, or dependency failures.

## Output

- Current state.
- Rollout plan.
- Rollback plan.
- Verification evidence by request path, LB/backend, instance, and app logs.

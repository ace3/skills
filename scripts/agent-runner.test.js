const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  AGENT_SEQUENCE,
  buildAgentPrompt,
  buildPlaneRequests,
  createInitialState,
  decideNextAgent,
  hasFailingQa,
  loadAgentManifests,
  parseArgs,
  parsePlaneTarget,
  resetImplementationLoopIfNeeded
} = require("./agent-runner.js");

test("loads and validates all required agent manifests", () => {
  const agents = loadAgentManifests(path.join(__dirname, "..", "agents"));
  assert.deepEqual(Object.keys(agents).sort(), [...AGENT_SEQUENCE].sort());
  assert.equal(agents["pm-agent"].skill, "product-manager");
  assert.equal(agents["em-agent"].gate, "em_review");
  assert.equal(agents["qa-tester-agent"].outputs.includes("defects.md"), true);
});

test("parses Plane work item key and URL context", () => {
  assert.deepEqual(parsePlaneTarget("PAY-123").key, "PAY-123");
  const parsed = parsePlaneTarget("https://app.plane.so/acme/projects/project-uuid/work-items/PAY-123/");
  assert.equal(parsed.key, "PAY-123");
  assert.equal(parsed.workspaceSlug, "acme");
  assert.equal(parsed.projectId, "project-uuid");
  assert.equal(parsed.workItemId, "PAY-123");
});

test("parses runner arguments with approval and dry-run flags", () => {
  const opts = parseArgs(["run", "PAY-123", "--repo", "/tmp/repo", "--dry-run", "--approve-pm", "--workspace", "acme", "--work-item-id", "work-item-uuid"]);
  assert.equal(opts.target, "PAY-123");
  assert.equal(opts.repo, "/tmp/repo");
  assert.equal(opts.dryRun, true);
  assert.equal(opts.approvePm, true);
  assert.equal(opts.workspaceSlug, "acme");
  assert.equal(opts.workItemId, "work-item-uuid");
  assert.equal(opts.runDir, "/tmp/repo/.ace3/runs/PAY-123");
});

test("state transitions stop at PM and EM review gates", () => {
  const opts = parseArgs(["run", "PAY-123", "--repo", "/tmp/repo"]);
  const state = createInitialState(opts);
  assert.deepEqual(decideNextAgent(state), { agent: "pm-agent" });

  state.completedAgents.push("pm-agent");
  assert.equal(decideNextAgent(state).status, "awaiting_pm_review");

  state.approvals.pm = true;
  assert.deepEqual(decideNextAgent(state), { agent: "em-agent" });

  state.completedAgents.push("em-agent");
  assert.equal(decideNextAgent(state).status, "awaiting_em_review");

  state.approvals.em = true;
  assert.deepEqual(decideNextAgent(state), { agent: "backend-agent" });
});

test("Plane request builder emits update and comment requests without credentials", () => {
  const requests = buildPlaneRequests({
    workspaceSlug: "acme",
    projectId: "project-uuid",
    workItemId: "work-item-uuid",
    stateId: "state-uuid",
    stateName: "QA",
    commentHtml: "<p>ready</p>",
    externalId: "ace3-PAY-123-qa"
  });
  assert.equal(requests.length, 2);
  assert.equal(requests[0].method, "PATCH");
  assert.equal(requests[0].path, "/api/v1/workspaces/acme/projects/project-uuid/work-items/work-item-uuid/");
  assert.deepEqual(requests[0].body, {
    external_source: "ace3-agent-runner",
    external_id: "ace3-PAY-123-qa",
    state: "state-uuid"
  });
  assert.equal(requests[1].method, "POST");
  assert.equal(requests[1].path.endsWith("/comments/"), true);
  assert.equal(requests[1].body.access, "INTERNAL");
});

test("QA failure resets implementation agents until max iteration", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ace3-agent-test-"));
  const opts = parseArgs(["run", "PAY-123", "--repo", dir, "--max-iterations", "2"]);
  opts.runDir = dir;
  const state = createInitialState(opts);
  state.approvals.pm = true;
  state.approvals.em = true;
  state.completedAgents = [...AGENT_SEQUENCE];
  state.artifacts["qa-results.md"] = path.join(dir, "qa-results.md");
  fs.writeFileSync(state.artifacts["qa-results.md"], '{"status":"fail","findings":[]}\n');

  assert.equal(hasFailingQa(state, dir), true);
  assert.equal(resetImplementationLoopIfNeeded(state, opts), true);
  assert.equal(state.iteration, 2);
  assert.equal(state.completedAgents.includes("pm-agent"), true);
  assert.equal(state.completedAgents.includes("backend-agent"), false);
  assert.deepEqual(decideNextAgent(state), { agent: "backend-agent" });
});

test("agent prompt names declared inputs and output artifacts", () => {
  const agents = loadAgentManifests(path.join(__dirname, "..", "agents"));
  const opts = parseArgs(["run", "PAY-123", "--repo", "/tmp/repo", "--run-dir", "/tmp/repo/.ace3/runs/PAY-123"]);
  const state = createInitialState(opts);
  const prompt = buildAgentPrompt(agents["qa-manager-agent"], state, opts);
  assert.match(prompt, /Use qa-manager\./);
  assert.match(prompt, /prd\.md/);
  assert.match(prompt, /engineering-plan\.md/);
  assert.match(prompt, /qa-plan\.md/);
});

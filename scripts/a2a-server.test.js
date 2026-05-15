const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  buildAgentCard,
  createServer,
  extractPlaneTarget,
  handleJsonRpc,
  lifecycleOptionsFromA2A,
  mapLifecycleStatus,
  parseArgs
} = require("./a2a-server.js");

function postJson(port, body) {
  return new Promise((resolve, reject) => {
    const raw = JSON.stringify(body);
    const req = http.request({
      host: "127.0.0.1",
      port,
      path: "/a2a",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(raw)
      }
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({
        status: res.statusCode,
        body: JSON.parse(Buffer.concat(chunks).toString("utf8"))
      }));
    });
    req.on("error", reject);
    req.write(raw);
    req.end();
  });
}

function getJson(port, route) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port, path: route }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({
        status: res.statusCode,
        body: JSON.parse(Buffer.concat(chunks).toString("utf8"))
      }));
    }).on("error", reject);
  });
}

test("builds an A2A agent card from lifecycle agent manifests", () => {
  const card = buildAgentCard("http://127.0.0.1:8787");
  assert.equal(card.protocolVersion, "0.2.6");
  assert.equal(card.url, "http://127.0.0.1:8787/a2a");
  assert.equal(card.preferredTransport, "JSONRPC");
  assert.equal(card.capabilities.stateTransitionHistory, true);
  assert.equal(card.skills.some((skill) => skill.id === "pm-agent"), true);
  assert.equal(card.skills.some((skill) => skill.id === "qa-tester-agent"), true);
});

test("extracts lifecycle options from A2A message metadata and data parts", () => {
  const opts = parseArgs(["--repo", "/tmp/repo", "--workspace", "acme"]);
  const lifecycle = lifecycleOptionsFromA2A({
    message: {
      parts: [
        { kind: "text", text: "Run this task" },
        { kind: "data", data: { planeTarget: "API-123", approvePm: true } }
      ]
    },
    metadata: { approveEm: true, workItemId: "work-item-uuid" }
  }, opts);

  assert.equal(lifecycle.target, "API-123");
  assert.equal(lifecycle.repo, "/tmp/repo");
  assert.equal(lifecycle.workspaceSlug, "acme");
  assert.equal(lifecycle.workItemId, "work-item-uuid");
  assert.equal(lifecycle.approvePm, true);
  assert.equal(lifecycle.approveEm, true);
  assert.equal(lifecycle.dryRun, true);
});

test("maps lifecycle statuses to A2A task states", () => {
  assert.equal(mapLifecycleStatus("awaiting_pm_review"), "input-required");
  assert.equal(mapLifecycleStatus("done"), "completed");
  assert.equal(mapLifecycleStatus("blocked"), "failed");
  assert.equal(mapLifecycleStatus("implementation"), "working");
});

test("handles message/send and tasks/get with dry-run lifecycle artifacts", async () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "ace3-a2a-repo-"));
  const runRoot = path.join(repo, ".ace3", "a2a");
  const request = {
    jsonrpc: "2.0",
    id: "req-1",
    method: "message/send",
    params: {
      message: {
        role: "user",
        messageId: "msg-1",
        kind: "message",
        parts: [{ kind: "text", text: "Please run API-123" }]
      },
      metadata: {
        workspaceSlug: "acme",
        projectId: "project-uuid",
        workItemId: "work-item-uuid"
      }
    }
  };

  const sent = await handleJsonRpc(request, {
    repo,
    runRoot,
    execute: false,
    applyPlane: false,
    maxIterations: 2,
    maxSteps: 1
  });
  assert.equal(sent.result.kind, "task");
  assert.equal(sent.result.status.state, "input-required");
  assert.equal(fs.existsSync(path.join(repo, ".ace3", "a2a", "runs", "API-123", "prd.md")), true);

  const fetched = await handleJsonRpc({
    jsonrpc: "2.0",
    id: "req-2",
    method: "tasks/get",
    params: { id: sent.result.id }
  }, { repo, runRoot });
  assert.equal(fetched.result.id, sent.result.id);
});

test("serves Agent Card and JSON-RPC over HTTP", async () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "ace3-a2a-http-"));
  const server = createServer({
    host: "127.0.0.1",
    port: 0,
    repo,
    runRoot: path.join(repo, ".ace3", "a2a"),
    baseUrl: "http://127.0.0.1:0",
    execute: false,
    maxIterations: 2,
    maxSteps: 1
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  try {
    const card = await getJson(port, "/.well-known/agent.json");
    assert.equal(card.status, 200);
    assert.equal(card.body.name, "Ace3 Plane Lifecycle Agent");

    const response = await postJson(port, {
      jsonrpc: "2.0",
      id: 1,
      method: "message/send",
      params: {
        message: {
          role: "user",
          messageId: "msg-1",
          kind: "message",
          parts: [{ kind: "text", text: "API-123" }]
        }
      }
    });
    assert.equal(response.status, 200);
    assert.equal(response.body.result.kind, "task");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("extracts Plane keys from plain text", () => {
  assert.equal(extractPlaneTarget("please run NOBI-42 now"), "NOBI-42");
  assert.equal(extractPlaneTarget("no key here"), null);
});

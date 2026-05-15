#!/usr/bin/env node

const fs = require("fs");
const http = require("http");
const path = require("path");
const { randomUUID } = require("crypto");
const {
  loadAgentManifests,
  parsePlaneTarget,
  runLifecycle
} = require("./agent-runner.js");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const A2A_VERSION = "0.2.6";

function parseArgs(argv) {
  const opts = {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    repo: process.cwd(),
    runRoot: null,
    baseUrl: null,
    execute: false,
    applyPlane: false,
    workspaceSlug: process.env.PLANE_WORKSPACE_SLUG || null,
    projectId: process.env.PLANE_PROJECT_ID || null,
    workItemId: process.env.PLANE_WORK_ITEM_ID || null,
    maxIterations: 2,
    maxSteps: 20
  };

  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    switch (arg) {
      case "--host":
        opts.host = requireValue(args, arg);
        break;
      case "--port":
        opts.port = parsePositiveInt(requireValue(args, arg), arg);
        break;
      case "--repo":
      case "-C":
        opts.repo = path.resolve(requireValue(args, arg));
        break;
      case "--run-root":
        opts.runRoot = path.resolve(requireValue(args, arg));
        break;
      case "--base-url":
        opts.baseUrl = requireValue(args, arg).replace(/\/+$/, "");
        break;
      case "--workspace":
        opts.workspaceSlug = requireValue(args, arg);
        break;
      case "--project":
        opts.projectId = requireValue(args, arg);
        break;
      case "--work-item-id":
        opts.workItemId = requireValue(args, arg);
        break;
      case "--max-iterations":
        opts.maxIterations = parsePositiveInt(requireValue(args, arg), arg);
        break;
      case "--max-steps":
        opts.maxSteps = parsePositiveInt(requireValue(args, arg), arg);
        break;
      case "--execute":
        opts.execute = true;
        break;
      case "--apply-plane":
        opts.applyPlane = true;
        break;
      case "--help":
      case "-h":
        opts.help = true;
        break;
      default:
        throw new Error(`unknown A2A option: ${arg}`);
    }
  }
  opts.runRoot = opts.runRoot || path.join(opts.repo, ".ace3", "a2a");
  opts.baseUrl = opts.baseUrl || `http://${opts.host}:${opts.port}`;
  return opts;
}

function requireValue(args, flag) {
  const value = args.shift();
  if (!value || value.startsWith("-")) throw new Error(`${flag} requires a value`);
  return value;
}

function parsePositiveInt(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${flag} must be a positive integer`);
  return parsed;
}

function buildAgentCard(baseUrl, agents = loadAgentManifests()) {
  const skills = Object.values(agents).map((agent) => ({
    id: agent.name,
    name: agent.name,
    description: agent.description,
    tags: [agent.skill, agent.phase],
    examples: [`Run ${agent.name} for a Plane-tracked delivery lifecycle.`],
    inputModes: ["application/json", "text/plain"],
    outputModes: ["application/json", "text/markdown"]
  }));

  return {
    protocolVersion: A2A_VERSION,
    name: "Ace3 Plane Lifecycle Agent",
    description: "Local A2A facade for Ace3 PM, EM, implementation, and QA lifecycle agents backed by Codex CLI and Plane work items.",
    url: `${baseUrl}/a2a`,
    preferredTransport: "JSONRPC",
    additionalInterfaces: [{ url: `${baseUrl}/a2a`, transport: "JSONRPC" }],
    provider: {
      organization: "ace3",
      url: "https://github.com/ace3/skills"
    },
    version: "0.1.0",
    documentationUrl: `${baseUrl}/`,
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: true
    },
    defaultInputModes: ["application/json", "text/plain"],
    defaultOutputModes: ["application/json", "text/markdown"],
    skills,
    supportsAuthenticatedExtendedCard: false
  };
}

function jsonRpcSuccess(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: "2.0", id: id ?? null, error };
}

function messageText(message) {
  if (!message || !Array.isArray(message.parts)) return "";
  return message.parts
    .map((part) => {
      if (part.kind === "text") return part.text || "";
      if (part.kind === "data") return JSON.stringify(part.data || {});
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function dataParts(message) {
  if (!message || !Array.isArray(message.parts)) return [];
  return message.parts.filter((part) => part.kind === "data").map((part) => part.data || {});
}

function lifecycleOptionsFromA2A(params, serverOpts) {
  const metadata = params?.metadata || {};
  const messageMetadata = params?.message?.metadata || {};
  const data = Object.assign({}, ...dataParts(params?.message));
  const text = messageText(params?.message);
  const target = metadata.planeTarget || messageMetadata.planeTarget || data.planeTarget || data.target || extractPlaneTarget(text);
  if (!target) throw new Error("message/send requires metadata.planeTarget, a data part target, or a Plane key in text.");

  const parsed = parsePlaneTarget(target);
  const runDir = metadata.runDir
    ? path.resolve(metadata.runDir)
    : path.join(serverOpts.runRoot, "runs", safePathPart(parsed.key || "a2a-task"));

  return {
    target,
    repo: path.resolve(metadata.repo || data.repo || serverOpts.repo),
    runDir,
    dryRun: metadata.dryRun !== undefined ? Boolean(metadata.dryRun) : !serverOpts.execute,
    applyPlane: Boolean(metadata.applyPlane ?? serverOpts.applyPlane),
    approvePm: Boolean(metadata.approvePm ?? data.approvePm),
    approveEm: Boolean(metadata.approveEm ?? data.approveEm),
    workspaceSlug: metadata.workspaceSlug || data.workspaceSlug || serverOpts.workspaceSlug || parsed.workspaceSlug,
    projectId: metadata.projectId || data.projectId || serverOpts.projectId || parsed.projectId,
    workItemId: metadata.workItemId || data.workItemId || serverOpts.workItemId || parsed.workItemId,
    baseUrl: metadata.planeBaseUrl || data.planeBaseUrl || process.env.PLANE_API_BASE || "https://api.plane.so",
    maxIterations: Number(metadata.maxIterations || data.maxIterations || serverOpts.maxIterations),
    maxSteps: Number(metadata.maxSteps || data.maxSteps || serverOpts.maxSteps),
    key: parsed.key,
    parsedTarget: parsed
  };
}

function extractPlaneTarget(text) {
  const match = String(text || "").match(/\b[A-Z][A-Z0-9]+-\d+\b/);
  return match ? match[0] : null;
}

function safePathPart(value) {
  return String(value).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "task";
}

function taskFromRunResult(taskId, contextId, result) {
  const state = mapLifecycleStatus(result.state.status);
  const artifacts = Object.entries(result.state.artifacts || {}).map(([name, file]) => ({
    artifactId: name,
    name,
    parts: [
      {
        kind: "file",
        file: {
          name,
          mimeType: name.endsWith(".json") ? "application/json" : "text/markdown",
          uri: `file://${file}`
        }
      }
    ],
    metadata: { path: file }
  }));

  return {
    id: taskId,
    contextId,
    kind: "task",
    status: {
      state,
      timestamp: new Date().toISOString(),
      message: {
        role: "agent",
        messageId: `${taskId}-status`,
        kind: "message",
        parts: [{ kind: "text", text: result.message }]
      }
    },
    artifacts,
    metadata: {
      runState: null,
      lifecycleStatus: result.state.status,
      runId: result.state.runId,
      plane: result.state.plane
    }
  };
}

function mapLifecycleStatus(status) {
  if (status === "done") return "completed";
  if (status === "blocked") return "failed";
  if (status === "awaiting_pm_review" || status === "awaiting_em_review") return "input-required";
  return "working";
}

function taskRecordPath(runRoot, taskId) {
  return path.join(runRoot, "tasks", `${safePathPart(taskId)}.json`);
}

function saveTask(runRoot, task) {
  const file = taskRecordPath(runRoot, task.id);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(task, null, 2) + "\n");
}

function loadTask(runRoot, taskId) {
  const file = taskRecordPath(runRoot, taskId);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function handleJsonRpc(request, serverOpts) {
  if (!request || request.jsonrpc !== "2.0" || !request.method) {
    return jsonRpcError(request?.id, -32600, "Invalid JSON-RPC request.");
  }

  if (request.method === "message/send") {
    const taskId = request.params?.message?.taskId || request.params?.metadata?.taskId || randomUUID();
    const contextId = request.params?.message?.contextId || request.params?.metadata?.contextId || randomUUID();
    try {
      const opts = lifecycleOptionsFromA2A(request.params, serverOpts);
      const result = await runLifecycle(opts);
      const task = taskFromRunResult(taskId, contextId, result);
      task.metadata.runState = path.join(opts.runDir, "run_state.json");
      saveTask(serverOpts.runRoot, task);
      return jsonRpcSuccess(request.id, task);
    } catch (err) {
      const task = {
        id: taskId,
        contextId,
        kind: "task",
        status: {
          state: "failed",
          timestamp: new Date().toISOString(),
          message: {
            role: "agent",
            messageId: `${taskId}-error`,
            kind: "message",
            parts: [{ kind: "text", text: err.message }]
          }
        },
        metadata: { error: err.message }
      };
      saveTask(serverOpts.runRoot, task);
      return jsonRpcSuccess(request.id, task);
    }
  }

  if (request.method === "tasks/get") {
    const taskId = request.params?.id;
    if (!taskId) return jsonRpcError(request.id, -32602, "tasks/get requires params.id.");
    const task = loadTask(serverOpts.runRoot, taskId);
    if (!task) return jsonRpcError(request.id, -32001, "Task not found.");
    return jsonRpcSuccess(request.id, task);
  }

  if (request.method === "tasks/cancel") {
    return jsonRpcError(request.id, -32004, "Cancellation is not implemented in this local POC.");
  }

  return jsonRpcError(request.id, -32601, `Unsupported A2A method: ${request.method}`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  const raw = JSON.stringify(body, null, 2) + "\n";
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(raw)
  });
  res.end(raw);
}

function createServer(serverOpts) {
  const opts = {
    ...serverOpts,
    runRoot: serverOpts.runRoot || path.join(serverOpts.repo || process.cwd(), ".ace3", "a2a")
  };
  const card = buildAgentCard(opts.baseUrl || `http://${opts.host || DEFAULT_HOST}:${opts.port || DEFAULT_PORT}`);

  return http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && (req.url === "/.well-known/agent.json" || req.url === "/.well-known/agent-card")) {
        sendJson(res, 200, card);
        return;
      }
      if (req.method === "GET" && req.url === "/") {
        sendJson(res, 200, {
          name: card.name,
          agentCard: "/.well-known/agent.json",
          jsonRpc: "/a2a",
          methods: ["message/send", "tasks/get"]
        });
        return;
      }
      if (req.method === "POST" && req.url === "/a2a") {
        const raw = await readBody(req);
        let payload;
        try {
          payload = JSON.parse(raw || "{}");
        } catch (err) {
          sendJson(res, 400, jsonRpcError(null, -32700, "Parse error."));
          return;
        }
        const response = await handleJsonRpc(payload, opts);
        sendJson(res, response.error ? 400 : 200, response);
        return;
      }
      sendJson(res, 404, { error: "not_found" });
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
  });
}

function help() {
  return [
    "USAGE",
    "  ace3-skills agent a2a-server [--host 127.0.0.1] [--port 8787] [--repo path] [--execute]",
    "",
    "The server exposes:",
    "  GET  /.well-known/agent.json",
    "  POST /a2a  JSON-RPC methods: message/send, tasks/get",
    "",
    "Default mode is dry-run. Add --execute to allow Codex lifecycle execution."
  ].join("\n");
}

async function main(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  if (opts.help) {
    console.log(help());
    return;
  }
  fs.mkdirSync(opts.runRoot, { recursive: true });
  const server = createServer(opts);
  server.listen(opts.port, opts.host, () => {
    const base = opts.baseUrl || `http://${opts.host}:${opts.port}`;
    console.log(`Ace3 A2A POC listening on ${base}`);
    console.log(`Agent card: ${base}/.well-known/agent.json`);
    console.log(`JSON-RPC: ${base}/a2a`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

module.exports = {
  buildAgentCard,
  createServer,
  extractPlaneTarget,
  handleJsonRpc,
  lifecycleOptionsFromA2A,
  mapLifecycleStatus,
  messageText,
  parseArgs,
  taskFromRunResult
};

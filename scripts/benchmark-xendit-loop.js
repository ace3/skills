#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ACE3_DIR = process.env.ACE3_DIR || path.resolve(__dirname, "..");
const PAYMENT_DIR = process.env.PAYMENT_DIR || "/Users/ignasius/_PROJECT/_NOBI/dki/payment-engine-v2";
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || path.join(ACE3_DIR, ".ace3-benchmark");
const HISTORY_PATH = path.join(ARTIFACT_DIR, "history.json");
const BASE_REF = process.env.BASE_REF || "origin/master";
const ACE3_LOOP_BRANCH = process.env.ACE3_LOOP_BRANCH || "codex/ace3-xendit-benchmark-loop";
const ONCE = isEnabled(process.env.ONCE) || process.argv.includes("--once");
const DRY_RUN = isEnabled(process.env.DRY_RUN) || process.argv.includes("--dry-run");
const REFRESH_BASELINE = isEnabled(process.env.REFRESH_BASELINE) || process.argv.includes("--refresh-baseline");
const PUSH_IMPROVING = process.env.PUSH_IMPROVING !== "0";
const CODEX_MODEL = process.env.CODEX_MODEL || "";

const BASELINE_BRANCHES = [
  { branch: "codex/validate-xendit-callbacks-ace3", label: "ace3 workflow v1" },
  { branch: "codex/validate-xendit-callbacks-ace3-v2", label: "ace3 workflow v2" },
  { branch: "codex/verify-xendit-callbacks-ace3-v3", label: "ace3 workflow v3" },
  { branch: "codex/verify-xendit-callbacks-v4", label: "ace3 workflow v4" }
];

const IMPLEMENT_PROMPT = `use [$feature-delivery:feature-delivery](/Users/ignasius/claude-skills/feature-delivery/SKILL.md)
i want to implement, when i got the xendit callback , i want to check into xendit API ( transaction list ) and check if the transaction is exist, so we can make sure it's not forged.

the APi for xendit can be accessed from
list transactions - https://docs.xendit.co/apidocs/list-transactions
get transaction by id - https://docs.xendit.co/apidocs/get-transaction

i think both can be used. so which one you think is better ?`;

function benchmarkPrompt(entry, history) {
  return `help me benchmark the quality of the agent.

Candidate branch:
- ${entry.branch} (${entry.label})
- commit: ${entry.commit}

Known history:
${formatHistoryForPrompt(history)}

Use [$engineering-manager](/Users/ignasius/_PROJECT/_NOBI/dki/soekarno/skills/engineering-manager/SKILL.md), [$golang-engineer](/Users/ignasius/_PROJECT/_NOBI/dki/soekarno/skills/golang-engineer/SKILL.md), [$golang-developer](/Users/ignasius/_PROJECT/_NOBI/dki/soekarno/skills/upstream-verzth-golang-developer/SKILL.md), [$nobi-golang-pattern](/Users/ignasius/claude-skills/nobi-golang-pattern/SKILL.md), agent [$brainstorming](/Users/ignasius/_PROJECT/_NOBI/dki/soekarno/skills/upstream-superpowers-brainstorming/SKILL.md), and other skills required to benchmark the quality of the development.

Benchmark the candidate against the Xendit callback anti-forgery goal:
- Directly verify the Xendit transaction before state mutation.
- Prefer get-transaction-by-id when a canonical transaction id is available.
- Fail closed when remote verification fails or mismatches.
- Compare local, callback, and remote transaction data.
- Preserve existing payment-engine-v2 conventions.
- Include focused tests.

Return ONLY valid JSON with this exact shape:
{
  "overall_score": 0,
  "scores": {
    "correctness": 0,
    "anti_forgery_strength": 0,
    "go_nobi_convention_fit": 0,
    "test_quality": 0,
    "maintainability": 0,
    "simplicity": 0
  },
  "pros": ["string"],
  "cons": ["string"],
  "recommendations": ["string"],
  "summary": "string"
}`;
}

function improvementPrompt(rejectedEntry, bestEntry) {
  return `use [$skill-creator](/Users/ignasius/claude-skills/skill-creator/SKILL.md)

Autonomous ACE3 benchmark feedback says the current generated payment-engine-v2 candidate did not beat the best historical score.

Rejected candidate:
${JSON.stringify(publicEntry(rejectedEntry), null, 2)}

Best historical candidate:
${JSON.stringify(bestEntry ? publicEntry(bestEntry) : null, null, 2)}

Improve the installed ACE3 skills in this repository so the next run is more likely to produce a better Xendit callback anti-forgery implementation.

Constraints:
- Make the smallest useful skill changes.
- Preserve standalone per-skill installs.
- Do not add broad framework rewrites.
- Keep all content in English.
- Do not weaken security, approval, or destructive-command gates.
- Run repo validation before finishing.
- Return a concise summary of changed skill behavior and verification.`;
}

function main() {
  log(`ACE3_DIR=${ACE3_DIR}`);
  log(`PAYMENT_DIR=${PAYMENT_DIR}`);
  log(`ARTIFACT_DIR=${ARTIFACT_DIR}`);
  log(`mode=${DRY_RUN ? "dry-run" : "active"} once=${ONCE} refreshBaseline=${REFRESH_BASELINE}`);

  preflight();
  const history = loadHistory();

  ensureBaseline(history);
  if (DRY_RUN) {
    log("dry-run complete; no history or git mutations were written");
    return;
  }

  ensureAce3LoopBranch();
  let lastAcceptedAce3 = currentCommit(ACE3_DIR);
  let iteration = 1;

  while (true) {
    const iterationId = newRunId(iteration);
    const iterationDir = path.join(ARTIFACT_DIR, iterationId);
    fs.mkdirSync(iterationDir, { recursive: true });

    const bestBefore = bestEntry(history);
    const candidate = generateCandidate(iteration, iterationDir);
    runPaymentTests(iterationDir);
    commitPaymentCandidate(candidate);
    benchmarkBranch(candidate, history, iterationDir);
    const accepted = candidate.overall_score > (bestBefore?.overall_score ?? -1);
    candidate.status = accepted ? "accepted" : "rejected";
    candidate.acceptance_reason = accepted
      ? `score ${candidate.overall_score} beat previous best ${bestBefore?.overall_score ?? "none"}`
      : `score ${candidate.overall_score} did not beat previous best ${bestBefore?.overall_score ?? "none"}`;
    history.entries.push(candidate);
    history.best_score = bestEntry(history)?.overall_score ?? null;
    history.best_branch = bestEntry(history)?.branch ?? null;
    saveHistory(history);

    if (accepted) {
      log(`accepted ${candidate.branch}: ${candidate.acceptance_reason}`);
      if (PUSH_IMPROVING) run("git", ["push", "-u", "origin", candidate.branch], { cwd: PAYMENT_DIR });
      if (hasChanges(ACE3_DIR)) {
        run("git", ["add", "."], { cwd: ACE3_DIR });
        run("git", ["commit", "-m", `Improve ACE3 skills from Xendit benchmark ${iteration}`], { cwd: ACE3_DIR });
      }
      lastAcceptedAce3 = currentCommit(ACE3_DIR);
      if (PUSH_IMPROVING) run("git", ["push", "-u", "origin", currentBranch(ACE3_DIR)], { cwd: ACE3_DIR });
    } else {
      log(`rejected ${candidate.branch}: ${candidate.acceptance_reason}`);
      resetAce3To(lastAcceptedAce3);
      improveAce3(candidate, bestBefore, iterationDir);
      run("make", ["validate"], { cwd: ACE3_DIR });
      run("make", ["install"], { cwd: ACE3_DIR });
      if (hasChanges(ACE3_DIR)) {
        run("git", ["add", "."], { cwd: ACE3_DIR });
        run("git", ["commit", "-m", `Tune ACE3 skills from rejected Xendit benchmark ${iteration}`], { cwd: ACE3_DIR });
      }
    }

    if (ONCE) {
      log("ONCE=1 set; stopping after one active iteration");
      return;
    }
    iteration += 1;
  }
}

function preflight() {
  for (const command of ["git", "node", "make", "codex"]) {
    run("sh", ["-lc", `command -v ${command}`], { cwd: ACE3_DIR });
  }
  ensureRepoClean(ACE3_DIR, "ace3-skills");
  ensureRepoClean(PAYMENT_DIR, "payment-engine-v2");
  for (const item of BASELINE_BRANCHES) ensureRef(PAYMENT_DIR, item.branch);
  ensureRef(PAYMENT_DIR, BASE_REF);

  if (!DRY_RUN) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  run("make", ["validate"], { cwd: ACE3_DIR });
  if (!DRY_RUN) run("make", ["install"], { cwd: ACE3_DIR });
  else log("dry-run: skipped make install");
}

function ensureBaseline(history) {
  const needsBaseline = REFRESH_BASELINE || !history.entries.some((entry) => entry.kind === "baseline");
  if (!needsBaseline) {
    log(`baseline already exists; best=${history.best_branch || "none"} score=${history.best_score ?? "none"}`);
    return;
  }

  log("building baseline leaderboard");
  for (const item of BASELINE_BRANCHES) {
    const commit = revParse(PAYMENT_DIR, item.branch);
    const existing = history.entries.find((entry) => entry.kind === "baseline" && entry.branch === item.branch);
    if (existing && !REFRESH_BASELINE) continue;

    const entry = {
      kind: "baseline",
      branch: item.branch,
      commit,
      label: item.label,
      timestamp: new Date().toISOString(),
      status: "baseline"
    };

    if (DRY_RUN) {
      entry.report_path = path.join(ARTIFACT_DIR, "dry-run", `${slug(item.branch)}-benchmark.json`);
      entry.overall_score = null;
      entry.scores = {};
      log(`dry-run: would benchmark baseline ${item.branch}`);
    } else {
      const baselineDir = path.join(ARTIFACT_DIR, "baseline", slug(item.branch));
      fs.mkdirSync(baselineDir, { recursive: true });
      benchmarkBranch(entry, history, baselineDir);
    }

    if (existing && REFRESH_BASELINE) Object.assign(existing, entry);
    else history.entries.push(entry);
  }

  history.best_score = bestEntry(history)?.overall_score ?? null;
  history.best_branch = bestEntry(history)?.branch ?? null;
  if (!DRY_RUN) saveHistory(history);
  log(`baseline complete; best=${history.best_branch || "none"} score=${history.best_score ?? "none"}`);
}

function generateCandidate(iteration, iterationDir) {
  run("git", ["fetch", "origin"], { cwd: PAYMENT_DIR });
  run("git", ["checkout", "--detach", BASE_REF], { cwd: PAYMENT_DIR });
  const branch = `codex/verify-xendit-callbacks-ace3-auto-${timestampForBranch()}-${iteration}`;
  run("git", ["checkout", "-b", branch], { cwd: PAYMENT_DIR });

  const promptPath = path.join(iterationDir, "implementation-prompt.md");
  fs.writeFileSync(promptPath, IMPLEMENT_PROMPT);
  const outputPath = path.join(iterationDir, "implementation-final.md");
  runCodex(IMPLEMENT_PROMPT, PAYMENT_DIR, outputPath, false);

  return {
    kind: "candidate",
    branch,
    commit: null,
    label: `ace3 auto iteration ${iteration}`,
    timestamp: new Date().toISOString(),
    artifact_dir: iterationDir
  };
}

function runPaymentTests(iterationDir) {
  const testLog = path.join(iterationDir, "payment-tests.log");
  const result = spawnSync("go", ["test", "./src/integration/pg/pg_xendit", "./src/service", "-count=1"], {
    cwd: PAYMENT_DIR,
    encoding: "utf8"
  });
  fs.writeFileSync(testLog, `${result.stdout || ""}${result.stderr || ""}`);
  if (result.status !== 0) {
    throw new Error(`payment tests failed; see ${testLog}`);
  }
}

function commitPaymentCandidate(candidate) {
  if (!hasChanges(PAYMENT_DIR)) {
    throw new Error("Codex implementation produced no payment-engine-v2 changes");
  }
  run("git", ["add", "."], { cwd: PAYMENT_DIR });
  run("git", ["commit", "-m", "Verify Xendit callbacks against remote transactions"], { cwd: PAYMENT_DIR });
  candidate.commit = currentCommit(PAYMENT_DIR);
}

function benchmarkBranch(entry, history, artifactDir) {
  const prompt = benchmarkPrompt(entry, history);
  const promptPath = path.join(artifactDir, "benchmark-prompt.md");
  const outputPath = path.join(artifactDir, "benchmark-result.json");
  fs.writeFileSync(promptPath, prompt);

  const originalBranch = currentBranch(PAYMENT_DIR);
  const originalRef = originalBranch || currentCommit(PAYMENT_DIR);
  try {
    run("git", ["checkout", entry.branch], { cwd: PAYMENT_DIR });
    runCodex(prompt, PAYMENT_DIR, outputPath, true);
  } finally {
    run("git", ["checkout", originalRef], { cwd: PAYMENT_DIR });
  }

  const parsed = parseBenchmarkResult(fs.readFileSync(outputPath, "utf8"), outputPath);
  entry.overall_score = parsed.overall_score;
  entry.scores = parsed.scores;
  entry.pros = parsed.pros;
  entry.cons = parsed.cons;
  entry.recommendations = parsed.recommendations;
  entry.summary = parsed.summary;
  entry.report_path = outputPath;
  entry.commit = entry.commit || revParse(PAYMENT_DIR, entry.branch);
}

function improveAce3(rejectedEntry, previousBest, iterationDir) {
  const prompt = improvementPrompt(rejectedEntry, previousBest);
  const promptPath = path.join(iterationDir, "improvement-prompt.md");
  const outputPath = path.join(iterationDir, "improvement-final.md");
  fs.writeFileSync(promptPath, prompt);
  runCodex(prompt, ACE3_DIR, outputPath, false);
}

function runCodex(prompt, cwd, outputPath, readOnly) {
  const args = ["-a", "never", "-s", readOnly ? "read-only" : "danger-full-access", "-C", cwd, "exec", "-o", outputPath];
  if (CODEX_MODEL) args.push("-m", CODEX_MODEL);
  args.push("-");
  const result = spawnSync("codex", args, { cwd, input: prompt, encoding: "utf8" });
  const logPath = outputPath.replace(/\.[^.]+$/, ".log");
  fs.writeFileSync(logPath, `${result.stdout || ""}${result.stderr || ""}`);
  if (result.status !== 0) {
    throw new Error(`codex exec failed in ${cwd}; see ${logPath}`);
  }
}

function ensureAce3LoopBranch() {
  const branch = currentBranch(ACE3_DIR);
  if (branch === ACE3_LOOP_BRANCH) return;
  const exists = spawnSync("git", ["rev-parse", "--verify", ACE3_LOOP_BRANCH], { cwd: ACE3_DIR, encoding: "utf8" }).status === 0;
  if (exists) run("git", ["checkout", ACE3_LOOP_BRANCH], { cwd: ACE3_DIR });
  else run("git", ["checkout", "-b", ACE3_LOOP_BRANCH], { cwd: ACE3_DIR });
}

function resetAce3To(commit) {
  if (currentBranch(ACE3_DIR) !== ACE3_LOOP_BRANCH) {
    throw new Error(`refusing to reset ace3 outside controlled branch ${ACE3_LOOP_BRANCH}`);
  }
  run("git", ["reset", "--hard", commit], { cwd: ACE3_DIR });
}

function loadHistory() {
  if (!fs.existsSync(HISTORY_PATH)) {
    return { version: 1, created_at: new Date().toISOString(), best_score: null, best_branch: null, entries: [] };
  }
  const parsed = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  if (!Array.isArray(parsed.entries)) throw new Error(`invalid history file: ${HISTORY_PATH}`);
  return parsed;
}

function saveHistory(history) {
  fs.mkdirSync(path.dirname(HISTORY_PATH), { recursive: true });
  history.updated_at = new Date().toISOString();
  fs.writeFileSync(HISTORY_PATH, `${JSON.stringify(history, null, 2)}\n`);
}

function bestEntry(history) {
  return history.entries
    .filter((entry) => typeof entry.overall_score === "number")
    .sort((a, b) => b.overall_score - a.overall_score)[0] || null;
}

function parseBenchmarkResult(raw, outputPath) {
  const jsonText = extractJson(raw);
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`benchmark output is not valid JSON at ${outputPath}: ${err.message}`);
  }
  const requiredScores = [
    "correctness",
    "anti_forgery_strength",
    "go_nobi_convention_fit",
    "test_quality",
    "maintainability",
    "simplicity"
  ];
  if (typeof parsed.overall_score !== "number") throw new Error(`benchmark missing numeric overall_score: ${outputPath}`);
  if (!parsed.scores || typeof parsed.scores !== "object") throw new Error(`benchmark missing scores object: ${outputPath}`);
  for (const key of requiredScores) {
    if (typeof parsed.scores[key] !== "number") throw new Error(`benchmark missing numeric scores.${key}: ${outputPath}`);
  }
  for (const key of ["pros", "cons", "recommendations"]) {
    if (!Array.isArray(parsed[key])) throw new Error(`benchmark missing array ${key}: ${outputPath}`);
  }
  if (typeof parsed.summary !== "string") throw new Error(`benchmark missing summary string: ${outputPath}`);
  return parsed;
}

function extractJson(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function formatHistoryForPrompt(history) {
  if (!history.entries.length) return "- none";
  return history.entries
    .filter((entry) => typeof entry.overall_score === "number")
    .sort((a, b) => b.overall_score - a.overall_score)
    .slice(0, 12)
    .map((entry) => `- ${entry.branch}: score=${entry.overall_score}, status=${entry.status}, label=${entry.label}, commit=${entry.commit}`)
    .join("\n") || "- none";
}

function publicEntry(entry) {
  if (!entry) return null;
  return {
    branch: entry.branch,
    commit: entry.commit,
    label: entry.label,
    status: entry.status,
    overall_score: entry.overall_score,
    scores: entry.scores,
    pros: entry.pros,
    cons: entry.cons,
    recommendations: entry.recommendations,
    summary: entry.summary
  };
}

function ensureRepoClean(cwd, name) {
  const status = runCapture("git", ["status", "--porcelain"], { cwd });
  if (status.trim()) throw new Error(`${name} must be clean before starting:\n${status}`);
}

function ensureRef(cwd, ref) {
  const result = spawnSync("git", ["rev-parse", "--verify", ref], { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`missing git ref ${ref} in ${cwd}`);
}

function hasChanges(cwd) {
  return runCapture("git", ["status", "--porcelain"], { cwd }).trim().length > 0;
}

function currentBranch(cwd) {
  return runCapture("git", ["branch", "--show-current"], { cwd }).trim();
}

function currentCommit(cwd) {
  return runCapture("git", ["rev-parse", "HEAD"], { cwd }).trim();
}

function revParse(cwd, ref) {
  return runCapture("git", ["rev-parse", ref], { cwd }).trim();
}

function run(command, args, options = {}) {
  log(`$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    stdio: "inherit",
    encoding: "utf8"
  });
  if (result.status !== 0) throw new Error(`command failed: ${command} ${args.join(" ")}`);
}

function runCapture(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: options.cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`command failed: ${command} ${args.join(" ")}\n${result.stderr || ""}`);
  }
  return result.stdout || "";
}

function isEnabled(value) {
  return ["1", "true", "yes", "on"].includes(String(value || "").toLowerCase());
}

function newRunId(iteration) {
  return `${timestampForBranch()}-iteration-${iteration}`;
}

function timestampForBranch() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}

function slug(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function log(message) {
  console.log(`[benchmark-xendit-loop] ${message}`);
}

try {
  main();
} catch (err) {
  console.error(`[benchmark-xendit-loop] error: ${err.message}`);
  process.exit(1);
}

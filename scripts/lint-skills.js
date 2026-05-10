#!/usr/bin/env node
// Validate the per-skill artifacts are in sync with skill.yml + templates/.
// Fails (exit 1) if any drift is detected.

const fs = require("fs");
const path = require("path");
const {
  parseSkillYaml,
  renderPluginJson,
  renderFrontmatter
} = require("./build-skills.js");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const TEMPLATES_DIR = path.join(ROOT, "templates", "references");
const STRICT = process.argv.includes("--strict");

// Skills intentionally not published to the marketplace catalog.
// Meta-skills like skill-author exist for in-repo authoring discipline,
// not end-user install. Update only with deliberate review.
const MARKETPLACE_EXCLUDED = new Set(["skill-author"]);

// Words/phrases in a skill.yml description that promise a specific shared
// reference. If present, the skill must include the matching template.
const CAPABILITY_CLAIMS = [
  { label: "quality gates", pattern: /\bquality\s*gate(s)?\b/i, requires: "quality-gates" },
  { label: "anti-patterns", pattern: /\banti[-\s]?pattern(s)?\b/i, requires: "quality-gates" },
  { label: "benchmark quality", pattern: /\bbenchmark\s*quality\b/i, requires: "benchmark-quality" }
];

const errors = [];
const warnings = [];

function err(skill, msg) { errors.push(`[${skill}] ${msg}`); }
function warn(skill, msg) {
  if (STRICT) errors.push(`[${skill}] (strict) ${msg}`);
  else warnings.push(`[${skill}] ${msg}`);
}

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function listFiles(dir) {
  const out = [];
  function walk(p, rel) {
    for (const entry of fs.readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const child = path.join(p, entry.name);
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(child, childRel);
      else if (entry.isFile() && entry.name !== "MANIFEST") out.push(childRel);
    }
  }
  walk(dir, "");
  return out;
}

function lintSkill(name) {
  const dir = path.join(SKILLS_DIR, name);
  const ymlPath = path.join(dir, "skill.yml");
  if (!fs.existsSync(ymlPath)) { err(name, "missing skill.yml"); return; }

  let skill;
  try { skill = parseSkillYaml(fs.readFileSync(ymlPath, "utf8")); }
  catch (e) { err(name, `skill.yml parse failed: ${e.message}`); return; }

  for (const k of ["name", "version", "description"]) {
    if (!skill[k]) err(name, `skill.yml missing required field: ${k}`);
  }
  if (skill.name !== name) err(name, `skill.yml name "${skill.name}" != dir "${name}"`);

  // SKILL.md frontmatter must match what build would generate.
  const skillMdPath = path.join(dir, "SKILL.md");
  const skillMd = readIfExists(skillMdPath);
  if (!skillMd) { err(name, "missing SKILL.md"); return; }
  const fmMatch = skillMd.match(/^---\n[\s\S]*?\n---/);
  if (!fmMatch) { err(name, "SKILL.md missing frontmatter"); return; }
  const expectedFm = renderFrontmatter(skill);
  if (fmMatch[0] !== expectedFm) {
    err(name, "SKILL.md frontmatter out of sync with skill.yml — run `make build`");
  }

  // plugin.json files must match what build would generate.
  const expectedPlugin = renderPluginJson(skill);
  for (const sub of [".claude-plugin", ".codex-plugin"]) {
    const p = path.join(dir, sub, "plugin.json");
    const cur = readIfExists(p);
    if (cur === null) { err(name, `missing ${sub}/plugin.json`); continue; }
    if (cur !== expectedPlugin) err(name, `${sub}/plugin.json out of sync — run \`make build\``);
  }

  // Template copies must byte-equal the template.
  for (const tpl of skill.includes || []) {
    const tplPath = path.join(TEMPLATES_DIR, `${tpl}.md`);
    const cpyPath = path.join(dir, "references", `${tpl}.md`);
    const tplSrc = readIfExists(tplPath);
    const cpySrc = readIfExists(cpyPath);
    if (tplSrc === null) { err(name, `missing template: templates/references/${tpl}.md`); continue; }
    if (cpySrc === null) { err(name, `missing references/${tpl}.md (declared in includes) — run \`make build\``); continue; }
    if (tplSrc !== cpySrc) err(name, `references/${tpl}.md drifted from template — run \`make build\``);
  }

  // Every `references/<file>.md` mentioned in SKILL.md must exist on disk.
  const refMatches = [...skillMd.matchAll(/`references\/([\w./-]+\.md)`/g)];
  for (const m of refMatches) {
    const p = path.join(dir, "references", m[1]);
    if (!fs.existsSync(p)) err(name, `SKILL.md cites references/${m[1]} but file is missing`);
  }

  // No SKILL.md may cross skill boundary.
  if (skillMd.includes("../_shared") || /\.\.\/[^_]?[\w-]+\/references/.test(skillMd)) {
    err(name, "SKILL.md references content outside its own directory (skills must be self-contained)");
  }

  // MANIFEST must list every file in the skill dir (excluding MANIFEST itself).
  const expectedManifest = listFiles(dir).join("\n") + "\n";
  const curManifest = readIfExists(path.join(dir, "MANIFEST"));
  if (curManifest === null) err(name, "missing MANIFEST");
  else if (curManifest !== expectedManifest) err(name, "MANIFEST out of sync with file tree — run `make build`");

  // CHANGELOG.md must exist and its top version entry must match skill.yml version.
  const changelog = readIfExists(path.join(dir, "CHANGELOG.md"));
  if (changelog === null) {
    err(name, "missing CHANGELOG.md");
  } else {
    const m = changelog.match(/^##\s+(\d+\.\d+\.\d+)\b/m);
    if (!m) {
      err(name, "CHANGELOG.md has no `## <semver>` entry");
    } else if (m[1] !== skill.version) {
      err(name, `CHANGELOG.md top version ${m[1]} != skill.yml version ${skill.version} — bump one to match the other`);
    }
  }

  // Soft section checks.
  const want = ["## References", "## Trust Boundary"];
  for (const sec of want) {
    if (!skillMd.includes(`\n${sec}\n`) && !skillMd.startsWith(`${sec}\n`)) {
      warn(name, `missing recommended section: ${sec}`);
    }
  }
  // Skills that include base-operating-layer should have a "## Base Operating Layer" section.
  if ((skill.includes || []).includes("base-operating-layer") && !skillMd.includes("## Base Operating Layer")) {
    warn(name, "includes base-operating-layer but SKILL.md lacks `## Base Operating Layer` section");
  }

  // Capability-claim parity: if the skill's description promises a shared
  // capability, the matching template must be in `includes:`. Catches drift
  // where someone advertises "quality gates" without actually loading them.
  const includes = new Set(skill.includes || []);
  for (const { label, pattern, requires } of CAPABILITY_CLAIMS) {
    if (pattern.test(skill.description) && !includes.has(requires)) {
      err(name, `skill.yml description claims "${label}" but does not include "${requires}" — add it to includes or rewrite the description`);
    }
  }

  // Unreferenced bundled-reference warning: every file in references/ should
  // either be a template copy (declared in includes) or be cited from SKILL.md.
  // Surfaces accidentally-orphaned files that shipped via past edits.
  const refsDir = path.join(dir, "references");
  if (fs.existsSync(refsDir)) {
    const expectedFromIncludes = new Set((skill.includes || []).map(t => `${t}.md`));
    const cited = new Set(refMatches.map(m => m[1]));
    for (const file of fs.readdirSync(refsDir).sort()) {
      if (!file.endsWith(".md")) continue;
      if (expectedFromIncludes.has(file)) continue;
      if (cited.has(file)) continue;
      warn(name, `references/${file} is bundled but not referenced from includes or SKILL.md`);
    }
  }
}

// Marketplace catalogs (.claude-plugin/marketplace.json and the codex twin)
// are hand-curated, but every skill they advertise must exist on disk with
// a matching version, and the two catalogs must stay byte-identical.
function lintMarketplace() {
  const claudePath = path.join(ROOT, ".claude-plugin", "marketplace.json");
  const codexPath = path.join(ROOT, ".codex-plugin", "marketplace.json");
  const claudeSrc = readIfExists(claudePath);
  const codexSrc = readIfExists(codexPath);
  if (claudeSrc === null) { errors.push("[marketplace] missing .claude-plugin/marketplace.json"); return null; }
  if (codexSrc === null) { errors.push("[marketplace] missing .codex-plugin/marketplace.json"); return null; }
  if (claudeSrc !== codexSrc) {
    errors.push("[marketplace] .claude-plugin/marketplace.json and .codex-plugin/marketplace.json are out of sync");
  }
  let parsed;
  try { parsed = JSON.parse(claudeSrc); }
  catch (e) { errors.push(`[marketplace] parse failed: ${e.message}`); return null; }
  const plugins = Array.isArray(parsed.plugins) ? parsed.plugins : [];
  const advertised = new Set();
  for (const p of plugins) {
    if (!p.name) { errors.push("[marketplace] plugin entry missing name"); continue; }
    advertised.add(p.name);
    const ymlPath = path.join(SKILLS_DIR, p.name, "skill.yml");
    if (!fs.existsSync(ymlPath)) {
      errors.push(`[marketplace] advertises "${p.name}" but skills/${p.name}/skill.yml does not exist`);
      continue;
    }
    const skill = parseSkillYaml(fs.readFileSync(ymlPath, "utf8"));
    if (skill.version !== p.version) {
      errors.push(`[marketplace] "${p.name}" version ${p.version} != skill.yml ${skill.version} — update marketplace.json`);
    }
  }
  // Every non-excluded skill on disk must appear in the catalog.
  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map(d => d.name);
  for (const name of skillDirs) {
    if (MARKETPLACE_EXCLUDED.has(name)) continue;
    if (!fs.existsSync(path.join(SKILLS_DIR, name, "skill.yml"))) continue;
    if (!advertised.has(name)) {
      errors.push(`[marketplace] skills/${name} exists but is not in marketplace.json (add it, or list in MARKETPLACE_EXCLUDED if intentional)`);
    }
  }
  return plugins.length;
}

// README claims a count of installable skills as English text ("This package
// exposes sixteen installable skills"). Keep it in sync with marketplace.
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  "twenty-one": 21, "twenty-two": 22, "twenty-three": 23, "twenty-four": 24,
  "twenty-five": 25, "twenty-six": 26, "twenty-seven": 27, "twenty-eight": 28,
  "twenty-nine": 29, thirty: 30
};

function lintReadme(advertisedCount) {
  if (advertisedCount === null) return;
  const readmePath = path.join(ROOT, "README.md");
  const src = readIfExists(readmePath);
  if (src === null) { errors.push("[readme] missing README.md"); return; }
  const m = src.match(/exposes\s+([a-z-]+|\d+)\s+installable\s+skills/i);
  if (!m) {
    warn("readme", "README.md has no `exposes <N> installable skills` claim — skipping count check");
    return;
  }
  const token = m[1].toLowerCase();
  const claimed = /^\d+$/.test(token) ? parseInt(token, 10) : NUMBER_WORDS[token];
  if (claimed === undefined) {
    errors.push(`[readme] cannot parse skill count "${m[1]}" — use a digit or supported English word`);
    return;
  }
  if (claimed !== advertisedCount) {
    errors.push(`[readme] claims ${claimed} installable skills but marketplace.json advertises ${advertisedCount}`);
  }
}

function main() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.error(`templates/ not found at ${TEMPLATES_DIR}`);
    process.exit(1);
  }
  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map(d => d.name)
    .sort();

  for (const name of dirs) {
    if (!fs.existsSync(path.join(SKILLS_DIR, name, "skill.yml"))) {
      err(name, "directory has no skill.yml");
      continue;
    }
    lintSkill(name);
  }

  const advertisedCount = lintMarketplace();
  lintReadme(advertisedCount);

  for (const w of warnings) console.warn(`warn: ${w}`);
  if (errors.length === 0) {
    console.log(`lint ok: ${dirs.length} skills, ${warnings.length} warnings${STRICT ? " (strict)" : ""}`);
    return;
  }
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\nlint failed: ${errors.length} errors, ${warnings.length} warnings${STRICT ? " (strict)" : ""}`);
  process.exit(1);
}

if (require.main === module) main();

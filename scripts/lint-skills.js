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

const errors = [];
const warnings = [];

function err(skill, msg) { errors.push(`[${skill}] ${msg}`); }
function warn(skill, msg) { warnings.push(`[${skill}] ${msg}`); }

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

  for (const w of warnings) console.warn(`warn: ${w}`);
  if (errors.length === 0) {
    console.log(`lint ok: ${dirs.length} skills, ${warnings.length} warnings`);
    return;
  }
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\nlint failed: ${errors.length} errors, ${warnings.length} warnings`);
  process.exit(1);
}

if (require.main === module) main();

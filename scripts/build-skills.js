#!/usr/bin/env node
// Regenerate per-skill artifacts from skill.yml + templates/.
// - Copies templates listed in `includes:` into skills/<name>/references/
// - Regenerates .claude-plugin/plugin.json and .codex-plugin/plugin.json
// - Regenerates SKILL.md YAML frontmatter (preserves body)
// - Regenerates MANIFEST as a sorted file list

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const TEMPLATES_DIR = path.join(ROOT, "templates", "references");
const PLUGIN_AUTHOR = { name: "ace3", url: "https://github.com/ace3" };
const PLUGIN_REPO = "https://github.com/ace3/skills";
const PLUGIN_LICENSE = "MIT";

// Tiny YAML parser for the constrained skill.yml shape:
//   name: <string>
//   version: <string>
//   description: >\n  <indented lines>
//   keywords:\n  - <string>\n  ...
//   includes:\n  - <string>\n  ...
function parseSkillYaml(src) {
  const lines = src.split("\n");
  const out = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "" || line.trim().startsWith("#")) { i++; continue; }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!m) { i++; continue; }
    const key = m[1];
    const inline = m[2];
    if (inline === ">" || inline === "|") {
      // Folded/literal block scalar; consume indented continuation lines.
      const buf = [];
      i++;
      while (i < lines.length && (lines[i].startsWith("  ") || lines[i].trim() === "")) {
        if (lines[i].trim() === "") { buf.push(""); }
        else { buf.push(lines[i].slice(2)); }
        i++;
      }
      const folded = inline === ">"
        ? foldBlockScalar(buf)
        : buf.join("\n").replace(/\n+$/, "");
      out[key] = folded;
      continue;
    }
    if (inline === "") {
      // Block sequence on following lines.
      const arr = [];
      i++;
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        arr.push(lines[i].replace(/^\s*-\s+/, "").trim());
        i++;
      }
      out[key] = arr;
      continue;
    }
    // Plain scalar.
    out[key] = stripQuotes(inline.trim());
    i++;
  }
  return out;
}

function foldBlockScalar(lines) {
  // YAML `>`: newlines between non-empty lines become spaces; blank lines preserved as newlines.
  const trimmed = [...lines];
  while (trimmed.length && trimmed[trimmed.length - 1] === "") trimmed.pop();
  let result = "";
  for (let j = 0; j < trimmed.length; j++) {
    const cur = trimmed[j];
    const next = trimmed[j + 1];
    if (cur === "") { result += "\n"; continue; }
    result += cur;
    if (next === undefined) continue;
    result += next === "" ? "" : " ";
  }
  return result.replace(/\s+$/, "") + "\n";
}

function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function copyTemplate(name, dest) {
  const src = path.join(TEMPLATES_DIR, `${name}.md`);
  if (!fs.existsSync(src)) {
    throw new Error(`template not found: ${src}`);
  }
  fs.copyFileSync(src, dest);
}

function renderPluginJson(skill) {
  return JSON.stringify({
    name: skill.name,
    version: skill.version,
    description: skill.description.replace(/\s+/g, " ").trim(),
    author: PLUGIN_AUTHOR,
    homepage: `${PLUGIN_REPO}/tree/main/skills/${skill.name}`,
    repository: PLUGIN_REPO,
    license: PLUGIN_LICENSE,
    keywords: skill.keywords || []
  }, null, 2) + "\n";
}

function renderFrontmatter(skill) {
  // Reformat description as a `>` folded scalar wrapped at ~78 chars per line.
  const wrapped = wrapText(skill.description.trim(), 78, "  ");
  return `---\nname: ${skill.name}\ndescription: >\n${wrapped}\n---`;
}

function wrapText(text, width, indent) {
  const words = text.replace(/\s+/g, " ").split(" ");
  const lines = [];
  let cur = indent;
  for (const w of words) {
    if (cur === indent) { cur += w; continue; }
    if ((cur + " " + w).length > width) { lines.push(cur); cur = indent + w; }
    else { cur += " " + w; }
  }
  if (cur !== indent) lines.push(cur);
  return lines.join("\n");
}

function rewriteSkillMd(skillDir, skill) {
  const skillMdPath = path.join(skillDir, "SKILL.md");
  const src = fs.readFileSync(skillMdPath, "utf8");
  // Match leading `---\n...\n---` block.
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) {
    throw new Error(`SKILL.md missing frontmatter: ${skillMdPath}`);
  }
  const body = src.slice(m[0].length);
  const next = renderFrontmatter(skill) + "\n" + body;
  if (next !== src) fs.writeFileSync(skillMdPath, next);
}

function listSkillFiles(skillDir) {
  const out = [];
  function walk(p, rel) {
    for (const entry of fs.readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const child = path.join(p, entry.name);
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(child, childRel);
      } else if (entry.isFile()) {
        if (entry.name === "MANIFEST") continue; // self
        out.push(childRel);
      }
    }
  }
  walk(skillDir, "");
  return out;
}

function buildSkill(name) {
  const dir = path.join(SKILLS_DIR, name);
  const ymlPath = path.join(dir, "skill.yml");
  if (!fs.existsSync(ymlPath)) {
    throw new Error(`missing skill.yml: ${ymlPath}`);
  }
  const skill = parseSkillYaml(fs.readFileSync(ymlPath, "utf8"));
  for (const k of ["name", "version", "description"]) {
    if (!skill[k]) throw new Error(`${ymlPath}: missing required field ${k}`);
  }
  if (skill.name !== name) {
    throw new Error(`${ymlPath}: name "${skill.name}" does not match directory "${name}"`);
  }

  ensureDir(path.join(dir, "references"));
  ensureDir(path.join(dir, ".claude-plugin"));
  ensureDir(path.join(dir, ".codex-plugin"));

  for (const tpl of skill.includes || []) {
    copyTemplate(tpl, path.join(dir, "references", `${tpl}.md`));
  }

  const pluginJson = renderPluginJson(skill);
  fs.writeFileSync(path.join(dir, ".claude-plugin", "plugin.json"), pluginJson);
  fs.writeFileSync(path.join(dir, ".codex-plugin", "plugin.json"), pluginJson);

  rewriteSkillMd(dir, skill);

  const manifest = listSkillFiles(dir).join("\n") + "\n";
  fs.writeFileSync(path.join(dir, "MANIFEST"), manifest);

  return { name, includes: skill.includes || [] };
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

  const results = [];
  for (const name of dirs) {
    const ymlPath = path.join(SKILLS_DIR, name, "skill.yml");
    if (!fs.existsSync(ymlPath)) {
      console.warn(`skip ${name}: no skill.yml`);
      continue;
    }
    try {
      results.push(buildSkill(name));
    } catch (e) {
      console.error(`build failed for ${name}: ${e.message}`);
      process.exit(1);
    }
  }
  for (const r of results) {
    console.log(`built ${r.name} (includes: ${r.includes.join(", ") || "none"})`);
  }
}

if (require.main === module) main();

module.exports = { parseSkillYaml, foldBlockScalar, wrapText, renderPluginJson, renderFrontmatter };

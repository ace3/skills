#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(PACKAGE_ROOT, "skills");
const VERSION = require(path.join(PACKAGE_ROOT, "package.json")).version;

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

function getAvailableSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR)
    .filter((name) => fs.existsSync(path.join(SKILLS_DIR, name, "SKILL.md")))
    .sort();
}

function getSkillDescription(skillName) {
  const skillMd = path.join(SKILLS_DIR, skillName, "SKILL.md");
  const content = fs.readFileSync(skillMd, "utf-8");
  const match = content.match(/description:\s*>?\s*\n?([\s\S]*?)(?=\n---|\n\w+:)/);
  if (!match) return "";
  return match[1].trim().split("\n")[0].trim().slice(0, 90);
}

function getTargets(scope) {
  const home = process.env.HOME || process.env.USERPROFILE || "~";
  if (scope === "project") {
    return [
      path.join(process.cwd(), ".claude", "skills"),
      path.join(process.cwd(), ".codex", "skills")
    ];
  }
  return [
    path.join(home, ".claude", "skills"),
    path.join(home, ".codex", "skills")
  ];
}

async function resolveScope(args) {
  if (args.includes("-g") || args.includes("--global")) return "global";
  if (args.includes("-p") || args.includes("--project")) return "project";

  if (process.stdin.isTTY) {
    const readline = require("readline");
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`${c.bold}Where do you want to install?${c.reset}`);
    console.log(`  ${c.cyan}1)${c.reset} ${c.bold}Global${c.reset}  -> ~/.claude/skills and ~/.codex/skills`);
    console.log(`  ${c.cyan}2)${c.reset} ${c.bold}Project${c.reset} -> ./.claude/skills and ./.codex/skills`);
    return new Promise((resolve) => {
      rl.question(`${c.bold}Choose [1/2]:${c.reset} `, (answer) => {
        rl.close();
        resolve(answer.trim() === "1" ? "global" : "project");
      });
    });
  }

  if (fs.existsSync(path.join(process.cwd(), ".claude")) || fs.existsSync(path.join(process.cwd(), ".codex"))) {
    return "project";
  }
  return "global";
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "MANIFEST" || entry.name === "__pycache__") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function cmdInstall(args) {
  const available = getAvailableSkills();
  const skillArgs = args.filter((a) => !a.startsWith("-"));
  const toInstall = (skillArgs.length === 0 || args.includes("--all")) ? available : skillArgs;

  const invalid = toInstall.filter((s) => !available.includes(s));
  if (invalid.length) {
    console.log(`\n${c.red}Unknown skill(s): ${invalid.join(", ")}${c.reset}`);
    process.exit(1);
  }

  const scope = await resolveScope(args);
  const targets = getTargets(scope);

  console.log(`\n${c.cyan}${c.bold}Installing: ${toInstall.join(", ")}${c.reset}`);
  console.log(`${c.dim}Scope: ${scope}${c.reset}`);
  console.log(`${c.dim}Source: local package v${VERSION} at ${PACKAGE_ROOT}${c.reset}`);

  for (const base of targets) {
    fs.mkdirSync(base, { recursive: true });
    for (const skill of toInstall) {
      const src = path.join(SKILLS_DIR, skill);
      const dest = path.join(base, skill);
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
      copyDirSync(src, dest);
      console.log(`${c.green}installed${c.reset} ${skill} -> ${base}`);
      console.log(`${c.dim}  audit: skill=${skill} source=${src} destination=${dest}${c.reset}`);
    }
  }
}

function cmdList() {
  const available = getAvailableSkills();
  console.log(`\n${c.cyan}${c.bold}Available Skills (v${VERSION})${c.reset}\n`);
  for (const s of available) {
    console.log(`${c.bold}${s}${c.reset}`);
    const d = getSkillDescription(s);
    if (d) console.log(`${c.dim}${d}${c.reset}`);
    console.log();
  }
}

function cmdHelp() {
  console.log(`@ace3/skills v${VERSION}\n\nUSAGE\n  npx @ace3/skills <command> [options]\n\nCOMMANDS\n  install [skill...]\n  install --all\n  list\n  help\n\nFLAGS\n  -g, --global\n  -p, --project`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case "install":
    case "i":
    case "add":
      await cmdInstall(args);
      break;
    case "list":
    case "ls":
      cmdList();
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      cmdHelp();
      break;
    default:
      await cmdInstall([command, ...args]);
  }
}

main().catch((err) => {
  console.error(`${c.red}${err.message}${c.reset}`);
  process.exit(1);
});

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ALLOWED_EXT = new Set([".md", ".json", ".txt", ""]);
const BLOCKLIST = [
  "yang",
  "dan",
  "untuk",
  "dengan",
  "tidak",
  "saya",
  "kamu",
  "kita",
  "terima kasih",
  "mau",
  "enaknya"
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsBlockedToken(text, token) {
  const pattern = new RegExp(`(^|[^a-z])${escapeRegExp(token)}([^a-z]|$)`, "i");
  return pattern.test(text);
}

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

let bad = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const ext = path.extname(file);
  if (!ALLOWED_EXT.has(ext)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const token of BLOCKLIST) {
    if (containsBlockedToken(text, token)) {
      bad.push(`${rel}: found '${token}'`);
      break;
    }
  }
}

if (bad.length) {
  console.error("English validation failed:\n" + bad.join("\n"));
  process.exit(1);
}

console.log("English validation passed");

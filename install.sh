#!/bin/bash
set -e

REPO="ace3/skills"
REPO_URL="https://github.com/$REPO"
RAW_BASE="https://raw.githubusercontent.com/$REPO/main"
ALL_SKILLS=("security" "monitoring" "deployment-ops" "drawing")
REQUESTED_SKILLS=("$@")
if [ ${#REQUESTED_SKILLS[@]} -eq 0 ]; then
  REQUESTED_SKILLS=("${ALL_SKILLS[@]}")
fi

if [ -d ".claude/skills" ] || [ -d ".codex/skills" ]; then
  TARGET_MODE="project"
else
  TARGET_MODE="global"
fi

if [ "$TARGET_MODE" = "project" ]; then
  TARGETS=(".claude/skills" ".codex/skills")
else
  TARGETS=("$HOME/.claude/skills" "$HOME/.codex/skills")
fi

install_skill() {
  local skill=$1
  local target=$2
  local tmp_dir
  tmp_dir=$(mktemp -d)

  cd "$tmp_dir"
  git init -q
  git remote add origin "$REPO_URL.git"
  git config core.sparseCheckout true
  echo "skills/$skill/" > .git/info/sparse-checkout
  git pull -q --depth 1 origin main 2>/dev/null || true

  if [ -d "skills/$skill" ]; then
    rm -rf "$target/$skill"
    mkdir -p "$target"
    cp -r "skills/$skill" "$target/$skill"
    rm -rf "$tmp_dir"
    return 0
  fi

  rm -rf "$tmp_dir"
  return 1
}

for target in "${TARGETS[@]}"; do
  mkdir -p "$target"
  for skill in "${REQUESTED_SKILLS[@]}"; do
    if install_skill "$skill" "$target"; then
      echo "installed $skill -> $target"
    else
      echo "failed to install $skill -> $target"
      exit 1
    fi
  done
done

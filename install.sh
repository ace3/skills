#!/bin/bash
set -e

REPO="ace3/skills"
REPO_URL="https://github.com/$REPO"
ALL_SKILLS=("security-sast" "security-dast" "monitoring" "deployment-ops" "drawing" "roast")
REQUESTED_SKILLS=("$@")
if [ ${#REQUESTED_SKILLS[@]} -eq 0 ]; then
  REQUESTED_SKILLS=("${ALL_SKILLS[@]}")
fi

for skill in "${REQUESTED_SKILLS[@]}"; do
  if [[ ! " ${ALL_SKILLS[*]} " =~ " ${skill} " ]]; then
    echo "unknown skill: ${skill}"
    echo "available skills: ${ALL_SKILLS[*]}"
    exit 1
  fi
done

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
  local commit_sha
  tmp_dir=$(mktemp -d)

  cd "$tmp_dir" || return 1
  git init -q
  git remote add origin "$REPO_URL.git"
  git config core.sparseCheckout true
  echo "skills/$skill/" > .git/info/sparse-checkout
  if ! git pull -q --depth 1 origin main >/dev/null 2>&1; then
    echo "failed to fetch $skill from $REPO_URL (main)" >&2
    rm -rf "$tmp_dir"
    return 1
  fi

  if ! commit_sha=$(git rev-parse --short HEAD 2>/dev/null); then
    echo "failed to resolve source commit for $skill" >&2
    rm -rf "$tmp_dir"
    return 1
  fi

  if [ ! -d "skills/$skill" ]; then
    echo "skill path not found in source repo: skills/$skill" >&2
    rm -rf "$tmp_dir"
    return 1
  fi

  rm -rf "$target/$skill"
  mkdir -p "$target"
  cp -r "skills/$skill" "$target/$skill"
  rm -rf "$tmp_dir"
  echo "$commit_sha"
  return 0
}

for target in "${TARGETS[@]}"; do
  mkdir -p "$target"
  for skill in "${REQUESTED_SKILLS[@]}"; do
    if commit_sha=$(install_skill "$skill" "$target"); then
      echo "installed $skill -> $target (source=$REPO_URL commit=$commit_sha)"
    else
      echo "failed to install $skill -> $target"
      exit 1
    fi
  done
done

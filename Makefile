SHELL := /bin/bash

SKILL ?= all

SKILLS := $(shell find skills -mindepth 2 -maxdepth 2 -name SKILL.md -exec dirname {} \; | xargs -n1 basename | sort)

.PHONY: help list validate install install-global install-project install-claude install-codex install-claude-project install-codex-project

help:
	@printf '%s\n' 'Targets:'
	@printf '  %-24s %s\n' 'make list' 'List available skills'
	@printf '  %-24s %s\n' 'make install' 'Install all skills globally to Claude and Codex'
	@printf '  %-24s %s\n' 'make install SKILL=name' 'Install one skill globally to Claude and Codex'
	@printf '  %-24s %s\n' 'make install-project' 'Install all skills to ./.claude and ./.codex'
	@printf '  %-24s %s\n' 'make install-claude' 'Install all or SKILL=name to ~/.claude/skills only'
	@printf '  %-24s %s\n' 'make install-codex' 'Install all or SKILL=name to ~/.codex/skills only'
	@printf '  %-24s %s\n' 'make validate' 'Run repository validation'

list:
	@node bin/cli.js list

validate:
	@node scripts/validate-english.js
	@node -e 'JSON.parse(require("fs").readFileSync("package.json", "utf8")); JSON.parse(require("fs").readFileSync(".claude-plugin/marketplace.json", "utf8")); JSON.parse(require("fs").readFileSync(".codex-plugin/marketplace.json", "utf8")); console.log("json ok")'

install: install-global

install-global:
	@if [ "$(SKILL)" = "all" ]; then \
		node bin/cli.js install --all --global; \
	else \
		node bin/cli.js install "$(SKILL)" --global; \
	fi

install-project:
	@if [ "$(SKILL)" = "all" ]; then \
		node bin/cli.js install --all --project; \
	else \
		node bin/cli.js install "$(SKILL)" --project; \
	fi

install-claude:
	@$(MAKE) _install-target TARGET="$(HOME)/.claude/skills" SKILL="$(SKILL)"

install-codex:
	@$(MAKE) _install-target TARGET="$(HOME)/.codex/skills" SKILL="$(SKILL)"

install-claude-project:
	@$(MAKE) _install-target TARGET=".claude/skills" SKILL="$(SKILL)"

install-codex-project:
	@$(MAKE) _install-target TARGET=".codex/skills" SKILL="$(SKILL)"

.PHONY: _install-target
_install-target:
	@set -euo pipefail; \
	target="$(TARGET)"; \
	mkdir -p "$$target"; \
	if [ "$(SKILL)" = "all" ]; then skills="$(SKILLS)"; else skills="$(SKILL)"; fi; \
	for skill in $$skills; do \
		if [ ! -f "skills/$$skill/SKILL.md" ]; then \
			echo "unknown skill: $$skill"; \
			echo "available skills: $(SKILLS)"; \
			exit 1; \
		fi; \
		rm -rf "$$target/$$skill"; \
		mkdir -p "$$target/$$skill"; \
		(cd "skills/$$skill" && tar --exclude MANIFEST --exclude __pycache__ -cf - .) | (cd "$$target/$$skill" && tar -xf -); \
		echo "installed $$skill -> $$target"; \
	done

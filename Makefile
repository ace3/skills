SHELL := /bin/bash

SKILL ?= all

SKILLS := $(shell find skills -mindepth 2 -maxdepth 2 -name SKILL.md -exec dirname {} \; | xargs -n1 basename | sort)

.PHONY: help list build lint test validate install install-global install-project install-claude install-codex install-claude-project install-codex-project benchmark-xendit-loop

help:
	@printf '%s\n' 'Targets:'
	@printf '  %-24s %s\n' 'make list' 'List available skills'
	@printf '  %-24s %s\n' 'make install' 'Build, validate, then install all skills globally to Claude and Codex'
	@printf '  %-24s %s\n' 'make install SKILL=name' 'Build, validate, then install one skill globally to Claude and Codex'
	@printf '  %-24s %s\n' 'make install-project' 'Build, validate, then install all skills to ./.claude and ./.codex'
	@printf '  %-24s %s\n' 'make install-claude' 'Build, validate, then install all or SKILL=name to ~/.claude/skills'
	@printf '  %-24s %s\n' 'make install-codex' 'Build, validate, then install all or SKILL=name to ~/.codex/skills'
	@printf '  %-24s %s\n' 'make build' 'Regenerate per-skill MANIFEST, plugin.json, frontmatter, and template copies from skill.yml'
	@printf '  %-24s %s\n' 'make lint' 'Verify every skill is in sync with skill.yml + templates/'
	@printf '  %-24s %s\n' 'make test' 'Run agent runner unit tests'
	@printf '  %-24s %s\n' 'make validate' 'Run repository validation (build + lint + json + english)'
	@printf '  %-24s %s\n' 'make benchmark-xendit-loop' 'Run autonomous Xendit callback benchmark loop'

list:
	@node bin/cli.js list

build:
	@node scripts/build-skills.js

lint:
	@node scripts/lint-skills.js

test:
	@node --test scripts/agent-runner.test.js
	@node --test scripts/a2a-server.test.js

validate: build lint test
	@node scripts/validate-english.js
	@node -e 'JSON.parse(require("fs").readFileSync("package.json", "utf8")); JSON.parse(require("fs").readFileSync(".claude-plugin/marketplace.json", "utf8")); JSON.parse(require("fs").readFileSync(".codex-plugin/marketplace.json", "utf8")); console.log("json ok")'

install: install-global

install-global: build validate
	@if [ "$(SKILL)" = "all" ]; then \
		node bin/cli.js install --all --global; \
	else \
		node bin/cli.js install "$(SKILL)" --global; \
	fi

install-project: build validate
	@if [ "$(SKILL)" = "all" ]; then \
		node bin/cli.js install --all --project; \
	else \
		node bin/cli.js install "$(SKILL)" --project; \
	fi

install-claude: build validate
	@$(MAKE) _install-target TARGET="$(HOME)/.claude/skills" SKILL="$(SKILL)"

install-codex: build validate
	@$(MAKE) _install-target TARGET="$(HOME)/.codex/skills" SKILL="$(SKILL)"

install-claude-project: build validate
	@$(MAKE) _install-target TARGET=".claude/skills" SKILL="$(SKILL)"

install-codex-project: build validate
	@$(MAKE) _install-target TARGET=".codex/skills" SKILL="$(SKILL)"

benchmark-xendit-loop:
	@node scripts/benchmark-xendit-loop.js

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

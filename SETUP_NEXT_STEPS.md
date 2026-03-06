# Next Steps: Wire GitHub + Parallel Agents

## Current running services

- Vibe Kanban API/UI: http://127.0.0.1:3000
- Vibe relay: http://127.0.0.1:8082/health
- AO dashboard: http://127.0.0.1:3400
- AO orchestrator (Codex): tmux session `40995393491d-pscodex-orchestrator`

## 1) Authenticate GitHub CLI

```bash
gh auth login
```

## 2) Create / connect GitHub repo

```bash
cd /root/project/product-studio
git remote add origin git@github.com:<YOUR_ORG>/product-studio.git
git push -u origin main
```

`repo:` in `/root/project/agent-orchestrator.yaml` is already set to `seangleridika-max/product-studio`.

## 3) Parallel spawning (Codex + Claude)

```bash
export AO_CONFIG_PATH=/root/project/agent-orchestrator.yaml
ao spawn product-codex <ISSUE_ID>
ao spawn product-claude <ISSUE_ID>
```

> Note: in this root environment, **Claude orchestrator** with skip permissions cannot start.
> So we run **Codex orchestrator** and keep Claude as worker sessions (`product-claude`).

## 4) Reaction loop

Already enabled in config:
- `ci-failed -> send-to-agent (retries=2)`
- `changes-requested -> send-to-agent`

Manual review polling:

```bash
ao review-check product-codex
ao review-check product-claude
```

## 5) Useful ops commands

```bash
# AO status
AO_CONFIG_PATH=/root/project/agent-orchestrator.yaml ao status

# Dashboard logs
tmux capture-pane -t ao-dashboard -p | tail -n 80

# Orchestrator logs
tmux capture-pane -t 40995393491d-pscodex-orchestrator -p | tail -n 80
```

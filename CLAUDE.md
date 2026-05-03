# Ruflo — Claude Code Configuration

## Rules

- **⚠️ CRITICAL: ALWAYS use Ruflo + Obsidian together for ALL tasks** — This is essential for efficient token usage and proper agent coordination. Every session, every project, no exceptions.
  - Before ANY task: Use `memory_search` to check for related patterns
  - Route with: `hooks_route` (single agent vs swarm decision)
  - Multi-file (3+): MUST use `swarm_init` + `agent_spawn` (saves tokens)
  - After work: Update Obsidian brain/ + use `memory_store` to record learnings
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation files unless explicitly requested
- NEVER save working files or tests to root — use `/src`, `/tests`, `/docs`, `/config`, `/scripts`
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- Keep files under 500 lines
- Validate input at system boundaries

## Agent Comms (SendMessage-First Coordination)

Named agents coordinate via `SendMessage`, not polling or shared state.

```
Lead (you) ←→ architect ←→ developer ←→ tester ←→ reviewer
              (named agents message each other directly)
```

### Spawning a Coordinated Team

```javascript
// ALL agents in ONE message, each knows WHO to message next
Agent({ prompt: "Research the codebase. SendMessage findings to 'architect'.",
  subagent_type: "researcher", name: "researcher", run_in_background: true })
Agent({ prompt: "Wait for 'researcher'. Design solution. SendMessage to 'coder'.",
  subagent_type: "system-architect", name: "architect", run_in_background: true })
Agent({ prompt: "Wait for 'architect'. Implement it. SendMessage to 'tester'.",
  subagent_type: "coder", name: "coder", run_in_background: true })
Agent({ prompt: "Wait for 'coder'. Write tests. SendMessage results to 'reviewer'.",
  subagent_type: "tester", name: "tester", run_in_background: true })
Agent({ prompt: "Wait for 'tester'. Review code quality and security.",
  subagent_type: "reviewer", name: "reviewer", run_in_background: true })

// Kick off the pipeline
SendMessage({ to: "researcher", summary: "Start", message: "[task context]" })
```

### Patterns

| Pattern | Flow | Use When |
|---------|------|----------|
| **Pipeline** | A → B → C → D | Sequential dependencies (feature dev) |
| **Fan-out** | Lead → A, B, C → Lead | Independent parallel work (research) |
| **Supervisor** | Lead ↔ workers | Ongoing coordination (complex refactor) |

### Rules

- ALWAYS name agents — `name: "role"` makes them addressable
- ALWAYS include comms instructions in prompts — who to message, what to send
- Spawn ALL agents in ONE message with `run_in_background: true`
- After spawning: STOP, tell user what's running, wait for results
- NEVER poll status — agents message back or complete automatically

## Swarm & Routing

### Config
- **Topology**: hierarchical-mesh (anti-drift)
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

### Agent Routing

| Task | Agents | Topology |
|------|--------|----------|
| Bug Fix | researcher, coder, tester | hierarchical |
| Feature | architect, coder, tester, reviewer | hierarchical |
| Refactor | architect, coder, reviewer | hierarchical |
| Performance | perf-engineer, coder | hierarchical |
| Security | security-architect, auditor | hierarchical |

### When to Swarm
- **YES**: 3+ files, new features, cross-module refactoring, API changes, security, performance
- **NO**: single file edits, 1-2 line fixes, docs updates, config changes, questions

### 3-Tier Model Routing

| Tier | Handler | Use Cases |
|------|---------|-----------|
| 1 | Agent Booster (WASM) | Simple transforms — skip LLM, use Edit directly |
| 2 | Haiku | Simple tasks, low complexity |
| 3 | Sonnet/Opus | Architecture, security, complex reasoning |

## Memory & Learning

### Before Any Task
```bash
npx @claude-flow/cli@latest memory search --query "[task keywords]" --namespace patterns
npx @claude-flow/cli@latest hooks route --task "[task description]"
```

### After Success
```bash
npx @claude-flow/cli@latest memory store --namespace patterns --key "[name]" --value "[what worked]"
npx @claude-flow/cli@latest hooks post-task --task-id "[id]" --success true --store-results true
```

### MCP Tools (use `ToolSearch("keyword")` to discover)

| Category | Key Tools |
|----------|-----------|
| **Memory** | `memory_store`, `memory_search`, `memory_search_unified` |
| **Bridge** | `memory_import_claude`, `memory_bridge_status` |
| **Swarm** | `swarm_init`, `swarm_status`, `swarm_health` |
| **Agents** | `agent_spawn`, `agent_list`, `agent_status` |
| **Hooks** | `hooks_route`, `hooks_post-task`, `hooks_worker-dispatch` |
| **Security** | `aidefence_scan`, `aidefence_is_safe`, `aidefence_has_pii` |
| **Hive-Mind** | `hive-mind_init`, `hive-mind_consensus`, `hive-mind_spawn` |

### Background Workers

| Worker | When |
|--------|------|
| `audit` | After security changes |
| `optimize` | After performance work |
| `testgaps` | After adding features |
| `map` | Every 5+ file changes |
| `document` | After API changes |

```bash
npx @claude-flow/cli@latest hooks worker dispatch --trigger audit
```

## Agents

**Core**: `coder`, `reviewer`, `tester`, `planner`, `researcher`
**Architecture**: `system-architect`, `backend-dev`, `mobile-dev`
**Security**: `security-architect`, `security-auditor`
**Performance**: `performance-engineer`, `perf-analyzer`
**Coordination**: `hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`
**GitHub**: `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

Any string works as a custom agent type.

## Build & Test

- ALWAYS run tests after code changes
- ALWAYS verify build succeeds before committing

```bash
npm run build && npm test
```

## CLI Quick Reference

```bash
npx @claude-flow/cli@latest init --wizard           # Setup
npx @claude-flow/cli@latest swarm init --v3-mode     # Start swarm
npx @claude-flow/cli@latest memory search --query "" # Vector search
npx @claude-flow/cli@latest hooks route --task ""    # Route to agent
npx @claude-flow/cli@latest doctor --fix             # Diagnostics
npx @claude-flow/cli@latest security scan            # Security scan
npx @claude-flow/cli@latest performance benchmark    # Benchmarks
```

26 commands, 140+ subcommands. Use `--help` on any command for details.

## Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

**Agent tool** handles execution (agents, files, code, git). **MCP tools** handle coordination (swarm, memory, hooks). **CLI** is the same via Bash.

---

# FlavorSync Multi-Client Architecture (2026-05-02)

## Quick Reference

**Status**: ✅ Refactoring Complete  
**Structure**: Next.js Route Groups  
**Landing**: `/`  
**Menus**: `/{cliente}/menu`

## How It Works

Route groups `(landing)` and `(menus)` load different CSS per URL:
- `/` uses `app/(landing)/landing.css` (--bg, --blue, .aurora)
- `/comidas-felices/menu` uses `app/(menus)/menus-base.css` (--menu-gold, --menu-bg)
- **No CSS conflicts** — each section isolated

## Adding a New Client

```bash
# 1. Get UUID from Supabase dishes table
SELECT DISTINCT client_id FROM dishes;

# 2-4. Copy template and update UUID
mkdir -p app/(menus)/[new-client]/menu/
cp app/(menus)/comidas-felices/menu/page.tsx app/(menus)/[new-client]/menu/page.tsx
# Then edit: const [CLIENT]_CLIENT_ID = 'your-uuid'

# 5. Ensure dishes table has rows with that client_id

# 6. Deploy
npm run build && git push
```

## Files You'll Touch

**To add a client**:
- `app/(menus)/[cliente]/menu/page.tsx` — Copy, change UUID + metadata
- Supabase `dishes` table — Add dishes with `client_id`

**Do NOT change without coordination**:
- `app/(menus)/layout.tsx` — Affects all clients
- `app/(menus)/menus-base.css` — Affects all clients
- `app/globals.css` — Keep minimal (no theme variables)

**Safe to customize per client**:
- Create `app/(menus)/[cliente]/menu/custom.css` — Override `--menu-*` variables

## Testing

```bash
npm run dev
# Landing: http://localhost:3000/
# Menu: http://localhost:3000/comidas-felices/menu
```

Menu returns 404 if no data for UUID (correct behavior).

## Data

Function `getMenuByClientId(clientId: string)` in `lib/menu.ts` filters by `client_id` column.

Table `dishes` requires:
- `client_id` UUID (CRITICAL)
- `name`, `price`, `description`
- `category_id`, `category_name`
- `section_title`

## Philosophy

**Flexibility over standardization**: Each client gets 100% design freedom in their own folder. No shared constraints, no style collisions.

## References

Full docs in Obsidian (Ruflo):
- `DECISION_ARQUITECTURA_ROUTE_GROUPS.md`
- `PROCEDIMIENTO_NUEVO_CLIENTE.md`
- `CAMBIOS_TECNICOS_2026-05-02.md`
- `CONTEXTO_GENERAL.md`

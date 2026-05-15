# Bonsai OS — MCP Server

The Bonsai product methodology OS. Run workshops, set up your Notion workspace, and align your team on what to build next.

## Add to Claude

**One-click install:**

```
https://claude.ai/integrations/connect?mcp_server_url=https%3A%2F%2Fbonsaios.vercel.app%2Fapi%2Fmcp
```

**Or manually in Claude settings → Integrations → Add MCP Server:**

```
https://bonsaios.vercel.app/api/mcp
```

**Or in Claude Code CLI:**

```bash
claude mcp add bonsaios https://bonsaios.vercel.app/api/mcp
```

---

## Getting started — prompts to type

Once connected, talk to Claude naturally:

```
Run the Onboarding play
```

```
Run the North Star workshop with me
```

```
Score my backlog against my North Star
```

```
Set up my Notion workspace
```

```
What does the Bonsai PMF methodology say?
```

---

## Tools

| Tool | Description |
|------|-------------|
| `run_play` | Fetches a play from Notion and runs it as a workshop |
| `get_methodology` | Returns methodology content for a section |
| `setup_notion_workspace` | Creates your Bonsai OS Notion structure |
| `create_northstar_page` | Saves North Star output to your Notion |
| `score_backlog` | Scores backlog items against your North Star |

### Plays available
`onboarding` · `northstar` · `pmf_narrative` · `risk_validation` · `sprint_planning` · `standup` · `experiment_log`

### Methodology sections
`northstar` · `pmf` · `risk` · `scrum` · `kanban` · `financial`

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `NOTION_API_KEY` | Your Notion integration token with read access to methodology pages |
| `METHODOLOGY_ROOT_PAGE_ID` | Page ID of the Bonsai OS source-of-truth root in your Notion |

---

## Local development

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local

# Start dev server
npm run dev
```

The MCP endpoint runs at `http://localhost:3000/api/mcp`.

---

## Notion page structure

The server expects your methodology Notion page to contain child pages organized like this:

```
[METHODOLOGY_ROOT_PAGE_ID]
├── Plays/
│   ├── Onboarding
│   ├── North Star
│   ├── PMF Narrative
│   ├── Risk Validation
│   ├── Sprint Planning
│   ├── Standup
│   └── Experiment Log
└── Methodology/
    ├── North Star
    ├── PMF
    ├── Risk
    ├── Scrum
    ├── Kanban
    └── Financial
```

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdanybgoode%2FbonsaiOSvercel)

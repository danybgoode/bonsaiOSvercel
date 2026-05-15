const WORKSPACE_STRUCTURE = [
  {
    name: "🌱 North Star",
    description: "Your North Star metric, game, and clarity statement",
  },
  {
    name: "🗺️ PMF Narrative",
    description:
      "Customer segment, problem, solution, wedge, and differentiation",
  },
  {
    name: "⚠️ Risk Register",
    description: "Validated and unvalidated assumptions with evidence",
  },
  {
    name: "📋 Backlog",
    description: "Scored and prioritised work items",
  },
  {
    name: "🏃 Sprint Board",
    description: "Active sprint goals and standup logs",
  },
  {
    name: "🧪 Experiment Log",
    description: "Hypothesis, test design, results, and learnings",
  },
  {
    name: "💰 Financial Model",
    description: "Revenue, burn, and key financial metrics",
  },
];

export function setupNotionWorkspace(companyName: string): string {
  const pageList = WORKSPACE_STRUCTURE.map(
    (p) => `  - **${p.name}**: ${p.description}`
  ).join("\n");

  return `## Bonsai OS Workspace Setup for ${companyName}

I need you to create the following Notion structure using your native Notion connector. Please proceed step by step:

**Step 1 — Create the root page**
Create a new top-level Notion page titled **"${companyName} — Bonsai OS"**.

**Step 2 — Create these sub-pages inside the root page**
${pageList}

**Step 3 — Add an intro callout to the root page**
Inside the root page, add a callout block with this text:
"Welcome to your Bonsai OS workspace. Start with the North Star workshop to align your team on what to build next."

**Step 4 — Return the root page URL**
Once all pages are created, return the URL of the root "**${companyName} — Bonsai OS**" page so the user can bookmark it.

> Note: If the Notion connector is not active, go to Claude Settings → Integrations → Notion and connect it, then run "Set up my Notion workspace" again.`;
}

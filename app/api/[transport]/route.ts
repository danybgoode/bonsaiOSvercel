import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { runPlay, PLAY_NAMES } from "@/src/tools/run-play";
import { getMethodology, METHODOLOGY_SECTIONS } from "@/src/tools/get-methodology";
import { setupNotionWorkspace } from "@/src/tools/setup-notion-workspace";
import { createNorthstarPage } from "@/src/tools/create-northstar-page";
import { scoreBacklog } from "@/src/tools/score-backlog";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "run_play",
      {
        title: "Run Play",
        description:
          "Returns a Bonsai Academy play as a structured facilitation script for Claude to run with the user, step by step. Use this when the user asks to run a workshop or play: onboarding, the North Star workshop, the PMF narrative or risk validation.",
        inputSchema: {
          name: z
            .enum(PLAY_NAMES)
            .describe(
              "The play to run. Options: onboarding, northstar, pmf_narrative, risk_validation"
            ),
        },
      },
      async ({ name }) => {
        try {
          const content = runPlay(name);
          return { content: [{ type: "text" as const, text: content }] };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: "text" as const, text: `Error: ${msg}` }],
            isError: true,
          };
        }
      }
    );

    server.registerTool(
      "get_methodology",
      {
        title: "Get Methodology",
        description:
          "Returns the Bonsai Academy methodology for a given section. Use when the user wants to understand the framework behind a topic.",
        inputSchema: {
          section: z
            .enum(METHODOLOGY_SECTIONS)
            .describe("Methodology section to retrieve: northstar, pmf or risk"),
        },
      },
      async ({ section }) => {
        try {
          const content = getMethodology(section);
          return { content: [{ type: "text" as const, text: content }] };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: "text" as const, text: `Error: ${msg}` }],
            isError: true,
          };
        }
      }
    );

    server.registerTool(
      "setup_notion_workspace",
      {
        title: "Setup Notion Workspace",
        description:
          "Creates the full Bonsai OS structure in the user's Notion workspace using Claude's native Notion connector. Call this when the user asks to set up their Notion workspace. This tool returns instructions for Claude to execute — follow them precisely.",
        inputSchema: {
          company_name: z
            .string()
            .describe("The company or team name for the workspace"),
        },
      },
      async ({ company_name }) => {
        const instructions = setupNotionWorkspace(company_name);
        return { content: [{ type: "text" as const, text: instructions }] };
      }
    );

    server.registerTool(
      "create_northstar_page",
      {
        title: "Create North Star Page",
        description:
          "Writes the verbalized North Star output to a Notion page in the user's workspace. Use after completing the North Star workshop to save the output.",
        inputSchema: {
          token: z
            .string()
            .describe("The user's Notion integration token (secret_...)"),
          page_id: z
            .string()
            .describe("The target Notion page ID where content will be written"),
          content: z
            .object({
              game: z.string().describe("What game you are playing"),
              metric: z.string().describe("The North Star metric"),
              inputs: z.array(z.string()).describe("Key input metrics"),
              greenfield_opportunities: z
                .array(z.string())
                .describe("Greenfield opportunities identified"),
              clarity_statement: z
                .string()
                .describe("One-sentence clarity statement"),
            })
            .describe("The North Star content to write"),
        },
      },
      async ({ token, page_id, content }) => {
        try {
          const url = await createNorthstarPage(token, page_id, content);
          return {
            content: [
              {
                type: "text" as const,
                text: `✅ North Star page created successfully.\n\nView it here: ${url}`,
              },
            ],
          };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: "text" as const, text: `Error: ${msg}` }],
            isError: true,
          };
        }
      }
    );

    server.registerTool(
      "score_backlog",
      {
        title: "Score Backlog",
        description:
          "Scores a list of backlog items by their alignment to a North Star definition. Returns each item rated High, Medium, or Low with one-line reasoning. Use when the user wants to prioritise their backlog.",
        inputSchema: {
          items: z
            .array(
              z.object({
                id: z.string().optional().describe("Optional item identifier"),
                title: z.string().describe("Item title or name"),
                description: z
                  .string()
                  .optional()
                  .describe("Optional item description"),
              })
            )
            .describe("The backlog items to score"),
          northstar: z
            .object({
              game: z
                .string()
                .describe("What game you are playing (the strategic framing)"),
              metric: z.string().describe("The North Star metric to optimise"),
              inputs: z
                .array(z.string())
                .describe("Key input metrics that drive the North Star metric"),
            })
            .describe("The North Star definition to score against"),
        },
      },
      async ({ items, northstar }) => {
        const results = scoreBacklog(items, northstar);
        const formatted = results
          .map(
            (r) =>
              `**${r.title}** — ${r.alignment}\n_${r.reasoning}_`
          )
          .join("\n\n");
        return {
          content: [
            {
              type: "text" as const,
              text: `# Backlog Scored Against North Star\n\n${formatted}`,
            },
          ],
        };
      }
    );
  },
  {
    serverInfo: {
      name: "Bonsai OS",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

export { handler as GET, handler as POST };

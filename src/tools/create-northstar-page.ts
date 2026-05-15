import { Client } from "@notionhq/client";

interface NorthStarContent {
  game: string;
  metric: string;
  inputs: string[];
  greenfield_opportunities: string[];
  clarity_statement: string;
}

export async function createNorthstarPage(
  token: string,
  pageId: string,
  content: NorthStarContent
): Promise<string> {
  const notion = new Client({ auth: token });

  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      // Clarity Statement callout
      {
        type: "callout",
        callout: {
          rich_text: [
            {
              type: "text",
              text: { content: `🌟 ${content.clarity_statement}` },
            },
          ],
          icon: { type: "emoji", emoji: "🌟" },
          color: "yellow_background",
        },
      },
      // Divider
      { type: "divider", divider: {} },
      // Game heading
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "The Game" } }],
        },
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: content.game } }],
        },
      },
      // North Star Metric heading
      {
        type: "heading_2",
        heading_2: {
          rich_text: [
            { type: "text", text: { content: "North Star Metric" } },
          ],
        },
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: content.metric } }],
        },
      },
      // Key Inputs heading
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Key Inputs" } }],
        },
      },
      // Inputs as bulleted list
      ...content.inputs.map((input) => ({
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ type: "text" as const, text: { content: input } }],
        },
      })),
      // Greenfield Opportunities heading
      {
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: { content: "Greenfield Opportunities" },
            },
          ],
        },
      },
      ...content.greenfield_opportunities.map((opp) => ({
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ type: "text" as const, text: { content: opp } }],
        },
      })),
    ],
  });

  // Return URL to the page
  const page = await notion.pages.retrieve({ page_id: pageId });
  const url = "url" in page ? page.url : `https://notion.so/${pageId.replace(/-/g, "")}`;
  return url;
}

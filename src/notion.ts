import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export function getNotionClient(token?: string) {
  const auth = token || process.env.NOTION_API_KEY;
  if (!auth) throw new Error("NOTION_API_KEY is not set");
  return new Client({ auth });
}

export function richTextToString(rich: RichTextItemResponse[]): string {
  return rich.map((t) => t.plain_text).join("");
}

export function blockToMarkdown(block: BlockObjectResponse): string {
  switch (block.type) {
    case "paragraph":
      return richTextToString(block.paragraph.rich_text);
    case "heading_1":
      return `# ${richTextToString(block.heading_1.rich_text)}`;
    case "heading_2":
      return `## ${richTextToString(block.heading_2.rich_text)}`;
    case "heading_3":
      return `### ${richTextToString(block.heading_3.rich_text)}`;
    case "bulleted_list_item":
      return `• ${richTextToString(block.bulleted_list_item.rich_text)}`;
    case "numbered_list_item":
      return richTextToString(block.numbered_list_item.rich_text);
    case "callout":
      return `> ${richTextToString(block.callout.rich_text)}`;
    case "quote":
      return `> ${richTextToString(block.quote.rich_text)}`;
    case "divider":
      return "---";
    case "child_page":
      return `[${block.child_page.title}]`;
    default:
      return "";
  }
}

export async function getPageContent(
  notion: Client,
  pageId: string
): Promise<string> {
  const { results } = await notion.blocks.children.list({ block_id: pageId });
  return results
    .filter(isFullBlock)
    .map(blockToMarkdown)
    .filter(Boolean)
    .join("\n");
}

export async function findChildPageByName(
  notion: Client,
  parentId: string,
  name: string
): Promise<string | null> {
  let cursor: string | undefined;
  do {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: parentId,
      start_cursor: cursor,
    });
    for (const block of results) {
      if (
        isFullBlock(block) &&
        block.type === "child_page" &&
        block.child_page.title.toLowerCase() === name.toLowerCase()
      ) {
        return block.id;
      }
    }
    cursor = next_cursor ?? undefined;
  } while (cursor);
  return null;
}

export async function findPageInSubsection(
  notion: Client,
  rootId: string,
  sectionName: string,
  pageName: string
): Promise<string> {
  // Try the section container first
  const sectionId = await findChildPageByName(notion, rootId, sectionName);
  const searchRoot = sectionId ?? rootId;

  const pageId = await findChildPageByName(notion, searchRoot, pageName);
  if (!pageId) {
    throw new Error(
      `"${pageName}" not found under "${sectionName}" in your Notion workspace`
    );
  }
  return pageId;
}

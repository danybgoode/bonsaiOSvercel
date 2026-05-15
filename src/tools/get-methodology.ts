import { getNotionClient, findChildPageByName, getPageContent } from "../notion";

// Atlas OS Methodology Docs root page — child pages are the source of truth per section.
// Updating content in Notion is reflected immediately; no redeploy needed.
const METHODOLOGY_DOCS_PAGE_ID = "361fe1a5-f192-8130-818f-fe63b701f407";

const SECTION_PAGE_NAMES: Record<string, string> = {
  northstar: "North Star",
  pmf: "PMF",
  risk: "Risk",
  scrum: "Scrum",
  kanban: "Kanban",
  financial: "Financial",
};

export async function getMethodology(section: string): Promise<string> {
  const notion = getNotionClient();
  const pageName = SECTION_PAGE_NAMES[section];
  if (!pageName) throw new Error(`Unknown section: ${section}`);

  const pageId = await findChildPageByName(
    notion,
    METHODOLOGY_DOCS_PAGE_ID,
    pageName
  );
  if (!pageId) {
    throw new Error(
      `Section "${pageName}" not found in Atlas OS Methodology Docs`
    );
  }

  const content = await getPageContent(notion, pageId);
  return `# ${pageName} Methodology\n\n${content}`;
}

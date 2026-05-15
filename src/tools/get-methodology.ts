import { getNotionClient, findPageInSubsection, getPageContent } from "../notion";

const SECTION_PAGE_NAMES: Record<string, string> = {
  northstar: "North Star",
  pmf: "PMF",
  risk: "Risk",
  scrum: "Scrum",
  kanban: "Kanban",
  financial: "Financial",
};

export async function getMethodology(section: string): Promise<string> {
  const rootId = process.env.METHODOLOGY_ROOT_PAGE_ID;
  if (!rootId) throw new Error("METHODOLOGY_ROOT_PAGE_ID is not set");

  const notion = getNotionClient();
  const pageName = SECTION_PAGE_NAMES[section];
  if (!pageName) throw new Error(`Unknown section: ${section}`);

  const pageId = await findPageInSubsection(
    notion,
    rootId,
    "Methodology",
    pageName
  );
  const content = await getPageContent(notion, pageId);

  return `# ${pageName} Methodology\n\n${content}`;
}

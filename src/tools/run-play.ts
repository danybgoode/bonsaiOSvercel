import { getNotionClient, findPageInSubsection, getPageContent } from "../notion";

const PLAY_PAGE_NAMES: Record<string, string> = {
  onboarding: "Onboarding",
  northstar: "North Star",
  pmf_narrative: "PMF Narrative",
  risk_validation: "Risk Validation",
  sprint_planning: "Sprint Planning",
  standup: "Standup",
  experiment_log: "Experiment Log",
};

// Direct Notion page IDs for plays that have a known canonical page.
// Fetch live from Notion — no redeploy needed when content changes.
const PLAY_DIRECT_PAGE_IDS: Partial<Record<string, string>> = {
  onboarding: "361fe1a5-f192-8165-b2a7-fbeb32b61e6e",
};

export async function runPlay(name: string): Promise<string> {
  const notion = getNotionClient();
  const pageName = PLAY_PAGE_NAMES[name];
  if (!pageName) throw new Error(`Unknown play: ${name}`);

  const directId = PLAY_DIRECT_PAGE_IDS[name];
  let pageId: string;

  if (directId) {
    pageId = directId;
  } else {
    const rootId = process.env.METHODOLOGY_ROOT_PAGE_ID;
    if (!rootId) throw new Error("METHODOLOGY_ROOT_PAGE_ID is not set");
    pageId = await findPageInSubsection(notion, rootId, "Plays", pageName);
  }

  const content = await getPageContent(notion, pageId);
  return `# ${pageName} Play\n\n${content}`;
}

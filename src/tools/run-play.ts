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

export async function runPlay(name: string): Promise<string> {
  const rootId = process.env.METHODOLOGY_ROOT_PAGE_ID;
  if (!rootId) throw new Error("METHODOLOGY_ROOT_PAGE_ID is not set");

  const notion = getNotionClient();
  const pageName = PLAY_PAGE_NAMES[name];
  if (!pageName) throw new Error(`Unknown play: ${name}`);

  const pageId = await findPageInSubsection(notion, rootId, "Plays", pageName);
  const content = await getPageContent(notion, pageId);

  return `# ${pageName} Play\n\n${content}`;
}

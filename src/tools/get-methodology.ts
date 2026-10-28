import { METHODOLOGY, PLAYS } from "../content";

// Each section is the shared methodology plus the core concepts of the workshop that teaches it.
const SECTION_PLAYS = {
  northstar: "northstar",
  pmf: "pmf_narrative",
  risk: "risk_validation",
} as const;

export const METHODOLOGY_SECTIONS = ["northstar", "pmf", "risk"] as const;
export type MethodologySection = (typeof METHODOLOGY_SECTIONS)[number];

// The "🧠 Core Concepts" block of a play, up to its "📋" output section.
function coreConcepts(play: string): string {
  const start = play.indexOf("🧠");
  if (start === -1) return "";
  const end = play.indexOf("📋", start);
  return play
    .slice(play.lastIndexOf("\n", start) + 1, end === -1 ? undefined : play.lastIndexOf("\n", end))
    .trim();
}

export function getMethodology(section: MethodologySection): string {
  const play = PLAYS[SECTION_PLAYS[section]];
  if (!play) throw new Error(`Unknown section: ${section}`);
  return `${METHODOLOGY.trim()}\n\n---\n\n${coreConcepts(play)}`;
}

import { PLAYS } from "../content";

// Plays ship inside the deployment (content/plays/*.md), so a workshop can never fail on a missing Notion page or
// a revoked integration token. Edit the Markdown and redeploy to change one.
export const PLAY_NAMES = ["onboarding", "northstar", "pmf_narrative", "risk_validation"] as const;
export type PlayName = (typeof PLAY_NAMES)[number];

export function runPlay(name: PlayName): string {
  const content = PLAYS[name];
  if (!content) throw new Error(`Unknown play: ${name}`);
  return content;
}

interface BacklogItem {
  id?: string;
  title: string;
  description?: string;
}

interface NorthStar {
  game: string;
  metric: string;
  inputs: string[];
}

interface ScoredItem extends BacklogItem {
  alignment: "High" | "Medium" | "Low";
  reasoning: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function overlapScore(a: string, b: string): number {
  const tokensA = new Set(tokenize(a));
  const tokensB = tokenize(b);
  return tokensB.filter((t) => tokensA.has(t)).length;
}

function scoreItem(item: BacklogItem, ns: NorthStar): ScoredItem {
  const itemText = [item.title, item.description ?? ""].join(" ");

  const metricScore = overlapScore(ns.metric, itemText);
  const gameScore = overlapScore(ns.game, itemText);
  const inputScores = ns.inputs.map((inp) => overlapScore(inp, itemText));
  const bestInputScore = inputScores.length > 0 ? Math.max(...inputScores) : 0;
  const matchedInputIdx = inputScores.indexOf(bestInputScore);
  const matchedInput =
    matchedInputIdx >= 0 ? ns.inputs[matchedInputIdx] : null;

  const total = metricScore * 3 + gameScore * 2 + bestInputScore * 2;

  let alignment: "High" | "Medium" | "Low";
  let reasoning: string;

  if (total >= 4 || metricScore >= 2) {
    alignment = "High";
    reasoning =
      metricScore >= 2
        ? `Directly advances the North Star metric (${ns.metric.slice(0, 60)}).`
        : matchedInput
          ? `Strongly aligns with key input "${matchedInput}" and supports the ${ns.game.slice(0, 40)} game.`
          : `Strong keyword alignment with the North Star game and metric.`;
  } else if (total >= 2 || gameScore >= 1) {
    alignment = "Medium";
    reasoning =
      matchedInput
        ? `Supports input "${matchedInput}" but indirect path to the primary metric.`
        : `Related to the ${ns.game.slice(0, 40)} game but doesn't clearly move the needle on ${ns.metric.slice(0, 40)}.`;
  } else {
    alignment = "Low";
    reasoning = `No clear connection to the North Star metric or game. Consider deprioritising or re-framing.`;
  }

  return { ...item, alignment, reasoning };
}

export function scoreBacklog(
  items: BacklogItem[],
  northstar: NorthStar
): ScoredItem[] {
  return items.map((item) => scoreItem(item, northstar));
}

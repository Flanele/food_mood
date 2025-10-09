import { Prefs } from "src/users/users.types";

export function buildExplainReasons(
  objective: string,
  nutrientsObjective: number,
  prefs: Prefs,
  okDiet: boolean,
  okAll: boolean,
  affinityHits: string[],
  profileSimilarity: number,
): string[] {
  const reasons: string[] = [];

  if (objective !== 'balanced') {
    if (nutrientsObjective > 0)
      reasons.push(
        `Calories tended to align with better ${objective} in your logs.`,
      );
    else if (nutrientsObjective < 0)
      reasons.push(
        `Higher calories correlated with lower ${objective} in your logs.`,
      );
    else
      reasons.push(`No clear link between calories and your ${objective} yet.`);
  } else {
    reasons.push('Baseline recommendation (balanced objective).');
  }

  if (prefs?.diet || prefs?.allergies?.length) {
    if (!okAll) reasons.push('Contains your allergens.');
    else if (!okDiet) reasons.push(`Does not match your diet (${prefs.diet}).`);
    else reasons.push('Passes your diet/allergy check.');
  }

  if (affinityHits.length)
    reasons.push(`You frequently eat: ${affinityHits.join(', ')}.`);

  if (profileSimilarity !== 0)
    reasons.push(
      profileSimilarity > 0
        ? 'Similar users rated this recipe highly.'
        : 'Similar users rated this recipe lower.',
    );

  return reasons;
}

export function computeFinalScoreWithPrefs(
  base: number,
  parts: {
    nutrientsObjective: number;
    affinity: number;
    profileSimilarity: number;
  },
  okDiet: boolean,
  okAll: boolean,
): { score: number; prefsContribution: number } {
  const partial =
    base + parts.nutrientsObjective + parts.affinity + parts.profileSimilarity;

  if (!okAll) return { score: -1, prefsContribution: -(partial + 1) };

  const prefsContribution = okDiet ? 0 : -0.15;
  
  return {
    score: Number((partial + prefsContribution).toFixed(2)),
    prefsContribution: Number(prefsContribution.toFixed(2)),
  };
}

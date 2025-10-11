import { Objective } from '../dto';
import { LogLite, PeerLogLite } from '../recommendation.types';
import { pickScoreForObjective } from './pickSroceObjective';

const VOTE_STEP = 0.1;
const MIN_VOTES_PER_RECIPE = 2;

export function similarProfilesRecipesVoting(
  peerLogs: Array<PeerLogLite>,
  objective: Objective,
  limit: number,
) {
  const voteCountByRecipeId = new Map<number, number>();
  const scoreByRecipeId = new Map<number, number>();

  for (const log of peerLogs) {
    const value = pickScoreForObjective(log, objective);
    if (value == null) continue;

    let vote = 0;
    if (value >= 7) vote = +VOTE_STEP;
    else if (value <= 4) vote = -VOTE_STEP;
    else continue;

    scoreByRecipeId.set(
      log.recipeId,
      (scoreByRecipeId.get(log.recipeId) ?? 0) + vote,
    );
    voteCountByRecipeId.set(
      log.recipeId,
      (voteCountByRecipeId.get(log.recipeId) ?? 0) + 1,
    );
  }

  const topRecipeIds = Array.from(scoreByRecipeId.entries())
    .filter(
      ([recipeId]) =>
        (voteCountByRecipeId.get(recipeId) ?? 0) >= MIN_VOTES_PER_RECIPE,
    )
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([recipeId]) => recipeId);

  return { topRecipeIds, scoreByRecipeId };
}

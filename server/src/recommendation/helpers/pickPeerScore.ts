export function pickPeerScore(
  peers: Array<{ recipeId: number; score: number }>,
  recipeId: number,
): number {
  const found = peers.find((i) => i.recipeId === recipeId);
  return found ? Number(found.score.toFixed(2)) : 0;
}

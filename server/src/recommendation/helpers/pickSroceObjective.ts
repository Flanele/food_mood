import { Objective } from '../dto';

export function pickScoreForObjective(
  log: {
    moodScore: number | null;
    energyScore: number | null;
    sleepScore: number | null;
  },
  objective: Objective,
): number | null {
    
  if (objective === 'mood') return log.moodScore ?? null;
  if (objective === 'energy') return log.energyScore ?? null;
  if (objective === 'sleep') return log.sleepScore ?? null;
  const values = [log.moodScore, log.energyScore, log.sleepScore].filter(
    (v): v is number => typeof v === 'number',
  );
  return values.length ? Math.max(...values) : null; // balanced
}

import { Criterion, Player, GridPuzzle } from '../types';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_]/g, ' ')
    .trim();
}

// Fast WeakMap cache for search keys so normalizeText runs only once per player
const playerSearchIndex = new WeakMap<Player, string>();

export function getPlayerSearchKey(player: Player): string {
  let key = playerSearchIndex.get(player);
  if (!key) {
    key = normalizeText(`${player.name} ${player.normalizedName || ''}`);
    playerSearchIndex.set(player, key);
  }
  return key;
}

export function validatePlayerForCriterion(player: Player, criterion: Criterion): boolean {
  if (criterion.type === 'club') {
    return player.clubs.includes(criterion.id);
  }

  if (criterion.type === 'achievement') {
    return !!player.achievements && player.achievements.includes(criterion.id);
  }

  if (criterion.type === 'stat') {
    if (criterion.id === 'romania_national') {
      return player.nationalCaps >= 15 || (!!player.achievements && player.achievements.includes('romania_national'));
    }
  }

  return false;
}

export function validatePlayerForCell(
  player: Player,
  rowCriterion: Criterion,
  colCriterion: Criterion
): boolean {
  return (
    validatePlayerForCriterion(player, rowCriterion) &&
    validatePlayerForCriterion(player, colCriterion)
  );
}

export function searchPlayers(
  query: string,
  allPlayers: Player[],
  usedPlayerIds: Set<string>
): Player[] {
  const cleanQuery = normalizeText(query);
  if (!cleanQuery) return [];

  const results: Player[] = [];
  for (let i = 0; i < allPlayers.length; i++) {
    const p = allPlayers[i];
    if (usedPlayerIds.has(p.id)) continue;
    if (getPlayerSearchKey(p).includes(cleanQuery)) {
      results.push(p);
      if (results.length >= 10) break; // Instant early exit!
    }
  }
  return results;
}

export function getPossibleSolutions(
  rowCriterion: Criterion,
  colCriterion: Criterion,
  allPlayers: Player[]
): Player[] {
  return allPlayers.filter(p => validatePlayerForCell(p, rowCriterion, colCriterion));
}

export function verifyPuzzleSolvability(
  puzzle: GridPuzzle,
  allPlayers: Player[]
): { row: number; col: number; solutionCount: number }[] {
  const report = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const solutions = getPossibleSolutions(puzzle.rows[r], puzzle.cols[c], allPlayers);
      report.push({
        row: r,
        col: c,
        solutionCount: solutions.length
      });
    }
  }
  return report;
}

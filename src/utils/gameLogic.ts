import { Criterion, Player, GridPuzzle } from '../types';
import { CRITERIA_MAP } from '../data/clubs';

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

/**
 * Procedurally generates a fresh 3x3 grid where:
 * 1. All 6 criteria (3 rows and 3 columns) are completely distinct.
 * 2. Every single intersection cell has at least 1 verified player solution.
 */
export function generateRandomSolvableGrid(allPlayers: Player[]): GridPuzzle {
  const allCriteriaKeys = Object.keys(CRITERIA_MAP);

  for (let attempt = 0; attempt < 80; attempt++) {
    const shuffled = [...allCriteriaKeys].sort(() => 0.5 - Math.random());
    const rowKeys = shuffled.slice(0, 3);
    const candidateColKeys = shuffled.slice(3);

    const validColKeys = candidateColKeys.filter(colKey => {
      const colCrit = CRITERIA_MAP[colKey];
      return rowKeys.every(rowKey => {
        const rowCrit = CRITERIA_MAP[rowKey];
        return getPossibleSolutions(rowCrit, colCrit, allPlayers).length >= 1;
      });
    });

    if (validColKeys.length >= 3) {
      const selectedColKeys = validColKeys.slice(0, 3);
      const rows = rowKeys.map(k => CRITERIA_MAP[k]);
      const cols = selectedColKeys.map(k => CRITERIA_MAP[k]);

      let minSol = 999;
      for (const r of rows) {
        for (const c of cols) {
          const count = getPossibleSolutions(r, c, allPlayers).length;
          if (count < minSol) minSol = count;
        }
      }

      const difficulty: 'Ușor' | 'Mediu' | 'Greu' | 'Mod Patron' =
        minSol >= 3 ? 'Ușor' : minSol >= 2 ? 'Mediu' : 'Greu';

      return {
        id: `grid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `Gigi Grid #${Math.floor(Math.random() * 900) + 100}`,
        difficulty,
        rows,
        cols
      };
    }
  }

  // Fallback preset
  return {
    id: 'fallback-grid',
    title: 'Gigi Daily Grid #1: Derby & Legende',
    difficulty: 'Mediu',
    rows: [CRITERIA_MAP.fcsb, CRITERIA_MAP.dinamo, CRITERIA_MAP.craiova],
    cols: [CRITERIA_MAP.galatasaray, CRITERIA_MAP.romania_national, CRITERIA_MAP.liga1_champion]
  };
}

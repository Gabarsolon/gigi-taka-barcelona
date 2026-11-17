import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Player, CellPosition, GridPuzzle } from './types';
import rawPlayers from './data/players.json';
import { PRESET_PUZZLES, GIGI_QUOTES } from './data/puzzles';
import { Header } from './components/Header';
import { GigiBanter } from './components/GigiBanter';
import { Grid } from './components/Grid';
import { PlayerSearchModal } from './components/PlayerSearchModal';
import { GameSummaryModal } from './components/GameSummaryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { validatePlayerForCell, generateRandomSolvableGrid } from './utils/gameLogic';
import { sound } from './utils/soundEngine';
import { Dices, Calendar } from 'lucide-react';

const MAX_LIVES = 3;

export function App() {
  const allPlayers = rawPlayers as Player[];

  const [currentPuzzle, setCurrentPuzzle] = useState<GridPuzzle>(() => PRESET_PUZZLES[0]);

  const [grid, setGrid] = useState<(Player | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);
  const [usedPlayerIds, setUsedPlayerIds] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);

  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [errorCell, setErrorCell] = useState<CellPosition | null>(null);

  const [gigiQuote, setGigiQuote] = useState(
    "Faci pac, pac, tiki-taka Barcelona! Alege o căsuță și arată-mi ce jucători știi!"
  );
  const [gigiMood, setGigiMood] = useState<'happy' | 'angry' | 'thinking'>('happy');

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null);

  // Sound sync
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  const startNewGame = useCallback((generateNew = true) => {
    if (generateNew) {
      const freshPuzzle = generateRandomSolvableGrid(allPlayers);
      setCurrentPuzzle(freshPuzzle);
    }
    setGrid([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]);
    setUsedPlayerIds(new Set());
    setLives(MAX_LIVES);
    setScore(0);
    setSelectedCell(null);
    setErrorCell(null);
    setGameResult(null);
    setIsSummaryOpen(false);
    setGigiMood('happy');
    setGigiQuote(
      "Meci nou, tată! 6 criterii proaspete, tiki-taka din prima atingere!"
    );
  }, [allPlayers]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (lives <= 0 || gameResult !== null) return;
    sound.playPac();
    setSelectedCell({ row, col });
    setGigiMood('thinking');
  }, [lives, gameResult]);

  const handleSelectPlayer = useCallback((player: Player) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    const rowCriterion = currentPuzzle.rows[row];
    const colCriterion = currentPuzzle.cols[col];

    const isValid = validatePlayerForCell(player, rowCriterion, colCriterion);

    if (isValid) {
      // Correct!
      sound.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = player;
      setGrid(newGrid);

      const newUsed = new Set(usedPlayerIds);
      newUsed.add(player.id);
      setUsedPlayerIds(newUsed);

      const newScore = score + 1;
      setScore(newScore);

      const randomQuote =
        GIGI_QUOTES.correct[Math.floor(Math.random() * GIGI_QUOTES.correct.length)];
      setGigiQuote(randomQuote);
      setGigiMood('happy');
      setSelectedCell(null);

      // Check win condition
      if (newScore === 9) {
        sound.playVictory();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
        setGameResult('won');
        const winQuote =
          GIGI_QUOTES.gameWon[Math.floor(Math.random() * GIGI_QUOTES.gameWon.length)];
        setGigiQuote(winQuote);
        setTimeout(() => setIsSummaryOpen(true), 800);
      }
    } else {
      // Wrong answer!
      sound.playWrong();
      setErrorCell({ row, col });
      setTimeout(() => setErrorCell(null), 800);

      const newLives = lives - 1;
      setLives(newLives);

      const randomQuote =
        GIGI_QUOTES.wrong[Math.floor(Math.random() * GIGI_QUOTES.wrong.length)];
      setGigiQuote(randomQuote);
      setGigiMood('angry');
      setSelectedCell(null);

      // Check game over
      if (newLives <= 0) {
        setGameResult('lost');
        const loseQuote =
          GIGI_QUOTES.gameOver[Math.floor(Math.random() * GIGI_QUOTES.gameOver.length)];
        setGigiQuote(loseQuote);
        setTimeout(() => setIsSummaryOpen(true), 900);
      }
    }
  }, [selectedCell, currentPuzzle, grid, usedPlayerIds, score, lives]);

  const loadDailyGrid = () => {
    sound.playPoc();
    setCurrentPuzzle(PRESET_PUZZLES[0]);
    startNewGame(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pb-8">
      <div>
        <Header
          score={score}
          lives={lives}
          maxLives={MAX_LIVES}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onReset={() => startNewGame(true)}
          puzzleTitle={currentPuzzle.title}
        />

        <GigiBanter quote={gigiQuote} mood={gigiMood} />

        <Grid
          rows={currentPuzzle.rows}
          cols={currentPuzzle.cols}
          grid={grid}
          selectedCell={selectedCell}
          errorCell={errorCell}
          onCellClick={handleCellClick}
          disabled={lives <= 0 || gameResult !== null}
        />

        {/* Puzzle Switcher Controls */}
        <div className="w-full max-w-4xl mx-auto px-4 mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Dificultate: <strong className="text-gold">{currentPuzzle.difficulty}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDailyGrid}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 font-semibold"
            >
              <Calendar size={14} className="text-emerald-400" />
              Grila Zilei #1
            </button>

            <button
              onClick={() => {
                sound.playPoc();
                startNewGame(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white transition border border-emerald-600 font-bold shadow-md shadow-emerald-950"
            >
              <Dices size={14} className="text-gold animate-spin-slow" />
              🎲 Grilă Nouă Aleatorie
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-slate-400 mt-6 px-4">
        <p>Gigi-Taka-Barcelona • Football Grid Trivia 100% Românesc • Inspirat de folclorul Ligii 1</p>
      </footer>

      {/* Modals */}
      {selectedCell && (
        <PlayerSearchModal
          isOpen={selectedCell !== null}
          onClose={() => setSelectedCell(null)}
          rowCriterion={currentPuzzle.rows[selectedCell.row]}
          colCriterion={currentPuzzle.cols[selectedCell.col]}
          allPlayers={allPlayers}
          usedPlayerIds={usedPlayerIds}
          onSelectPlayer={handleSelectPlayer}
        />
      )}

      <GameSummaryModal
        isOpen={isSummaryOpen}
        isWon={gameResult === 'won'}
        score={score}
        grid={grid}
        gigiQuote={gigiQuote}
        onPlayAgain={() => startNewGame(true)}
        puzzleTitle={currentPuzzle.title}
      />

      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;

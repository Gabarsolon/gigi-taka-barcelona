import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Player, CellPosition, GridPuzzle, DifficultyLevel } from './types';
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

export function App() {
  const allPlayers = rawPlayers as Player[];

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Mediu');
  const maxLives = difficulty === 'Mod Patron' ? 2 : 3;

  const [currentPuzzle, setCurrentPuzzle] = useState<GridPuzzle>(() => PRESET_PUZZLES[0]);

  const [grid, setGrid] = useState<(Player | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);
  const [usedPlayerIds, setUsedPlayerIds] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(maxLives);
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

  const startNewGame = useCallback((generateNew = true, diff = difficulty) => {
    const livesForDiff = diff === 'Mod Patron' ? 2 : 3;
    if (generateNew) {
      const freshPuzzle = generateRandomSolvableGrid(allPlayers, diff);
      setCurrentPuzzle(freshPuzzle);
    }
    setGrid([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]);
    setUsedPlayerIds(new Set());
    setLives(livesForDiff);
    setScore(0);
    setSelectedCell(null);
    setErrorCell(null);
    setGameResult(null);
    setIsSummaryOpen(false);
    setGigiMood('happy');

    if (diff === 'Mod Patron') {
      setGigiQuote("Băi băiatule, ai intrat în Mod Patron! Ai doar 2 greșeli, nu accept somnolență pe teren!");
    } else if (diff === 'Greu') {
      setGigiQuote("Atenție mare! Intrăm în folclorul greu al fotbalului românesc!");
    } else if (diff === 'Ușor') {
      setGigiQuote("Hai să începem ușor, ca un antrenament cu juniorii!");
    } else {
      setGigiQuote("Meci nou, tată! 6 criterii proaspete, tiki-taka din prima atingere!");
    }
  }, [allPlayers, difficulty]);

  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    sound.playPoc();
    setDifficulty(newDiff);
    startNewGame(true, newDiff);
  };

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
    setDifficulty(PRESET_PUZZLES[0].difficulty);
    startNewGame(false, PRESET_PUZZLES[0].difficulty);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pb-8">
      <div>
        <Header
          score={score}
          lives={lives}
          maxLives={maxLives}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onReset={() => startNewGame(true, difficulty)}
          puzzleTitle={currentPuzzle.title}
        />

        <GigiBanter quote={gigiQuote} mood={gigiMood} />

        {/* Difficulty Selector Bar */}
        <div className="w-full max-w-4xl mx-auto px-4 my-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="text-slate-400">Alege Dificultatea:</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(['Ușor', 'Mediu', 'Greu', 'Mod Patron'] as DifficultyLevel[]).map(level => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-black text-xs transition flex items-center gap-1 ${
                      isActive
                        ? level === 'Mod Patron'
                          ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-gold shadow-md shadow-purple-950 border border-gold/40'
                          : level === 'Greu'
                          ? 'bg-red-700 text-white shadow-md shadow-red-950'
                          : level === 'Mediu'
                          ? 'bg-gold text-black shadow-md shadow-gold/30'
                          : 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {level === 'Mod Patron' ? '👑 Patron' :
                     level === 'Greu' ? '🔥 Greu' :
                     level === 'Mediu' ? '⚽ Mediu' : '⭐ Ușor'}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadDailyGrid}
                className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 text-xs font-semibold"
                title="Încarcă grila oficială a zilei"
              >
                <Calendar size={13} className="text-emerald-400" />
                Grila Zilei
              </button>

              <button
                onClick={() => {
                  sound.playPoc();
                  startNewGame(true, difficulty);
                }}
                className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white transition border border-emerald-600 text-xs font-black shadow-md shadow-emerald-950"
                title="Generează o grilă nouă cu dificultatea aleasă"
              >
                <Dices size={13} className="text-gold" />
                Grilă Nouă
              </button>
            </div>
          </div>
        </div>

        <Grid
          rows={currentPuzzle.rows}
          cols={currentPuzzle.cols}
          grid={grid}
          selectedCell={selectedCell}
          errorCell={errorCell}
          onCellClick={handleCellClick}
          disabled={lives <= 0 || gameResult !== null}
        />
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
        onPlayAgain={() => startNewGame(true, difficulty)}
        puzzleTitle={currentPuzzle.title}
      />

      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;

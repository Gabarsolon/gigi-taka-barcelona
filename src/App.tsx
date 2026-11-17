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
import { SettingsModal } from './components/SettingsModal';
import { validatePlayerForCell, generateRandomSolvableGrid } from './utils/gameLogic';
import { sound } from './utils/soundEngine';
import { Dices } from 'lucide-react';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
          onOpenSettings={() => setIsSettingsOpen(true)}
          onReset={() => startNewGame(true, difficulty)}
          puzzleTitle={currentPuzzle.title}
          difficulty={difficulty}
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

        {/* Clean Controls below Grid */}
        <div className="w-full max-w-4xl mx-auto px-2.5 sm:px-4 mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span>Dificultate:</span>
            <button
              onClick={() => {
                sound.playPac();
                setIsSettingsOpen(true);
              }}
              className="text-gold font-bold hover:underline flex items-center gap-0.5 sm:gap-1 cursor-pointer"
              title="Apasă pentru a schimba dificultatea"
            >
              {currentPuzzle.difficulty} ⚙️
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={loadDailyGrid}
              className="hover:text-emerald-300 font-semibold transition cursor-pointer"
            >
              Grila Zilei
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sound.playPoc();
                startNewGame(true, difficulty);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Dices size={13} className="text-gold" />
              Meci Nou
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] sm:text-xs text-slate-500 mt-4 sm:mt-6 px-4">
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        difficulty={difficulty}
        onSelectDifficulty={handleDifficultyChange}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onGenerateNewGrid={() => startNewGame(true, difficulty)}
        onLoadDailyGrid={loadDailyGrid}
      />

      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;

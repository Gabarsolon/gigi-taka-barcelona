import React from 'react';
import { Criterion, Player, CellPosition } from '../types';
import { Cell } from './Cell';

interface GridProps {
  rows: Criterion[];
  cols: Criterion[];
  grid: (Player | null)[][];
  selectedCell: CellPosition | null;
  errorCell: CellPosition | null;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

export const Grid: React.FC<GridProps> = ({
  rows,
  cols,
  grid,
  selectedCell,
  errorCell,
  onCellClick,
  disabled
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 my-2">
      <div className="relative bg-pitch/90 border-2 border-emerald-700/60 rounded-3xl p-2.5 sm:p-4 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Grid Container */}

        {/* 4x4 Grid layout */}
        <div className="relative grid grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3">
          {/* Top-Left Corner */}
          <div className="flex items-center justify-center p-2 rounded-xl bg-slate-900/40 border border-emerald-900/40">
            <span className="text-xl sm:text-2xl font-black text-gold/80 tracking-widest select-none">
              3×3
            </span>
          </div>

          {/* Column Headers (Top) */}
          {cols.map((col, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-center shadow"
            >
              <span className="text-base sm:text-xl mb-0.5">{col.badge}</span>
              <span className="text-xs sm:text-sm font-black text-slate-100 leading-tight">
                {col.shortName || col.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-full hidden sm:block">
                {col.name}
              </span>
            </div>
          ))}

          {/* Rows */}
          {rows.map((row, rIdx) => (
            <React.Fragment key={rIdx}>
              {/* Row Header (Left) */}
              <div className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-center shadow">
                <span className="text-base sm:text-xl mb-0.5">{row.badge}</span>
                <span className="text-xs sm:text-sm font-black text-slate-100 leading-tight">
                  {row.shortName || row.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-full hidden sm:block">
                  {row.name}
                </span>
              </div>

              {/* 3 Interactive Cells for this Row */}
              {cols.map((_, cIdx) => {
                const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                const isError = errorCell?.row === rIdx && errorCell?.col === cIdx;
                return (
                  <Cell
                    key={`${rIdx}-${cIdx}`}
                    player={grid[rIdx][cIdx]}
                    isSelected={isSelected}
                    isError={isError}
                    onClick={() => onCellClick(rIdx, cIdx)}
                    disabled={disabled || grid[rIdx][cIdx] !== null}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

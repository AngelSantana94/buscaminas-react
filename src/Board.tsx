import { useState, useEffect } from "react";
import { shuffle, calculateRadar } from "./utils";

export interface ICell {
  id: number;
  index: number;
  hasMine: boolean;
  isOpen: boolean;
  hasFlag: boolean;
  minesNearby: number;
}

interface BoardProps {
  rows: number;
  cols: number;
  level: number;
  onGameOver: () => void;
  onWin: () => void;
  resetKey: number;
}

export const Board = ({
  rows,
  cols,
  level,
  onGameOver,
  onWin,
  resetKey,
}: BoardProps) => {
  const [cells, setCells] = useState<ICell[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState<"WIN" | "LOSE" | null>(
    null,
  );

  const playSFX = (file: string, volume: number = 0.2) => {
    const sfx = new Audio(`/sounds/${file}`);
    sfx.volume = volume;
    sfx.play().catch(() => {});
  };

  useEffect(() => {
    const total = rows * cols;
    const difficulty = level === 1 ? 7 : level === 2 ? 6 : 5;
    let base: ICell[] = Array.from({ length: total }, (_, i) => ({
      id: i,
      index: i,
      hasMine: Math.random() < 1 / difficulty,
      isOpen: false,
      hasFlag: false,
      minesNearby: 0,
    }));
    setCells(calculateRadar(shuffle(base), rows, cols));
    setIsGameOver(false);
    setShowStatusModal(null);
    setTime(0);
  }, [rows, cols, level, resetKey]);

  useEffect(() => {
    let interval: any;
    if (!isGameOver && cells.some((c) => c.isOpen)) {
      interval = setInterval(() => {
        setTime((prev) => (prev < 999 ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameOver, cells]);

  const handleCellClick = (index: number) => {
    if (isGameOver || cells[index].isOpen || cells[index].hasFlag) return;

    playSFX("click.mp3", 0.1);

    let newCells = [...cells];

    if (newCells[index].hasMine) {
      playSFX("bomba.mp3", 0.3);

      newCells = newCells.map((c) => (c.hasMine ? { ...c, isOpen: true } : c));
      setCells(newCells);
      setIsGameOver(true);

      setTimeout(() => {
        setShowStatusModal("LOSE");
        onGameOver();
      }, 700);
      return;
    }

    const openRecursive = (idx: number) => {
      if (newCells[idx].isOpen || newCells[idx].hasMine) return;
      newCells[idx] = { ...newCells[idx], isOpen: true };
      if (newCells[idx].minesNearby === 0) {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        for (let df = -1; df <= 1; df++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nRow = r + df;
            const nCol = c + dc;
            if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols)
              openRecursive(nRow * cols + nCol);
          }
        }
      }
    };

    openRecursive(index);
    setCells(newCells);

    if (newCells.filter((c) => !c.hasMine).every((c) => c.isOpen)) {
      setIsGameOver(true);

      playSFX("aplausos.mp3", 0.3);

      setTimeout(() => {
        setShowStatusModal("WIN");
        onWin();
      }, 700);
    }
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (isGameOver || cells[index].isOpen) return;

    playSFX("click.mp3", 0.05);

    const newCells = [...cells];
    newCells[index] = { ...newCells[index], hasFlag: !newCells[index].hasFlag };
    setCells(newCells);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-2 overflow-hidden animate-fade-in relative">
      <div
        className="bg-slate-800 rounded-3xl p-1 shadow-2xl border-b-8 border-r-8 border-slate-900 relative"
        style={{ width: "min(95vw, 400px)" }}
      >
        {showStatusModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl" />
            <div
              className={`relative z-10 p-6 rounded-2xl border-4 flex flex-col items-center animate-in zoom-in duration-300
              ${showStatusModal === "WIN" ? "border-green-500 bg-slate-900" : "border-red-600 bg-slate-900"}`}
            >
              <h2
                className={`text-3xl font-black mb-2 tracking-tighter
                ${showStatusModal === "WIN" ? "text-green-500" : "text-red-600"}`}
              >
                {showStatusModal === "WIN" ? "¡NIVEL SUPERADO!" : "¡HAS CAÍDO!"}
              </h2>
              <p className="text-white font-mono text-sm opacity-70">
                {showStatusModal === "WIN"
                  ? "Cargando siguiente reto..."
                  : "Las minas ganan esta vez"}
              </p>
            </div>
          </div>
        )}

        <div className="w-full bg-slate-700/50 rounded-t-2xl py-1 px-4 flex justify-center border-b border-slate-600/50">
          <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase italic">
            NIVEL {level}
          </span>
        </div>

        <div className="bg-slate-900 m-2 p-3 rounded-xl border-2 border-slate-700 flex justify-between items-center shadow-inner">
          <div className="bg-black px-2 py-1 rounded border border-red-900/50 min-w-[60px] text-center">
            <span className="font-mono text-red-600 text-xl font-black">
              {String(
                Math.max(
                  0,
                  cells.filter((c) => c.hasMine).length -
                    cells.filter((c) => c.hasFlag).length,
                ),
              ).padStart(3, "0")}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em]">
              BUSCAMINAS
            </span>
            <div
              className={`h-1 w-6 mt-1 rounded-full ${isGameOver ? "bg-red-600" : "bg-blue-500 animate-pulse"}`}
            ></div>
          </div>

          <div className="bg-black px-2 py-1 rounded border border-red-900/50 min-w-[60px] text-center">
            <span className="font-mono text-red-600 text-xl font-black">
              {String(time).padStart(3, "0")}
            </span>
          </div>
        </div>

        <div className="p-2 pt-0">
          <div
            className="grid gap-1 p-2 bg-black/20 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              aspectRatio: `${cols} / ${rows}`,
            }}
          >
            {cells.map((cell, idx) => {
              let cellImg = "img/caja-cerrada.jpeg";
              let cellAlt = "Celda cerrada"; 
              if (cell.isOpen) {
                if (cell.hasMine) {
                  cellImg = "img/caja-mina.jpeg";
                  cellAlt = "Mina explotada";
                } else {
                  cellImg = "img/caja-abierta.jpeg";
                  cellAlt = `Mina cerca: ${cell.minesNearby}`;
                }
              } else if (cell.hasFlag) {
                cellImg = "img/caja-bandera.png";
                cellAlt = "Bandera colocada";
              }

              return (
                <div
                  key={`${cell.id}-${idx}`}
                  onClick={() => handleCellClick(cell.index)}
                  onContextMenu={(e) => handleRightClick(e, cell.index)}
                  className="relative aspect-square w-full rounded-sm overflow-hidden cursor-pointer group shadow-sm"
                >
                  <img
                    src={cellImg}
                    alt="cellAlt"
                    className="absolute inset-0 w-full h-full object-cover group-active:scale-95 transition-transform"
                  />
                  {cell.isOpen && !cell.hasMine && cell.minesNearby > 0 && (
                    <span className="absolute inset-0 flex items-center justify-center font-black text-slate-100 text-sm sm:text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10 select-none">
                      {cell.minesNearby}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="h-1.5 w-full bg-slate-900 rounded-full border-t border-slate-700 shadow-inner flex justify-center gap-1">
            <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
            <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

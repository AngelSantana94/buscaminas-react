import { useState, useEffect, useRef } from "react";
import { Board } from "./Board.tsx";

type GameStatus = "HOME" | "PLAYING";

function App() {
  const [status, setStatus] = useState<GameStatus>("HOME");
  const [level, setLevel] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startGame = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("sounds/bg-music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    audioRef.current.play().catch((error) => {
      console.error("Error al reproducir audio:", error);
    });

    setStatus("PLAYING");
  };

  useEffect(() => {
    if (status === "HOME") {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [status]);

  const getBoardConfig = () => {
    if (level === 1) return { rows: 6, cols: 6 };
    if (level === 2) return { rows: 8, cols: 8 };
    return { rows: 10, cols: 10 };
  };

  const { rows, cols } = getBoardConfig();

  const handleWin = () => {
    setTimeout(() => {
      if (level < 3) {
        setLevel((prev) => prev + 1);
      } else {
        setStatus("HOME");
        setLevel(1);
      }
    }, 3000);
  };

  return (
    <div
      className="hero min-h-screen bg-fixed bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: "url(img/backgroundimg.jpeg)" }}
    >
      <div className="hero-overlay bg-opacity-70 backdrop-blur-sm"></div>

      <div className="hero-content text-center">
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          {status === "HOME" && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <img
                src="img/title.png"
                alt="Buscaminas"
                className="mb-12 w-80 drop-shadow-2xl"
              />
              <button
                onClick={startGame}
                className="btn bg-green-600 hover:bg-green-800 border-none text-white btn-lg px-12 shadow-xl hover:scale-110 transition-all"
              >
                JUGAR
              </button>
            </div>
          )}

          {status === "PLAYING" && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 w-full items-center">
              <Board
                rows={rows}
                cols={cols}
                level={level}
                resetKey={resetKey}
                onGameOver={() => {}}
                onWin={handleWin}
              />

              <div className="flex justify-center gap-4 w-full mt-4">
                <button
                  className="btn bg-green-600 hover:bg-green-800 border-none text-white w-32 shadow-lg"
                  onClick={() => setResetKey((prev) => prev + 1)}
                >
                  REINICIAR
                </button>
                <button
                  className="btn bg-red-600 hover:bg-red-800 border-none text-white w-32 shadow-lg transition-colors"
                  onClick={() => {
                    setStatus("HOME");
                    setLevel(1);
                  }}
                >
                  SALIR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

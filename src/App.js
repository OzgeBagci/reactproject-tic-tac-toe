import React, { useState } from "react";
import StartPage from "./StartPage";
import GameComponent from "./GameComponent";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="app-container">
      {!gameStarted ? (
        <StartPage onStart={() => setGameStarted(true)} />
      ) : (
        <GameComponent />
      )}
    </div>
  );
}

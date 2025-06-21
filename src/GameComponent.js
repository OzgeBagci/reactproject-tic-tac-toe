import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

// The Square component represents a single square in the tic-tac-toe grid
function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={"square" + (highlight ? " highlight" : "")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// The Board component renders the 3x3 grid of squares
function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  const winningLine = result ? result.line : [];

  //Handles square clicks - prevents clicks on filled squares or after game ends
  function handleClick(i) {
    if (result || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  // Generates the 3x3 board grid dynamically
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlight={winningLine.includes(index)}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  }

  return <>{boardRows}</>;
}

// The Main Game component manages the game state
export default function GameComponent() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentSquares = history[currentMove];
  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const isGameOver = winner || currentSquares.every(Boolean);
  const [gameEnded, setGameEnded] = useState(false);

  // Confetti effect handler
  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  useEffect(() => {
    if (winner || currentSquares.every(Boolean)) {
      setGameEnded(true);
    }
  }, [winner, currentSquares]);
  // Handles player moves and updates game history
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  // Complete game reset function
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true);
    setShowConfetti(false);
    setGameEnded(false);
  }

  // Jumps to a specific move in the game history

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  // Determine the status message based on the game state
  const isBoardEmpty = currentSquares.every((square) => square === null);

  const status = winner
    ? `Winner: ${winner}`
    : isGameOver
    ? "That's a tie!"
    : !isBoardEmpty
    ? `Next player: ${xIsNext ? "X" : "O"}`
    : "";

  //Generates movex history list
  const moves = history.map((_, move) => {
    if (move === 0) return null;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {move === currentMove ? (
            <strong>Move #{move}</strong>
          ) : (
            `Go to move #${move}`
          )}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}

        <div className="game-board">
          {status && <div className="status">{status}</div>}
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>

        <div className="game-info">
          {gameEnded && (
            <button className="play-again" onClick={resetGame}>
              Play Again
            </button>
          )}
          <ol>{moves}</ol>
        </div>
      </div>

      <div className="footer-container">
        This project was coded by{" "}
        <a
          href="https://github.com/OzgeBagci"
          target="_blank"
          rel="noopener noreferrer"
        >
          Øzge Bagci
        </a>{" "}
        and is{" "}
        <a
          href="https://github.com/OzgeBagci/reactproject-tic-tac-toe"
          target="_blank"
          rel="noopener noreferrer"
        >
          open-sourced on GitHub{" "}
        </a>
        and{" "}
        <a
          href="https://tictactoe-projectreact.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          hosted on Netlify
        </a>{" "}
        © 2025. Based on{" "}
        <a
          href="https://react.dev/learn/tutorial-tic-tac-toe"
          target="_blank"
          rel="noopener noreferrer"
        >
          React tutorial
        </a>{" "}
        code
      </div>
    </>
  );
}

// Winner calculator
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

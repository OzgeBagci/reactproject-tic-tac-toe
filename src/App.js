import { useState } from "react";

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
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];
  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }
  // Determine the status message based on the game state
  const status = winner
    ? "Winner: " + winner
    : !squares.includes(null)
    ? "Draw! No winner."
    : "Next player: " + (xIsNext ? "X" : "O");
  // Render the status message and the grid of squares
  <div className="status">{status}</div>;
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
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}
// The Game component manages the game state and renders the Board and game history
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }
  // Function to jump to a specific move in the game history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  // Determine the status message based on the game state
  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
      return (
        <li key={move}>
          <span>{description}</span>
        </li>
      );
    } else {
      description = move > 0 ? `Go to move #${move}` : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
// Function to calculate the winner of the game
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

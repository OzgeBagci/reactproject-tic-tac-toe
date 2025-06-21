export default function StartPage({ onStart }) {
  return (
    <div className="start-page">
      <h1>Welcome to Tic-Tac-Toe</h1>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}

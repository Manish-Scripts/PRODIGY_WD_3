import React, { useState } from "react";
import Square from "./Square";

const Board = () => {
  const [ setSquares] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const calculateWinner = (squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const handleClick = (index) => {
    const currentHistory = history.slice(0, stepNumber + 1);
    const currentSquares =
      currentHistory[currentHistory.length - 1].squares.slice();

    if (currentSquares[index] || calculateWinner(currentSquares)) {
      return;
    }

    currentSquares[index] = xIsNext ? "X" : "O";

    setHistory(currentHistory.concat({ squares: currentSquares }));
    setStepNumber(currentHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (move) => {
    setStepNumber(move);
    setXIsNext(move % 2 === 0);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const renderMoves = () => {
    return history.map((step, move) => {
      const desc = move ? `Go to move ${move}` : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    });
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
  };

  const currentSquares = history[stepNumber].squares;
  const winner = calculateWinner(currentSquares);
  const status = winner
    ? `Winner: ${winner}`
    : currentSquares.every((square) => square)
    ? "It's a Draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board">
        {currentSquares.map((square, index) => (
          <Square
            key={index}
            value={square}
            onClick={() => handleClick(index)}
            isWinningSquare={winner && winner.includes(index)}
          />
        ))}
      </div>
      <div className="button-container">
        <div className="reset-button">
          <button onClick={handleReset}>Reset Game</button>
        </div>
        <div className="history-button">
          <button onClick={toggleHistory}>History</button>
        </div>
      </div>
      {showHistory && (
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{renderMoves()}</ol>
        </div>
      )}
    </div>
  );
};

export default Board;

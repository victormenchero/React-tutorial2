import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  let cssWinner = 'square winner';
  let cssSquare = 'square';
  let isWinner = props.winner;

  return (
    <button
      className={isWinner ? cssWinner : cssSquare}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        winner={this.props.winner.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createGrid = () => {
    let outerDiv = [];
    let cont = 0;
    for (let i = 0; i < 3; i++) {
      let rowsDiv = [];
      for (let j = 0; j < 3; j++) {
        rowsDiv.push(this.renderSquare(cont));
        cont++;
      }
      outerDiv.push(
        <div key={cont} className="board-row">
          {rowsDiv}
        </div>,
      );
    }
    return outerDiv;
  };

  render() {
    return <div>{this.createGrid()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), click: 0 }],
      stepNumber: 0,
      xIsNext: true,
      isReverse: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const newSquares = current.squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: newSquares, click: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  reversePlease() {
    this.setState(
      (prevState) => ({ isReverse: !prevState.isReverse }),
      () => console.log(this.state.isReverse),
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares) || [];
    let _getClassNames = '';

    let moves = history.map((step, move) => {
      if (this.state.stepNumber === move) {
        _getClassNames = 'buttonText';
      } else {
        _getClassNames = '';
      }
      const position = [
        '(0,0)',
        '(0,1)',
        '(0,2)',
        '(1,0)',
        '(1,1)',
        '(1,2)',
        '(2,0)',
        '(2,1)',
        '(2,2)',
      ];

      const desc = move
        ? 'Go to move # ' + move + position[history[move].click]
        : 'Go to game start';

      return (
        <li key="move">
          <button className={_getClassNames} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    if (this.state.isReverse) {
      moves = moves.reverse();
    }

    let status;
    if (moves.length >= 10 && winner.length === 0) {
      status = 'DRAW';
    } else if (winner.length > 0) {
      status = 'Winner ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="buttonContainer">
          <button onClick={() => this.reversePlease()}>Reverse me!</button>
        </div>
      </div>
    );
  }
}

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
      return lines[i];
    }
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button className={props.name} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    renderSquare(i, col, row) {
        return <Square name='square' value={this.props.squares[i]} onClick={() => this.props.onClick(i, col, row)} />;
    }

    createRow(num, row) {
        let boardRow = [];
        for (var i = 1; i < 4; i++) {
            boardRow.push(this.renderSquare(num, i, row));
            num++;
        }
        return boardRow;
    }

    createBoard() {
        let board = [];
        for (var j = 0; j < 3; j++) {
            board.push(<div className='board-row'>{this.createRow(j * 3, j)}</div>);
        }
        return board;
    }

    render() {
        return <div>{this.createBoard()}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    position: ""
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i, col, row) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        let position = "(" + col + ", " + row + ")";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    position: position
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            let bold = this.state.stepNumber === move ? "bold" : "";
            const desc = move ? "Go to move #" + move + " at " + history[move].position : "Go to game start";
            return (
                <li key={move}>
                    <button className={bold} onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board squares={current.squares} onClick={(i, col, row) => this.handleClick(i, col, row)} />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

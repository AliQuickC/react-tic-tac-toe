import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ // массив с 1 элементом(массивом)
				squares: Array(9).fill(null),
			}],
			stepNumber: 0, // номер хода
			xIsNext: true, // первый ход за Х
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1); // новый массив состояний, от 0 до предыдущего хода
		const current = history[history.length - 1];	// состояние предыдущего хода
		const squares = current.squares.slice();			// копия массива, состояние предыдущего хода
		if (calculateWinner(squares) || squares[i]) { // проверяем победу(предыдущий ход) или клетка не пустая
			return;																			// блокируем дальнейшую обработку клика
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';// меняем элемент массива, получаем состояние текущиего хода
		this.setState({// закидываем копию массива в state
			history: history.concat([{ // созает новый массив, массив истории ходов +
				squares: squares, // добавляем новый элемент, содержащий новый ход, в state
			}]),
			stepNumber: history.length, // устанавливаем текущий номер хода
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) { // переход к ходу № по истории игры
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() {
		const history = this.state.history; // массив ходов, (включая последний ход)
		const current = history[this.state.stepNumber]; // массив, состояние последнего хода

		const winner = calculateWinner(current.squares); // проверяем победу
		// вывод инфо о ходе игры
		let status;
		if (winner) {
			status = 'Выиграл ' + winner;
		} else {
			status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		// отрисовка кнопок с историей ходов игры
		const moves = history.map((step, move) => {
			const desc = move ? // текст кнопки
				'Перейти к ходу №' + move :
				'К началу игры'; // если индекс массива 0
			return (
				<li key={move}> {/* key - номер хода */}
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// ========================================

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
			return squares[a];
		}
	}
	return null;
}

// ========================================

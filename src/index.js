import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const LAST_STEP = 9;

function Square(props) {
	return (
		<button className={props.victoryLine ? "square win-square" : "square"} onClick={props.onClick}>
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
				onClick={() => this.props.onClick(i)}
				victoryLine={this.props.victoryLine && this.props.victoryLine.includes(i)}
			/>
		);
	}

	renderRow = (rowNumb, countNumb) => {
		const startNumb = rowNumb * 3
		const squares = [];
		for (let i = startNumb; i < startNumb + countNumb; i++) {
			squares.push(this.renderSquare(i));
		}
		return 	<div key={rowNumb} className="board-row">
							{squares}
						</div>;
	}

	board = (size) => {
		const boar = [];
		for (let i = 0; i < size; i++) {
			boar.push(this.renderRow(i, size));
		}
		return boar;
	}

	render() {

		return (
			<div>
				{this.board(3)}
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
			victoryLine: null,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1); // новый массив состояний, от 0 до предыдущего хода
		const current = history[history.length - 1];	// состояние предыдущего хода
		const squares = current.squares.slice();			// копия массива, состояние предыдущего хода
		if (squares[i] || calculateWinner(squares)) { // проверяем победу(предыдущий ход) или клетка не пустая
			return;																			// блокируем дальнейшую обработку клика
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';// меняем элемент массива, получаем состояние текущиего хода
		this.setState({// закидываем копию массива в state
			history: history.concat([{ // созает новый массив, массив истории ходов +
				squares: squares, // добавляем новый элемент, содержащий новый ход, в state
			}]),
			stepNumber: history.length, // устанавливаем текущий номер хода
			xIsNext: !this.state.xIsNext,
			victoryLine: calculateWinner(squares)?.vLine,
		});
	}

	jumpTo(step) { // переход к ходу № по истории игры
		const victoryLine = calculateWinner(this.state.history[step].squares) ? calculateWinner(this.state.history[step].squares).vLine : null
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
			victoryLine: victoryLine,
		});
	}

	getDifferingSquareIndex(arr1, arr2) { // возвращает индекс отличающейся клетки, у предыдущего и текущего ходов
		return arr1.findIndex((elem, index) => {
			return elem !== arr2[index];
		})
	}

	getSquareCoord(numb) {
		return '(стр: ' + (Math.floor(numb / 3) + 1) + '; кол: ' + (Math.floor(numb % 3) + 1) + ')'
	}

	render() {
		const history = this.state.history; // массив ходов, (включая последний ход)
		const current = history[this.state.stepNumber]; // массив, состояние последнего хода

		const winner = calculateWinner(current.squares); // проверяем победу
		// вывод инфо о ходе игры
		let status;
		if (winner) {
			status = 'Выиграл ' + winner.win;
		} else {
			status = this.state.stepNumber === LAST_STEP ? 'Игра закончена, победителя нет' : 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		// отрисовка кнопок с историей ходов игры
		const moves = history.map((step, move) => {
			const clickNumber = move ? this.getDifferingSquareIndex(step.squares, history[move - 1].squares) : null // индекс различающейся клетки

			const desc = move ? // текст кнопки
				'Перейти к ходу №' +
				move + ': ' +																// номер хода
				history[move].squares[clickNumber] + ' ' +	// X или O
				this.getSquareCoord(clickNumber) :					// координаты выбранной клетки
				'К началу игры';														// если индекс массива истории игры 0
			const activeStepClass = move === this.state.stepNumber ? 'step active-step' : 'step';
			return (
				<li key={move} className={activeStepClass}> {/* key - номер хода */}
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						victoryLine = {this.state.victoryLine}
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
			return {win: squares[a], vLine: lines[i]};
		}
	}
	return null;
}

// ========================================

class GameBoard {
	static count = 0;
	matrix = null;
	constructor(container) {
		this.id = ++GameBoard.count;
		this.container = container;

		this.matrix = Array(GRID_HEIGHT)
			.fill(0)
			.map(() => Array(GRID_WIDTH).fill(0));
	}

	setGrid(x, y, value) {
		this.matrix[y][x] = value;
	}

	getGrid(x, y) {
		return this.matrix[y][x];
	}

	setTile(x, y, color, darken = false) {
		const element = document.querySelector(`#G${this.id}_${x}-${y}`);
		if (!element) return;
		if (color === null) {
			element.classList.remove("full");
			element.classList.remove("dark");
			element.style.backgroundColor = "";
			return;
		}

		if (darken) {
			element.classList.add("dark");
		} else {
			element.classList.remove("dark");
		}
		element.classList.add("full");
		element.style.backgroundColor = `#${color}`;
	}

	moveLines(minY) {
		for (let y = minY; y < GRID_HEIGHT - 1; y++) {
			for (let x = 0; x < GRID_WIDTH; x++) {
				this.setGrid(x, y, this.getGrid(x, y + 1));
				this.setTile(x, y, this.getGrid(x, y));
			}
		}
	}

	clearLines() {
		for (let i = 0; i < GRID_HEIGHT; i++) {
			const row = matrix[i];
			if (row.every((c) => c != 0)) {
				this.moveLines(i);
				i--;
			}
		}
	}
}

class Game {
	static games = [];

	score = 0;
	currentShape = null;
	active = true;
	shapes = [];

	static loop() {
		Game.games.forEach((game) => {
			if (game.active) {
				game.nextStep();
			}
		});

		setTimeout(Game.loop, 500);
	}

	constructor(gameBoard) {
		this.games.push(this);
		this.gameBoard = gameBoard;

		this.shapes = ShapeTemplate.shapes.map(
			(shape) => new Shape(shape, this)
		);
	}

	nextShape() {
		this.currentShape.reset();
		const randomShape =
			this.shapes[Math.floor(Math.random() * this.shapes.length)];
		this.currentShape = randomShape;
		this.currentShape.place();
	}

	nextStep() {
		// TODO: Game end logic
		this.currentShape.moveDown();
	}

	// movement
	moveLeft() {
		this.currentShape.moveLeft();
	}

	moveRight() {
		this.currentShape.moveRight();
	}

	moveDown() {
		this.currentShape.moveDown();
	}

	drop() {
		this.currentShape.drop();
	}

	rotate() {
		this.currentShape.rotate();
	}

	// game
	start() {
		this.active = true;
	}

	stop() {
		this.active = false;
	}
}

class Game {
	static games = [];

	score = 0;
	currentShape = null;
	active = true;
	shapes = [];

	static loop() {
		Game.games.forEach((game, i) => {
			if (i !== 0) {
				const num = Math.floor(Math.random() * 5);
				if (num === 0) game.moveLeft();
				if (num === 1) game.moveRight();
				if (num === 2) game.moveDown();
				if (num === 3) game.drop();
			}
			if (game.active) {
				game.nextStep();
			}
		});

		setTimeout(Game.loop, 500);
	}

	constructor(gameBoard) {
		Game.games.push(this);
		this.gameBoard = gameBoard;

		this.shapes = ShapeTemplate.shapes.map(
			(shape) => new Shape(shape, this)
		);

		this.nextShape();
	}

	nextShape() {
		this.currentShape?.reset();
		const randomShape =
			this.shapes[Math.floor(Math.random() * this.shapes.length)];
		this.currentShape = randomShape;
		this.currentShape.place();
	}

	nextStep() {
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

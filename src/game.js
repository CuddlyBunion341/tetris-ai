class Game {
	static games = [];

	score = 0;
	currentShape = null;
	active = true;
	shapes = [];
	queue = [];

	static loop() {
		Game.games.forEach((game, i) => {
			if (false) {
				// do not use random movement for now
				const num = Math.floor(Math.random() * 5);
				if (num === 0) game.moveLeft();
				if (num === 1) game.moveRight();
				if (num === 2) game.moveDown();
				if (num === 3) game.drop();
			}

			game.nextStep();
		});

		setTimeout(Game.loop, 500);
	}

	constructor(board) {
		Game.games.push(this);
		this.board = board;

		this.shapes = ShapeTemplate.shapes.map(
			(shape) => new Shape(shape, this)
		);

		// fill queue
		for (let i = 0; i < 3; i++) {
			this.queue.push(this.randomShape());
		}

		this.nextShape();
	}

	randomShape() {
		return this.shapes[Math.floor(Math.random() * this.shapes.length)];
	}

	nextShape() {
		this.currentShape?.reset();

		this.currentShape = this.queue.shift();
		this.queue.push(this.randomShape());

		// test game over
		if (this.currentShape.testCollision(0, 0)) {
			this.stop();
			return;
		}

		this.currentShape.place();

		this.board.container.style.outlineColor = this.currentShape.color;
	}

	nextStep() {
		if (!this.active) return;
		this.currentShape.moveDown();
	}

	// movement
	moveLeft() {
		if (!this.active) return;
		this.currentShape.moveLeft();
	}

	moveRight() {
		if (!this.active) return;
		this.currentShape.moveRight();
	}

	moveDown() {
		if (!this.active) return;
		this.currentShape.moveDown();
	}

	drop() {
		if (!this.active) return;
		this.currentShape.drop();
	}

	rotate() {
		if (!this.active) return;
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

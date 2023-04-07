class Game {
	static games = [];
	static timer = 0;

	score = 0;
	currentShape = null;
	active = true;
	shapes = [];
	queue = [];

	static loop() {
		Game.timer++;

		Game.games.forEach((game, i) => {
			if (i == 0) {
				// do not use random movement for now
				const num = Math.floor(Math.random() * 4);
				if (num === 0) game.moveLeft();
				if (num === 1) game.moveRight();
				if (num === 2) game.rotate();
				if (num === 3) game.drop();
			}
			if (Game.timer % 5 == 0) {
				game.nextStep();
			}
		});

		setTimeout(Game.loop, 100);
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
		const index = Math.floor(Math.random() * this.shapes.length);
		const shape = this.shapes[index];
		console.log("random:", shape);
		return shape;
	}

	nextShape() {
		this.currentShape?.reset();

		this.currentShape = this.queue.shift();
		this.queue.push(this.randomShape());

		this.queue.forEach((shape, i) => {
			// set queue
			this.board.setQueue(i, ShapeTemplate.shapes[shape.id - 1]);
		});

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
